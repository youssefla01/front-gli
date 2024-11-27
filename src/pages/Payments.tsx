import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { 
  Table, Button, Input, Modal, message, 
  Tag, Space, Tooltip, DatePicker 
} from 'antd';
import { Plus, Search, Edit2, Trash2, Calendar } from 'lucide-react';
import axios from 'axios';
import PaymentForm from '../components/payments/PaymentForm';
import { Payment, PaymentFormData } from '../types/payment';
import dayjs from 'dayjs';

const { Search: AntSearch } = Input;
const { RangePicker } = DatePicker;

const Payments = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  const { data: payments = [], isLoading, refetch } = useQuery(
    ['payments', searchTerm, dateRange],
    async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (dateRange) {
        params.append('startDate', dateRange[0].format('YYYY-MM-DD'));
        params.append('endDate', dateRange[1].format('YYYY-MM-DD'));
      }
      const response = await axios.get(`/api/payments?${params}`);
      return response.data?.payments || []; // Ensure we always return an array
    }
  );

  const handleCreateOrUpdate = async (values: PaymentFormData) => {
    try {
      if (selectedPayment) {
        await axios.patch(`/api/payments/${selectedPayment.id}`, values);
        message.success('Paiement modifié avec succès');
      } else {
        await axios.post('/api/payments', values);
        message.success('Paiement créé avec succès');
      }
      setIsModalVisible(false);
      setSelectedPayment(null);
      refetch();
    } catch (error) {
      message.error('Une erreur est survenue');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/payments/${id}`);
      message.success('Paiement supprimé avec succès');
      refetch();
    } catch (error) {
      message.error('Une erreur est survenue');
    }
  };

  const getStatusColor = (status: Payment['status']) => {
    const colors = {
      pending: 'orange',
      completed: 'green',
      failed: 'red',
    };
    return colors[status];
  };

  const getStatusLabel = (status: Payment['status']) => {
    const labels = {
      pending: 'En attente',
      completed: 'Complété',
      failed: 'Échoué',
    };
    return labels[status];
  };

  const getTypeLabel = (type: Payment['type']) => {
    const labels = {
      rent: 'Loyer',
      deposit: 'Dépôt de garantie',
      fees: 'Frais',
    };
    return labels[type];
  };

  const columns = [
    {
      title: 'Bien / Locataire',
      key: 'lease',
      render: (_: any, record: Payment) => (
        <div>
          <div className="font-medium">{record.lease?.property?.address}</div>
          <div className="text-sm text-gray-500">
            {record.lease?.tenant?.lastName} {record.lease?.tenant?.firstName}
          </div>
        </div>
      ),
    },
    {
      title: 'Type',
      key: 'type',
      render: (_: any, record: Payment) => (
        <Tag>{getTypeLabel(record.type)}</Tag>
      ),
    },
    {
      title: 'Montant',
      key: 'amount',
      render: (_: any, record: Payment) => (
        <div className="font-medium">
          {new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
          }).format(record.amount)}
        </div>
      ),
    },
    {
      title: 'Échéance',
      key: 'dueDate',
      render: (_: any, record: Payment) => (
        <div className="space-y-1">
          <div>{dayjs(record.dueDate).format('DD/MM/YYYY')}</div>
          {record.paymentDate && (
            <div className="text-sm text-gray-500">
              Payé le {dayjs(record.paymentDate).format('DD/MM/YYYY')}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Statut',
      key: 'status',
      render: (_: any, record: Payment) => (
        <Tag color={getStatusColor(record.status)}>
          {getStatusLabel(record.status)}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Payment) => (
        <Space>
          <Tooltip title="Modifier">
            <Button
              icon={<Edit2 className="w-4 h-4" />}
              onClick={() => {
                setSelectedPayment(record);
                setIsModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Supprimer">
            <Button
              danger
              icon={<Trash2 className="w-4 h-4" />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <AntSearch
            placeholder="Rechercher un paiement..."
            allowClear
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
            prefix={<Search className="w-4 h-4 text-gray-400" />}
          />
          <RangePicker
            onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
            format="DD/MM/YYYY"
            className="w-full sm:w-auto"
            placeholder={['Date début', 'Date fin']}
            suffixIcon={<Calendar className="w-4 h-4" />}
          />
        </div>
        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setSelectedPayment(null);
            setIsModalVisible(true);
          }}
        >
          Nouveau paiement
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={payments}
        loading={isLoading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
        }}
      />

      <Modal
        title={selectedPayment ? 'Modifier le paiement' : 'Nouveau paiement'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedPayment(null);
        }}
        footer={null}
        width={800}
      >
        <PaymentForm
          initialValues={selectedPayment || undefined}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => {
            setIsModalVisible(false);
            setSelectedPayment(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default Payments;