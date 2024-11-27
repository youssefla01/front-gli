import React, { useState } from 'react';
import { Table, Tag, Button, Modal, message } from 'antd';
import { Euro, AlertCircle, CheckCircle2, Clock, Plus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import dayjs from 'dayjs';
import RentStats from './stats/RentStats';
import RentPaymentForm from './RentPaymentForm';

const RentCollection = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: payments = [], isLoading } = useQuery(
    'current-payments',
    async () => {
      const currentMonth = dayjs().format('YYYY-MM');
      const response = await axios.get(`/api/payments?month=${currentMonth}`);
      return response.data?.payments || [];
    },
    {
      staleTime: 30000,
      cacheTime: 3600000,
    }
  );

  const { data: activeLeases = [] } = useQuery(
    'active-leases',
    async () => {
      const response = await axios.get('/api/leases?status=active');
      return response.data?.leases || [];
    }
  );

  const createPayment = useMutation(
    (paymentData: any) => axios.post('/api/payments', paymentData),
    {
      onSuccess: () => {
        message.success('Paiement enregistré avec succès');
        setIsModalVisible(false);
        setSelectedPayment(null);
        queryClient.invalidateQueries('current-payments');
        queryClient.invalidateQueries('rent-stats');
      },
      onError: () => {
        message.error('Erreur lors de l\'enregistrement du paiement');
      },
    }
  );

  const handlePayment = (payment: any) => {
    setSelectedPayment(payment);
    setIsModalVisible(true);
  };

  const handleNewPayment = () => {
    setSelectedPayment(null);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: 'Locataire / Bien',
      key: 'tenant',
      render: (payment: any) => (
        <div>
          <div className="font-medium">
            {payment.lease?.tenant?.lastName} {payment.lease?.tenant?.firstName}
          </div>
          <div className="text-sm text-gray-500">{payment.lease?.property?.address}</div>
        </div>
      ),
    },
    {
      title: 'Montant',
      key: 'amount',
      render: (payment: any) => (
        <div className="font-medium">
          {new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
          }).format(payment.amount)}
        </div>
      ),
    },
    {
      title: 'Échéance',
      key: 'dueDate',
      render: (payment: any) => dayjs(payment.dueDate).format('DD/MM/YYYY'),
    },
    {
      title: 'Statut',
      key: 'status',
      render: (payment: any) => {
        const getStatusConfig = (status: string) => {
          switch (status) {
            case 'completed':
              return { color: 'green', icon: <CheckCircle2 className="w-4 h-4" />, text: 'Payé' };
            case 'pending':
              return { color: 'orange', icon: <Clock className="w-4 h-4" />, text: 'En attente' };
            case 'late':
              return { color: 'red', icon: <AlertCircle className="w-4 h-4" />, text: 'En retard' };
            default:
              return { color: 'default', icon: null, text: status };
          }
        };

        const config = getStatusConfig(payment.status);
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (payment: any) => (
        <Button
          type="primary"
          icon={<Euro className="w-4 h-4" />}
          onClick={() => handlePayment(payment)}
          disabled={payment.status === 'completed'}
        >
          Encaisser
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <RentStats />
      
      <div className="flex justify-end">
        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleNewPayment}
          size="large"
          className="shadow-md hover:shadow-lg transition-shadow"
        >
          Nouveau paiement
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table
          columns={columns}
          dataSource={payments}
          rowKey="id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            responsive: true,
          }}
          scroll={{ x: 'max-content' }}
        />
      </div>

      <Modal
        title={selectedPayment ? "Enregistrer un paiement" : "Nouveau paiement"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedPayment(null);
        }}
        footer={null}
        width={600}
      >
        <RentPaymentForm
          lease={selectedPayment?.lease || activeLeases[0]}
          onSubmit={(values) => createPayment.mutate(values)}
          onCancel={() => {
            setIsModalVisible(false);
            setSelectedPayment(null);
          }}
          loading={createPayment.isLoading}
        />
      </Modal>
    </div>
  );
};

export default RentCollection;