import React from 'react';
import { Form, Input, DatePicker, Select, InputNumber, Button } from 'antd';
import { TransactionFormData } from '../../types/accounting';
import dayjs from 'dayjs';

interface TransactionFormProps {
  initialValues?: TransactionFormData;
  onSubmit: (values: TransactionFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading
}) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    const formattedValues = {
      ...values,
      date: values.date.format('YYYY-MM-DD'),
    };
    onSubmit(formattedValues);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues ? {
        ...initialValues,
        date: dayjs(initialValues.date),
      } : {
        date: dayjs(),
        status: 'pending',
      }}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="type"
        label="Type"
        rules={[{ required: true, message: 'Le type est requis' }]}
      >
        <Select>
          <Select.Option value="income">Recette</Select.Option>
          <Select.Option value="expense">Dépense</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="date"
        label="Date"
        rules={[{ required: true, message: 'La date est requise' }]}
      >
        <DatePicker className="w-full" format="DD/MM/YYYY" />
      </Form.Item>

      <Form.Item
        name="category"
        label="Catégorie"
        rules={[{ required: true, message: 'La catégorie est requise' }]}
      >
        <Select>
          <Select.OptGroup label="Recettes">
            <Select.Option value="rent">Loyers</Select.Option>
            <Select.Option value="deposit">Dépôts de garantie</Select.Option>
            <Select.Option value="fees">Frais d'agence</Select.Option>
          </Select.OptGroup>
          <Select.OptGroup label="Dépenses">
            <Select.Option value="maintenance">Entretien</Select.Option>
            <Select.Option value="insurance">Assurance</Select.Option>
            <Select.Option value="taxes">Taxes</Select.Option>
            <Select.Option value="utilities">Charges</Select.Option>
          </Select.OptGroup>
        </Select>
      </Form.Item>

      <Form.Item
        name="amount"
        label="Montant"
        rules={[{ required: true, message: 'Le montant est requis' }]}
      >
        <InputNumber
          className="w-full"
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
          parser={value => value!.replace(/\s?/g, '')}
          prefix="€"
        />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'La description est requise' }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item
        name="reference"
        label="Référence"
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="status"
        label="Statut"
        rules={[{ required: true, message: 'Le statut est requis' }]}
      >
        <Select>
          <Select.Option value="pending">En attente</Select.Option>
          <Select.Option value="completed">Complété</Select.Option>
          <Select.Option value="cancelled">Annulé</Select.Option>
        </Select>
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

export default TransactionForm;