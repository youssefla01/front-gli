import React, { useEffect } from 'react';
import { Form, Input, DatePicker, InputNumber,Select } from 'antd';
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
  loading,
}) => {
  const [form] = Form.useForm();
  console.log(initialValues);
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        date_naissance: dayjs(initialValues.date_naissance),
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);
  const handleSubmit = (values: any) => {
    const formattedValues = {
      ...values,
      date_naissance: values.date_naissance.format('YYYY-MM-DD') ,
    };
    onSubmit(formattedValues);
  };
 
  return (
    
    <Form
    
      form={form}
      layout="vertical"
      initialValues={
        initialValues
          ? {
              ...initialValues,
              date_naissance: dayjs(initialValues?.date_naissance),
            }
          : undefined
      }
      onFinish={handleSubmit}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "L'email est requis" },
            { type: 'email', message: 'Email invalide' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="telephone"
          label="Téléphone"
          rules={[{ required: true, message: 'Le téléphone est requis' }]}
        >
          <Input />
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="adresse"
          label="Adresse"
          rules={[{ required: true, message: "L'adresse est requise" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="cin"
          label="CIN"
          rules={[{ required: true, message: 'Le CIN est requis' }]}
        >
          <Input />
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="piece_identite"
          label="Pièce d'identité"
          rules={[{ required: true, message: "La pièce d'identité est requise" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="piece_jointe"
          label="Pièce jointe"
          rules={[{ required: true, message: 'La pièce jointe est requise' }]}
        >
          <Input />
        </Form.Item>
      </div>

      <Form.Item name="commentaire" label="Commentaire">
        <Input.TextArea rows={3} />
      </Form.Item>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="situation_familiale"
          label="Situation familiale"
          rules={[{ required: true, message: 'La situation familiale est requise' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="nombre_enfants"
          label="Nombre d'enfants"
          rules={[{ required: true, message: "Le nombre d'enfants est requis" }]}
        >
          <InputNumber className="w-full" min={0} />
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="profession"
          label="Profession"
          rules={[{ required: true, message: 'La profession est requise' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="nationalite"
          label="Nationalité"
          rules={[{ required: true, message: 'La nationalité est requise' }]}
        >
          <Input />
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="statut"
          label="Statut"
          rules={[{ required: true, message: 'Le statut est requis' }]}
        >
          <Select placeholder="Sélectionnez un statut">
            <Select.Option value="Actif">Actif</Select.Option>
            <Select.Option value="Inactif">Inactif</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="date_naissance"
          label="Date de naissance"
          rules={[{ required: true, message: 'La date de naissance est requise' }]}
        >
          <DatePicker className="w-full" format="DD/MM/YYYY" />
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="lieu_naissance"
          label="Lieu de naissance"
          rules={[{ required: true, message: 'Le lieu de naissance est requis' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="contact_urgence"
          label="Contact d'urgence"
          rules={[{ required: true, message: "Le contact d'urgence est requis" }]}
        >
          <Input />
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="genre"
          label="Genre"
          rules={[{ required: true, message: 'Le genre est requis' }]}
        >
          <Select placeholder="Sélectionnez un genre">
            <Select.Option value="Homme">Homme</Select.Option>
            <Select.Option value="Femme">Femme</Select.Option>
          </Select>
        </Form.Item>
      </div>

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