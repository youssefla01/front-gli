import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { 
  Table, Button, Input, Modal, message, 
  Tooltip, Space 
} from 'antd';
import { Plus, Search, Mail, Phone, Edit2, Trash2, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TenantForm from '../components/tenants/TenantForm';
import { Tenant, TenantFormData } from '../types/tenant';

const { Search: AntSearch } = Input;

const Owners = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOwner, setSelectedOwner] = useState<Tenant | null>(null);

  const { data: owners = [], isLoading, refetch } = useQuery(
    ['owners', searchTerm],
    async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      const response = await axios.get(`/api/owners?${params}`);
      return response.data?.owners || [];
    }
  );

  const handleCreateOrUpdate = async (values: TenantFormData) => {
    try {
      if (selectedOwner) {
        await axios.patch(`/api/owners/${selectedOwner.id}`, values);
        message.success('Propriétaire modifié avec succès');
      } else {
        await axios.post('/api/owners', values);
        message.success('Propriétaire créé avec succès');
      }
      setIsModalVisible(false);
      setSelectedOwner(null);
      refetch();
    } catch (error) {
      message.error('Une erreur est survenue');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/owners/${id}`);
      message.success('Propriétaire supprimé avec succès');
      refetch();
    } catch (error) {
      message.error('Une erreur est survenue');
    }
  };

  const handleRowClick = (record: Tenant) => {
    navigate(`/app/owners/${record.id}`);
  };

  const columns = [
    {
      title: 'Nom',
      key: 'name',
      render: (_: any, record: Tenant) => (
        <div className="cursor-pointer hover:text-blue-900">
          <div className="font-medium">
            {record.lastName} {record.firstName}
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
      title: 'Biens',
      key: 'properties',
      render: (_: any, record: any) => (
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4 text-gray-400" />
          <span>{record.propertiesCount || 0} bien{(record.propertiesCount || 0) > 1 ? 's' : ''}</span>
        </div>
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
                setSelectedOwner(record);
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
          placeholder="Rechercher un propriétaire..."
          allowClear
          onChange={e => setSearchTerm(e.target.value)}
          className="w-64"
          prefix={<Search className="w-4 h-4 text-gray-400" />}
        />
        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setSelectedOwner(null);
            setIsModalVisible(true);
          }}
        >
          Nouveau propriétaire
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={owners}
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
        title={selectedOwner ? 'Modifier le propriétaire' : 'Nouveau propriétaire'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedOwner(null);
        }}
        footer={null}
        width={800}
      >
        <TenantForm
          initialValues={selectedOwner || undefined}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => {
            setIsModalVisible(false);
            setSelectedOwner(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default Owners;