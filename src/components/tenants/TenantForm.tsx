import React from 'react';
import { Form, Input, DatePicker, InputNumber } from 'antd';
import { TenantFormData } from '../../types/tenant';
import dayjs from 'dayjs';

interface TenantFormProps {
  initialValues?: TenantFormData;
  onSubmit: (values: TenantFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const TenantForm: React.FC<TenantFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading
}) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    const formattedValues = {
      ...values,
      birthDate: values.birthDate.format('YYYY-MM-DD'),
    };
    onSubmit(formattedValues);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues ? {
        ...initialValues,
        birthDate: dayjs(initialValues.birthDate),
      } : undefined}
      onFinish={handleSubmit}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <Form.Item
          name="phone"
          label="Téléphone"
          rules={[{ required: true, message: 'Le téléphone est requis' }]}
        >
          <Input />
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="birthDate"
          label="Date de naissance"
          rules={[{ required: true, message: 'La date de naissance est requise' }]}
        >
          <DatePicker className="w-full" format="DD/MM/YYYY" />
        </Form.Item>

        <Form.Item
          name="occupation"
          label="Profession"
          rules={[{ required: true, message: 'La profession est requise' }]}
        >
          <Input />
        </Form.Item>
      </div>

      <Form.Item
        name="monthlyIncome"
        label="Revenu mensuel (€)"
        rules={[{ required: true, message: 'Le revenu mensuel est requis' }]}
      >
        <InputNumber
          className="w-full"
          min={0}
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
          parser={value => value!.replace(/\s?/g, '')}
        />
      </Form.Item>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 disabled:opacity-50"
        >
          {initialValues ? 'Modifier' : 'Créer'}
        </button>
      </div>
    </Form>
  );
};

export default TenantForm;