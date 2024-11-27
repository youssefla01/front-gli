import React from 'react';
import { Form, Input, DatePicker, Select, InputNumber, Button } from 'antd';
import { Payment } from '../../types/payment';
import dayjs from 'dayjs';

interface RentPaymentFormProps {
  lease: any;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

const RentPaymentForm: React.FC<RentPaymentFormProps> = ({
  lease,
  onSubmit,
  onCancel,
  loading
}) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    const formattedValues = {
      ...values,
      leaseId: lease.id,
      paymentDate: values.paymentDate.format('YYYY-MM-DD'),
      status: 'completed',
      type: 'rent'
    };
    onSubmit(formattedValues);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        amount: lease?.monthlyRent,
        paymentDate: dayjs(),
      }}
    >
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-medium mb-2">Informations du bail</h3>
        <div className="text-sm text-gray-600">
          <p>Locataire: {lease?.tenant?.lastName} {lease?.tenant?.firstName}</p>
          <p>Bien: {lease?.property?.address}</p>
          <p>Loyer mensuel: {new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
          }).format(lease?.monthlyRent)}</p>
        </div>
      </div>

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
        name="paymentDate"
        label="Date de paiement"
        rules={[{ required: true, message: 'La date de paiement est requise' }]}
      >
        <DatePicker className="w-full" format="DD/MM/YYYY" />
      </Form.Item>

      <Form.Item
        name="paymentMethod"
        label="Méthode de paiement"
        rules={[{ required: true, message: 'La méthode de paiement est requise' }]}
      >
        <Select>
          <Select.Option value="bank_transfer">Virement bancaire</Select.Option>
          <Select.Option value="check">Chèque</Select.Option>
          <Select.Option value="cash">Espèces</Select.Option>
          <Select.Option value="direct_debit">Prélèvement automatique</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="reference"
        label="Référence"
      >
        <Input placeholder="Numéro de chèque, référence de virement..." />
      </Form.Item>

      <Form.Item
        name="notes"
        label="Notes"
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <div className="flex justify-end gap-2">
        <Button onClick={onCancel}>
          Annuler
        </Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          Enregistrer le paiement
        </Button>
      </div>
    </Form>
  );
};

export default RentPaymentForm;