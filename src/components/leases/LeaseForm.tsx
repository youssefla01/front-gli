import React from 'react';
import { Form, DatePicker, InputNumber, Select, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { LeaseFormData } from '../../types/lease';
import dayjs from 'dayjs';
import { useQuery } from 'react-query';
import axios from 'axios';

interface LeaseFormProps {
  initialValues?: LeaseFormData;
  onSubmit: (values: LeaseFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const LeaseForm: React.FC<LeaseFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading
}) => {
  const [form] = Form.useForm();

  const { data: properties } = useQuery('properties', () =>
    axios.get('/api/properties').then(res => res.data)
  );

  const { data: tenants } = useQuery('tenants', () =>
    axios.get('/api/tenants').then(res => res.data)
  );

  const { data: owners } = useQuery('owners', () =>
    axios.get('/api/owners').then(res => res.data)
  );

  const handleSubmit = (values: any) => {
    const formattedValues = {
      ...values,
      startDate: values.startDate.format('YYYY-MM-DD'),
      endDate: values.endDate.format('YYYY-MM-DD'),
    };
    onSubmit(formattedValues);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues ? {
        ...initialValues,
        startDate: dayjs(initialValues.startDate),
        endDate: dayjs(initialValues.endDate),
      } : undefined}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="propertyId"
        label="Bien"
        rules={[{ required: true, message: 'Le bien est requis' }]}
      >
        <Select
          showSearch
          placeholder="Sélectionner un bien"
          optionFilterProp="children"
        >
          {properties?.map((property: any) => (
            <Select.Option key={property.id} value={property.id}>
              {property.address} ({property.type})
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="tenantId"
          label="Locataire"
          rules={[{ required: true, message: 'Le locataire est requis' }]}
        >
          <Select
            showSearch
            placeholder="Sélectionner un locataire"
            optionFilterProp="children"
          >
            {tenants?.map((tenant: any) => (
              <Select.Option key={tenant.id} value={tenant.id}>
                {tenant.lastName} {tenant.firstName}
              </Select.Option>
            ))}
          </Select>
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
            {owners?.map((owner: any) => (
              <Select.Option key={owner.id} value={owner.id}>
                {owner.lastName} {owner.firstName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="startDate"
          label="Date de début"
          rules={[{ required: true, message: 'La date de début est requise' }]}
        >
          <DatePicker className="w-full" format="DD/MM/YYYY" />
        </Form.Item>

        <Form.Item
          name="endDate"
          label="Date de fin"
          rules={[{ required: true, message: 'La date de fin est requise' }]}
        >
          <DatePicker className="w-full" format="DD/MM/YYYY" />
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Form.Item
          name="monthlyRent"
          label="Loyer mensuel (€)"
          rules={[{ required: true, message: 'Le loyer mensuel est requis' }]}
        >
          <InputNumber
            className="w-full"
            min={0}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            parser={value => value!.replace(/\s?/g, '')}
          />
        </Form.Item>

        <Form.Item
          name="deposit"
          label="Dépôt de garantie (€)"
          rules={[{ required: true, message: 'Le dépôt de garantie est requis' }]}
        >
          <InputNumber
            className="w-full"
            min={0}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            parser={value => value!.replace(/\s?/g, '')}
          />
        </Form.Item>

        <Form.Item
          name="agencyFees"
          label="Frais d'agence (€)"
          rules={[{ required: true, message: "Les frais d'agence sont requis" }]}
        >
          <InputNumber
            className="w-full"
            min={0}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            parser={value => value!.replace(/\s?/g, '')}
          />
        </Form.Item>
      </div>

      <Form.Item
        name="status"
        label="Statut"
        rules={[{ required: true, message: 'Le statut est requis' }]}
      >
        <Select>
          <Select.Option value="active">Actif</Select.Option>
          <Select.Option value="pending">En attente</Select.Option>
          <Select.Option value="terminated">Résilié</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="documents"
        label="Documents"
        valuePropName="fileList"
        getValueFromEvent={e => e.fileList}
      >
        <Upload>
          <Button icon={<UploadOutlined />}>Ajouter des documents</Button>
        </Upload>
      </Form.Item>

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

export default LeaseForm;