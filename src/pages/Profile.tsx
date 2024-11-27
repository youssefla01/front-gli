import React from 'react';
import { Card, Form, Input, Button, Divider, message } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import { ProfileUpdateData } from '../types/user';
import axios from 'axios';
import { User2 } from 'lucide-react';

const Profile = () => {
  const { user, updateUserInfo } = useAuth();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const onUpdateProfile = async (values: ProfileUpdateData) => {
    try {
      const response = await axios.patch('/api/users/profile', {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
      });
      updateUserInfo(response.data);
      message.success('Profil mis à jour avec succès');
    } catch (error) {
      message.error('Erreur lors de la mise à jour du profil');
    }
  };

  const onChangePassword = async (values: ProfileUpdateData) => {
    try {
      await axios.post('/api/users/change-password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      message.success('Mot de passe modifié avec succès');
      passwordForm.resetFields();
    } catch (error) {
      message.error('Erreur lors du changement de mot de passe');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-50 rounded-lg">
            <User2 className="w-6 h-6 text-blue-900" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Paramètres du profil</h1>
            <p className="text-gray-600">Gérez vos informations personnelles</p>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            firstName: user?.firstName,
            lastName: user?.lastName,
            email: user?.email,
          }}
          onFinish={onUpdateProfile}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="firstName"
              label="Prénom"
              rules={[{ required: true, message: 'Le prénom est requis' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="Nom"
              rules={[{ required: true, message: 'Le nom est requis' }]}
            >
              <Input />
            </Form.Item>
          </div>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "L'email est requis" },
              { type: 'email', message: 'Email invalide' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Mettre à jour le profil
            </Button>
          </Form.Item>
        </Form>

        <Divider />

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Changer le mot de passe</h2>
          <p className="text-gray-600">Assurez-vous d'utiliser un mot de passe sécurisé</p>
        </div>

        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={onChangePassword}
        >
          <Form.Item
            name="currentPassword"
            label="Mot de passe actuel"
            rules={[{ required: true, message: 'Le mot de passe actuel est requis' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Nouveau mot de passe"
            rules={[
              { required: true, message: 'Le nouveau mot de passe est requis' },
              { min: 8, message: 'Le mot de passe doit contenir au moins 8 caractères' }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirmer le mot de passe"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Veuillez confirmer le mot de passe' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Les mots de passe ne correspondent pas'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Changer le mot de passe
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Profile;