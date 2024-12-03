import React from 'react';
import { Form, Input, DatePicker, InputNumber } from 'antd';
import { OwnerFormData } from '../../types/owner';
import dayjs from 'dayjs';

interface OwnerFormProps {
  initialValues?: OwnerFormData;
  onSubmit: (values: OwnerFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const OwnerForm: React.FC<OwnerFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading
}) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    const formattedValues = {
      ...values,
      date_creation: initialValues?.date_creation || new Date().toISOString(),
      date_mise_a_jour: new Date().toISOString(),
    };
    onSubmit(formattedValues);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues ? {
        ...initialValues,
        date_mise_a_jour: dayjs(initialValues.date_mise_a_jour),
      } : undefined}
      onFinish={handleSubmit}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="nom"
          label="Nom"
          rules={[{ required: true, message: 'Le nom est requis' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="prenom"
          label="Prénom"
          rules={[{ required: true, message: 'Le prénom est requis' }]}
        >
          <Input />
        </Form.Item>
      </div>

      <Form.Item
        name="email"
        label="Adresse email"
        rules={[
          { required: true, message: "L'adresse email est requise" },
          { type: 'email', message: "L'email est invalide" },
        ]}
      >
        <Input />
      </Form.Item>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="telephone"
          label="Téléphone"
          rules={[{ required: true, message: 'Le numéro de téléphone est requis' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="numero_urgence"
          label="Numéro d'urgence"
          rules={[{ required: false }]}
        >
          <Input />
        </Form.Item>
      </div>

      <Form.Item
        name="adresse"
        label="Adresse complète"
        rules={[{ required: true, message: "L'adresse est requise" }]}
      >
        <Input.TextArea rows={2} />
      </Form.Item>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="identifiant_fiscal"
          label="Identifiant fiscal"
          rules={[{ required: true, message: "L'identifiant fiscal est requis" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="rib"
          label="RIB"
          rules={[{ required: true, message: 'Le RIB est requis' }]}
        >
          <Input />
        </Form.Item>
      </div>

      <Form.Item
        name="piece_jointe"
        label="Pièce jointe (facultatif)"
        rules={[{ required: false }]}
      >
        <Input />
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
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:opacity-50"
        >
          {initialValues ? 'Modifier' : 'Créer'}
        </button>
      </div>
    </Form>
  );
};

export default OwnerForm;
