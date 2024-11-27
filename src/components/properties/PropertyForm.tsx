import React from 'react';
import { Form, Input, InputNumber, Select, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { PropertyFormData } from '../../types/property';
import { useQuery } from 'react-query';
import axios from 'axios';

interface PropertyFormProps {
  initialValues?: PropertyFormData;
  onSubmit: (values: PropertyFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const PropertyForm: React.FC<PropertyFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading
}) => {
  const [form] = Form.useForm();

  const { data: owners = [] } = useQuery('owners', async () => {
    const response = await axios.get('/api/owners');
    return response.data?.owners || [];
  });

  const handleSubmit = (values: any) => {
    const formattedValues = {
      ...values,
      image: values.image?.[0]?.url || values.image?.[0]?.response?.url || values.image
    };
    onSubmit(formattedValues);
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const defaultImageUrl = initialValues?.image || '';

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues ? {
        ...initialValues,
        image: defaultImageUrl ? [{ url: defaultImageUrl, uid: '-1', name: 'image.jpg' }] : []
      } : undefined}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="type"
        label="Type de bien"
        rules={[{ required: true, message: 'Le type est requis' }]}
      >
        <Select>
          <Select.Option value="apartment">Appartement</Select.Option>
          <Select.Option value="house">Maison</Select.Option>
          <Select.Option value="commercial">Local commercial</Select.Option>
          <Select.Option value="land">Terrain</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="image"
        label="Photo du bien"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload
          name="image"
          listType="picture-card"
          maxCount={1}
          beforeUpload={(file) => {
            // Simuler un upload réussi et retourner une URL d'image
            const fakeUrl = URL.createObjectURL(file);
            file.url = fakeUrl;
            return false;
          }}
        >
          <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>Ajouter une photo</div>
          </div>
        </Upload>
      </Form.Item>

      <Form.Item
        name="address"
        label="Adresse"
        rules={[{ required: true, message: "L'adresse est requise" }]}
      >
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'La description est requise' }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="surface"
          label="Surface (m²)"
          rules={[{ required: true, message: 'La surface est requise' }]}
        >
          <InputNumber min={0} className="w-full" />
        </Form.Item>

        <Form.Item
          name="rooms"
          label="Nombre de pièces"
          rules={[{ required: true, message: 'Le nombre de pièces est requis' }]}
        >
          <InputNumber min={0} className="w-full" />
        </Form.Item>
      </div>

      <Form.Item
        name="condition"
        label="État du bien"
        rules={[{ required: true, message: "L'état est requis" }]}
      >
        <Select>
          <Select.Option value="new">Neuf</Select.Option>
          <Select.Option value="good">Bon état</Select.Option>
          <Select.Option value="renovate">À rénover</Select.Option>
          <Select.Option value="poor">Mauvais état</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="estimatedPrice"
        label="Prix estimé (€)"
        rules={[{ required: true, message: 'Le prix estimé est requis' }]}
      >
        <InputNumber
          min={0}
          className="w-full"
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
          parser={value => value!.replace(/\s?/g, '')}
        />
      </Form.Item>

      <Form.Item
        name="ownerId"
        label="Propriétaire"
        rules={[{ required: true, message: 'Le propriétaire est requis' }]}
      >
        <Select
          showSearch
          placeholder="Sélectionner un propriétaire"
          optionFilterProp="children"
        >
          {owners.map((owner: any) => (
            <Select.Option key={owner.id} value={owner.id}>
              {owner.lastName} {owner.firstName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <div className="flex justify-end gap-2">
        <Button onClick={onCancel}>Annuler</Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialValues ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </Form>
  );
};

export default PropertyForm;