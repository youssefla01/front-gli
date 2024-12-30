import React from 'react';
import { Form, Input, Upload, message } from 'antd';
import { OwnerFormData } from '../../types/owner';
import dayjs from 'dayjs';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

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
  loading,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    const formattedValues = {
      ...values,
      date_creation: initialValues?.date_creation || new Date().toISOString(),
      date_mise_a_jour: new Date().toISOString(),
    };
    if (values.piece_jointe) {
      formattedValues.piece_jointe = values.piece_jointe.file.name; 
    }
    onSubmit(formattedValues);
  };

  const uploadProps = {
    beforeUpload: (file: File) => {
      const isPDFOrImage =
        file.type === 'application/pdf' ||
        file.type.startsWith('image/');
      if (!isPDFOrImage) {
        message.error('Vous ne pouvez télécharger que des fichiers PDF ou images!');
      }
      return isPDFOrImage || Upload.LIST_IGNORE;
    },
    maxCount: 1, // Une seule pièce jointe
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={
        initialValues
          ? {
              ...initialValues,
              date_mise_a_jour: dayjs(initialValues?.date_mise_a_jour),
            }
          : undefined
      }
      onFinish={handleSubmit}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
     

        <Form.Item
          name="prenom"
          label="Prénom"
          rules={[   { required: true, message: 'Le prénom est requis' },
            { pattern: /^[a-zA-Z]+$/, message: 'Le prénom ne peut contenir que des lettres' },
            { min: 2, message: 'Le prénom doit avoir au moins 2 caractères' }]}
        >
          <Input placeholder="Entrez votre prénom" />
        </Form.Item>

        <Form.Item
          name="nom"
          label="Nom"
          rules={[
            { required: true, message: 'Le nom est requis' },
            { pattern: /^[a-zA-Z]+$/, message: 'Le nom ne peut contenir que des lettres' },
            { min: 2, message: 'Le nom doit avoir au moins 2 caractères' }
          ]}
        >
          <Input placeholder="Entrez votre nom" />
        </Form.Item>
      </div>

      <Form.Item
        name="email"
        label="Adresse email"
        rules={[
          { type: 'email', message: "L'email est invalide" },
        ]}
      >
        <Input placeholder="exemple@domaine.com" />
      </Form.Item>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="telephone"
          label="Téléphone"
          rules={[
            { required: true, message: 'Le numéro de téléphone est requis' },
            {
              pattern: /^\d{10}$/,
              message: 'Le numéro de téléphone doit contenir exactement 10 chiffres',
            },
          ]}
        >
          <Input placeholder="0612345678" />
        </Form.Item>

        <Form.Item
          name="numero_urgence"
          label="Numéro d'urgence"
          rules={[
            {
              pattern: /^\d{10}$/,
              message: 'Le numéro d\'urgence doit contenir exactement 10 chiffres',
            },
          ]}
        >
          <Input placeholder="Numéro d'urgence (optionnel)" />
        </Form.Item>
      </div>

      <Form.Item
        name="adresse"
        label="Adresse complète"
        rules={[{ required: true, message: "L'adresse est requise" }]}
      >
        <Input.TextArea
          rows={2}
          placeholder="Entrez votre adresse complète (ex : 123 Rue de Paris, 75000 Paris)"
        />
      </Form.Item>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="identifiant_fiscal"
          label="Identifiant fiscal"
        >
          <Input placeholder="Entrez votre identifiant fiscal" />
        </Form.Item>

        <Form.Item
          name="rib"
          label="RIB"
          rules={[
            {
              pattern: /^\d{11,27}$/,
              message: 'Le RIB doit contenir entre 11 et 27 chiffres',
            },
          ]}
        >
          <Input placeholder="Entrez votre RIB" />
        </Form.Item>
      </div>

      <Form.Item
        name="piece_jointe"
        label="Pièce jointe (facultatif)"
        rules={[{ required: false }]}
      >
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Cliquez ou glissez un fichier ici pour l'upload
          </p>
          <p className="ant-upload-hint">
            Types de fichiers acceptés : PDF, images (JPG, PNG). Taille max : 2 Mo.
          </p>
        </Dragger>
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
