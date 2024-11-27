import React, { useState } from 'react';
import { Table, Button, Input, Modal, message, Tag, Space, Switch } from 'antd';
import { Plus, Search, Edit2, Trash2, Shield } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import UserForm from '../components/users/UserForm';
import { User } from '../types/user';

const { Search: AntSearch } = Input;

const Users = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery(
    ['users', searchTerm],
    async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      const response = await axios.get(`/api/users?${params}`);
      return response.data?.users || [];
    }
  );

  const createUser = useMutation(
    (userData: any) => axios.post('/api/users', userData),
    {
      onSuccess: () => {
        message.success('Utilisateur créé avec succès');
        setIsModalVisible(false);
        queryClient.invalidateQueries('users');
      },
      onError: () => {
        message.error('Erreur lors de la création de l\'utilisateur');
      },
    }
  );

  const updateUser = useMutation(
    ({ id, data }: { id: string; data: any }) => 
      axios.patch(`/api/users/${id}`, data),
    {
      onSuccess: () => {
        message.success('Utilisateur modifié avec succès');
        setIsModalVisible(false);
        queryClient.invalidateQueries('users');
      },
      onError: () => {
        message.error('Erreur lors de la modification de l\'utilisateur');
      },
    }
  );

  const deleteUser = useMutation(
    (id: string) => axios.delete(`/api/users/${id}`),
    {
      onSuccess: () => {
        message.success('Utilisateur supprimé avec succès');
        queryClient.invalidateQueries('users');
      },
      onError: () => {
        message.error('Erreur lors de la suppression de l\'utilisateur');
      },
    }
  );

  const toggleUserStatus = useMutation(
    ({ id, status }: { id: string; status: 'active' | 'inactive' }) =>
      axios.patch(`/api/users/${id}/status`, { status }),
    {
      onSuccess: () => {
        message.success('Statut modifié avec succès');
        queryClient.invalidateQueries('users');
      },
      onError: () => {
        message.error('Erreur lors de la modification du statut');
      },
    }
  );

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'red',
      manager: 'blue',
      accountant: 'green',
      agent: 'orange',
    };
    return colors[role] || 'default';
  };

  const columns = [
    {
      title: 'Utilisateur',
      key: 'user',
      render: (user: User) => (
        <div>
          <div className="font-medium">
            {user.lastName} {user.firstName}
          </div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      ),
    },
    {
      title: 'Rôle',
      key: 'role',
      render: (user: User) => (
        <Tag color={getRoleColor(user.role)} icon={<Shield className="w-3 h-3" />}>
          {user.role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Statut',
      key: 'status',
      render: (user: User) => (
        <Switch
          checked={user.status === 'active'}
          onChange={(checked) => 
            toggleUserStatus.mutate({
              id: user.id,
              status: checked ? 'active' : 'inactive'
            })
          }
          checkedChildren="Actif"
          unCheckedChildren="Inactif"
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (user: User) => (
        <Space>
          <Button
            icon={<Edit2 className="w-4 h-4" />}
            onClick={() => {
              setSelectedUser(user);
              setIsModalVisible(true);
            }}
          />
          <Button
            danger
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => deleteUser.mutate(user.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <AntSearch
          placeholder="Rechercher un utilisateur..."
          allowClear
          onChange={e => setSearchTerm(e.target.value)}
          className="w-64"
          prefix={<Search className="w-4 h-4 text-gray-400" />}
        />
        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setSelectedUser(null);
            setIsModalVisible(true);
          }}
        >
          Nouvel utilisateur
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        loading={isLoading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
        }}
      />

      <Modal
        title={selectedUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedUser(null);
        }}
        footer={null}
        width={600}
      >
        <UserForm
          initialValues={selectedUser || undefined}
          onSubmit={(values) => {
            if (selectedUser) {
              updateUser.mutate({ id: selectedUser.id, data: values });
            } else {
              createUser.mutate(values);
            }
          }}
          onCancel={() => {
            setIsModalVisible(false);
            setSelectedUser(null);
          }}
          loading={createUser.isLoading || updateUser.isLoading}
        />
      </Modal>
    </div>
  );
};

export default Users;