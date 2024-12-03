import { useState } from 'react';
import { useQuery } from 'react-query';
import { Table, Button, Input, Modal, message, Tooltip, Space } from 'antd';
import { Plus, Search, Mail, Phone, Edit2, Trash2, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OwnerForm from '../components/owners/OwnerForm';
import { Owner, OwnerFormData } from '../types/owner';
import api from '../config/api';

const { Search: AntSearch } = Input;

const Owners = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);

  const { data: owners = [], isLoading, refetch } = useQuery(
    ['proprietaires', searchTerm],
    async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      const response = await api.get(`/proprietaires`,{ params });
      return response.data || [];
    }
  );

  const handleCreateOrUpdate = async (values: OwnerFormData ) => {
    try {
      if (selectedOwner) {
        await api.patch(`/proprietaires/${selectedOwner.id}`, values);
        message.success('Propriétaire modifié avec succès');
      } else {
        await api.post('/proprietaires', values);
        message.success('Propriétaire créé avec succès');
      }
      setIsModalVisible(false);
      setSelectedOwner(null);
      refetch();
    } catch (error) {
      message.error('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/proprietaires/${id}`);
      message.success('Propriétaire supprimé avec succès');
      refetch();
    } catch (error) {
      message.error('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  const handleRowClick = (record: Owner) => {
    navigate(`/app/owners/${record.id}`);
  };

  const columns = [
    {
      title: 'Nom',
      key: 'name',
      dataIndex: 'nom',
      filters: [
        { text: 'Dupont', value: 'Dupont' },
        { text: 'Martin', value: 'Martin' },
      ],
      onFilter: (value: any, record: Owner) => record.nom.includes(value),
      render: (_: any, record: Owner) => (
        <div className="cursor-pointer hover:text-blue-900">
          <div className="font-medium">
            {record.nom} {record.prenom}
          </div>
        </div>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_: any, record: Owner) => (
        <Space direction="vertical">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <a
              href={`mailto:${record.email}`}
              className="text-blue-900 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {record.email}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <a
              href={`tel:${record.telephone}`}
              className="text-blue-900 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {record.telephone}
            </a>
          </div>
        </Space>
      ),
    },
    {
      title: 'Biens',
      key: 'properties',
      dataIndex: 'propertiesCount',
      filters: [
        { text: '0 bien', value: 0 },
        { text: '1 bien', value: 1 },
        { text: '2 biens ou plus', value: 2 },
      ],
      onFilter: (value: any, record: any) => {
        if (value === 2) return record.propertiesCount >= 2;
        return record.propertiesCount === value;
      },
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
      render: (_: any, record: Owner) => (
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
          onChange={(e) => setSearchTerm(e.target.value)}
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
          className: 'cursor-pointer hover:bg-gray-50',
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
        <OwnerForm
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
