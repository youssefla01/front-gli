import React, { useState } from 'react';
import { Table, Button, Input, Modal, Tag, Space, Select, DatePicker } from 'antd';
import { Plus, Search, Edit2, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import dayjs from 'dayjs';
import TransactionForm from './TransactionForm';
import { Transaction } from '../../types/accounting';

const { Search: AntSearch } = Input;
const { RangePicker } = DatePicker;

const TransactionList = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>();
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery(
    ['transactions', searchTerm, dateRange, typeFilter],
    async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (dateRange) {
        params.append('startDate', dateRange[0].format('YYYY-MM-DD'));
        params.append('endDate', dateRange[1].format('YYYY-MM-DD'));
      }
      if (typeFilter) params.append('type', typeFilter);
      
      const response = await axios.get(`/api/transactions?${params}`);
      return response.data?.transactions || [];
    }
  );

  const createTransaction = useMutation(
    (data: any) => axios.post('/api/transactions', data),
    {
      onSuccess: () => {
        message.success('Transaction créée avec succès');
        setIsModalVisible(false);
        queryClient.invalidateQueries('transactions');
      },
      onError: () => {
        message.error('Erreur lors de la création de la transaction');
      },
    }
  );

  const updateTransaction = useMutation(
    ({ id, data }: { id: string; data: any }) =>
      axios.patch(`/api/transactions/${id}`, data),
    {
      onSuccess: () => {
        message.success('Transaction modifiée avec succès');
        setIsModalVisible(false);
        queryClient.invalidateQueries('transactions');
      },
      onError: () => {
        message.error('Erreur lors de la modification de la transaction');
      },
    }
  );

  const deleteTransaction = useMutation(
    (id: string) => axios.delete(`/api/transactions/${id}`),
    {
      onSuccess: () => {
        message.success('Transaction supprimée avec succès');
        queryClient.invalidateQueries('transactions');
      },
      onError: () => {
        message.error('Erreur lors de la suppression de la transaction');
      },
    }
  );

  const columns = [
    {
      title: 'Date',
      key: 'date',
      render: (transaction: Transaction) => dayjs(transaction.date).format('DD/MM/YYYY'),
    },
    {
      title: 'Type',
      key: 'type',
      render: (transaction: Transaction) => (
        <Tag
          icon={transaction.type === 'income' ? 
            <ArrowUpRight className="w-3 h-3" /> : 
            <ArrowDownLeft className="w-3 h-3" />
          }
          color={transaction.type === 'income' ? 'green' : 'red'}
        >
          {transaction.type === 'income' ? 'Recette' : 'Dépense'}
        </Tag>
      ),
    },
    {
      title: 'Catégorie',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Montant',
      key: 'amount',
      render: (transaction: Transaction) => (
        <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
          {new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
          }).format(transaction.amount)}
        </span>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Statut',
      key: 'status',
      render: (transaction: Transaction) => {
        const statusConfig = {
          pending: { color: 'orange', text: 'En attente' },
          completed: { color: 'green', text: 'Complété' },
          cancelled: { color: 'red', text: 'Annulé' },
        };
        const config = statusConfig[transaction.status];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (transaction: Transaction) => (
        <Space>
          <Button
            icon={<Edit2 className="w-4 h-4" />}
            onClick={() => {
              setSelectedTransaction(transaction);
              setIsModalVisible(true);
            }}
          />
          <Button
            danger
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => deleteTransaction.mutate(transaction.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <AntSearch
          placeholder="Rechercher une transaction..."
          allowClear
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full sm:w-64"
          prefix={<Search className="w-4 h-4 text-gray-400" />}
        />
        
        <RangePicker
          onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
          className="w-full sm:w-auto"
        />

        <Select
          placeholder="Type de transaction"
          allowClear
          onChange={setTypeFilter}
          className="w-full sm:w-48"
        >
          <Select.Option value="income">Recettes</Select.Option>
          <Select.Option value="expense">Dépenses</Select.Option>
        </Select>

        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setSelectedTransaction(null);
            setIsModalVisible(true);
          }}
          className="sm:ml-auto"
        >
          Nouvelle transaction
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={transactions}
        loading={isLoading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
        }}
      />

      <Modal
        title={selectedTransaction ? 'Modifier la transaction' : 'Nouvelle transaction'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedTransaction(null);
        }}
        footer={null}
        width={600}
      >
        <TransactionForm
          initialValues={selectedTransaction || undefined}
          onSubmit={(values) => {
            if (selectedTransaction) {
              updateTransaction.mutate({ id: selectedTransaction.id, data: values });
            } else {
              createTransaction.mutate(values);
            }
          }}
          onCancel={() => {
            setIsModalVisible(false);
            setSelectedTransaction(null);
          }}
          loading={createTransaction.isLoading || updateTransaction.isLoading}
        />
      </Modal>
    </div>
  );
};

export default TransactionList;