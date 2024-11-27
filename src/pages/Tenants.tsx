import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { 
  Table, Button, Input, Modal, message, 
  Tooltip, Tag, Space 
} from 'antd';
import { Plus, Search, Mail, Phone, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TenantForm from '../components/tenants/TenantForm';
import { Tenant, TenantFormData } from '../types/tenant';
import dayjs from 'dayjs';

const { Search: AntSearch } = Input;

const Tenants = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const { data: tenants = [], isLoading, refetch } = useQuery(
    ['tenants', searchTerm],
    async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      const response = await axios.get(`/api/tenants?${params}`);
      return response.data?.tenants || [];
    }
  );

  const handleCreateOrUpdate = async (values: TenantFormData) => {
    try {
      if (selectedTenant) {
        await axios.patch(`/api/tenants/${selectedTenant.id}`, values);
        message.success('Locataire modifié avec succès');
      } else {
        await axios.post('/api/tenants', values);
        message.success('Locataire créé avec succès');
      }
      setIsModalVisible(false);
      setSelectedTenant(null);
      refetch();
    } catch (error) {
      message.error('Une erreur est survenue');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/tenants/${id}`);
      message.success('Locataire supprimé avec succès');
      refetch();
    } catch (error) {
      message.error('Une erreur est survenue');
    }
  };

  const handleRowClick = (record: Tenant) => {
    navigate(`/app/tenants/${record.id}`);
  };

  const columns = [
    {
      title: 'Nom',
      key: 'name',
      render: (_: any, record: Tenant) => (
        <div className="cursor-pointer hover:text-blue-900">
          <div className="font-medium">{record.lastName} {record.firstName}</div>
          <div className="text-sm text-gray-500">
            Né(e) le {dayjs(record.birthDate).format('DD/MM/YYYY')}
          </div>
        </div>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_: any, record: Tenant) => (
        <Space direction="vertical">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <a 
              href={`mailto:${record.email}`} 
              className="text-blue-900 hover:underline"
              onClick={e => e.stopPropagation()}
            >
              {record.email}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <a 
              href={`tel:${record.phone}`} 
              className="text-blue-900 hover:underline"
              onClick={e => e.stopPropagation()}
            >
              {record.phone}
            </a>
          </div>
        </Space>
      ),
    },
    {
      title: 'Profession',
      dataIndex: 'occupation',
      key: 'occupation',
    },
    {
      title: 'Revenu mensuel',
      key: 'monthlyIncome',
      render: (_: any, record: Tenant) => (
        <Tag color="green">
          {new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
          }).format(record.monthlyIncome)}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Tenant) => (
        <Space>
          <Tooltip title="Modifier">
            <Button
              icon={<Edit2 className="w-4 h-4" />}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTenant(record);
                setIsModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Supprimer">
            <Button
              danger
              icon={<Trash2 className="w-4 h-4" />}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(record.id);
              }}
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
          placeholder="Rechercher un locataire..."
          allowClear
          onChange={e => setSearchTerm(e.target.value)}
          className="w-64"
          prefix={<Search className="w-4 h-4 text-gray-400" />}
        />
        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setSelectedTenant(null);
            setIsModalVisible(true);
          }}
        >
          Nouveau locataire
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tenants}
        loading={isLoading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
        }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          className: 'cursor-pointer hover:bg-gray-50'
        })}
      />

      <Modal
        title={selectedTenant ? 'Modifier le locataire' : 'Nouveau locataire'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedTenant(null);
        }}
        footer={null}
        width={800}
      >
        <TenantForm
          initialValues={selectedTenant || undefined}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => {
            setIsModalVisible(false);
            setSelectedTenant(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default Tenants;