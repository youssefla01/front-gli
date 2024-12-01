import React, { useEffect } from 'react';
import { Form, Input, Select, Button, Checkbox } from 'antd';
import { UserFormData } from '../../types/user';

interface UserFormProps {
  initialValues?: UserFormData;
  onSubmit: (values: UserFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading
}) => {
  const [form] = Form.useForm();
  
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues); 
    } else {
      form.resetFields(); 
    }
  }, [initialValues, form]);
  // const permissions = [
  //   { label: 'Gérer les biens', value: 'manage_properties' },
  //   { label: 'Gérer les locataires', value: 'manage_tenants' },
  //   { label: 'Gérer les propriétaires', value: 'manage_owners' },
  //   { label: 'Gérer les baux', value: 'manage_leases' },
  //   { label: 'Gérer les paiements', value: 'manage_payments' },
  //   { label: 'Gérer la comptabilité', value: 'manage_accounting' },
  //   { label: 'Gérer les utilisateurs', value: 'manage_users' },
  // ];

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onSubmit}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="prenom"
          label="Prénom"
          rules={[{ required: true, message: 'Le prénom est requis' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="nom"
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

      {!initialValues && (
        <Form.Item
          name="mot_de_passe"
          label="Mot de passe"
          rules={[
            { required: true, message: 'Le mot de passe est requis' },
            { min: 8, message: 'Le mot de passe doit contenir au moins 8 caractères' }
          ]}
        >
          <Input.Password />
        </Form.Item>
      )}

      <Form.Item
        name="role"
        label="Rôle"
        rules={[{ required: true, message: 'Le rôle est requis' }]}
      >
        <Select>
          <Select.Option value="admin">Admin</Select.Option>
          {/* <Select.Option value="manager">Gestionnaire</Select.Option>
          <Select.Option value="accountant">Comptable</Select.Option>
          <Select.Option value="agent">Agent</Select.Option> */}
        </Select>
      </Form.Item>

      {/* <Form.Item
        name="permissions"
        label="Permissions"
      >
        <Checkbox.Group options={permissions} />
      </Form.Item> */}

      <div className="flex justify-end gap-2">
        <Button onClick={onCancel}>
          Annuler
        </Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialValues ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </Form>
  );
};

export default UserForm;