import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { 
  Table, Button, Input, Modal, message, 
  Tag, Space, Tooltip 
} from 'antd';
import { Plus, Search, Edit2, Trash2, FileText } from 'lucide-react';
import axios from 'axios';
import LeaseForm from '../components/leases/LeaseForm';
import { Lease, LeaseFormData } from '../types/lease';
import dayjs from 'dayjs';

const { Search: AntSearch } = Input;

const Leases = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLease, setSelectedLease] = useState<Lease | null>(null);

  const { data: leases = [], isLoading, refetch } = useQuery(
    ['leases', searchTerm],
    async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      const response = await axios.get(`/api/leases?${params}`);
      return response.data?.leases || [];
    }
  );

  const handleCreateOrUpdate = async (values: LeaseFormData) => {
    try {
      if (selectedLease) {
        await axios.patch(`/api/leases/${selectedLease.id}`, values);
        message.success('Bail modifié avec succès');
      } else {
        await axios.post('/api/leases', values);
        message.success('Bail créé avec succès');
      }
      setIsModalVisible(false);
      setSelectedLease(null);
      refetch();
    } catch (error) {
      message.error('Une erreur est survenue');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/leases/${id}`);
      message.success('Bail supprimé avec succès');
      refetch();
    } catch (error) {
      message.error('Une erreur est survenue');
    }
  };

  const getStatusColor = (status: Lease['status']) => {
    const colors = {
      active: 'green',
      pending: 'orange',
      terminated: 'red',
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status: Lease['status']) => {
    const labels = {
      active: 'Actif',
      pending: 'En attente',
      terminated: 'Résilié',
    };
    return labels[status] || status;
  };

  const columns = [
    {
      title: 'Bien',
      key: 'property',
      render: (record: Lease) => record.property && (
        <div>
          <div className="font-medium">{record.property.address}</div>
          <div className="text-sm text-gray-500">{record.property.type}</div>
        </div>
      ),
    },
    {
      title: 'Locataire',
      key: 'tenant',
      render: (record: Lease) => record.tenant && (
        <span>{record.tenant.lastName} {record.tenant.firstName}</span>
      ),
    },
    {
      title: 'Période',
      key: 'period',
      render: (record: Lease) => record.startDate && record.endDate && (
        <div className="space-y-1">
          <div>Du: {dayjs(record.startDate).format('DD/MM/YYYY')}</div>
          <div>Au: {dayjs(record.endDate).format('DD/MM/YYYY')}</div>
        </div>
      ),
    },
    {
      title: 'Loyer',
      key: 'rent',
      render: (record: Lease) => (
        <Tag color="blue">
          {new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
          }).format(record.monthlyRent)}
          /mois
        </Tag>
      ),
    },
    {
      title: 'Statut',
      key: 'status',
      render: (record: Lease) => (
        <Tag color={getStatusColor(record.status)}>
          {getStatusLabel(record.status)}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Lease) => (
        <Space>
          <Tooltip title="Documents">
            <Button
              icon={<FileText className="w-4 h-4" />}
              onClick={() => {
                // Gérer l'affichage des documents
              }}
            />
          </Tooltip>
          <Tooltip title="Modifier">
            <Button
              icon={<Edit2 className="w-4 h-4" />}
              onClick={() => {
                setSelectedLease(record);
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
      <div className="flex justify-between items-center">
        <AntSearch
          placeholder="Rechercher un bail..."
          allowClear
          onChange={e => setSearchTerm(e.target.value)}
          className="w-64"
          prefix={<Search className="w-4 h-4 text-gray-400" />}
        />
        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setSelectedLease(null);
            setIsModalVisible(true);
          }}
        >
          Nouveau bail
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={leases}
        loading={isLoading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
        }}
      />

      <Modal
        title={selectedLease ? 'Modifier le bail' : 'Nouveau bail'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedLease(null);
        }}
        footer={null}
        width={800}
      >
        <LeaseForm
          initialValues={selectedLease || undefined}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => {
            setIsModalVisible(false);
            setSelectedLease(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default Leases;