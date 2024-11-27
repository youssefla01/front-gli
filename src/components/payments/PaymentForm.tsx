import React from 'react';
import { Form, InputNumber, Select, DatePicker, Input } from 'antd';
import { PaymentFormData } from '../../types/payment';
import { useQuery } from 'react-query';
import axios from 'axios';
import dayjs from 'dayjs';

interface PaymentFormProps {
  initialValues?: PaymentFormData;
  onSubmit: (values: PaymentFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading
}) => {
  const [form] = Form.useForm();

  const { data: leasesData } = useQuery('active-leases', async () => {
    const response = await axios.get('/api/leases?status=active');
    return response.data?.leases || [];
  });

  const leases = Array.isArray(leasesData) ? leasesData : [];

  const handleSubmit = (values: any) => {
    const formattedValues = {
      ...values,
      dueDate: values.dueDate.format('YYYY-MM-DD'),
      paymentDate: values.paymentDate?.format('YYYY-MM-DD'),
    };
    onSubmit(formattedValues);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues ? {
        ...initialValues,
        dueDate: dayjs(initialValues.dueDate),
        paymentDate: initialValues.paymentDate ? dayjs(initialValues.paymentDate) : undefined,
      } : undefined}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="leaseId"
        label="Bail"
        rules={[{ required: true, message: 'Le bail est requis' }]}
      >
        <Select
          showSearch
          placeholder="Sélectionner un bail"
          optionFilterProp="children"
        >
          {leases.map((lease: any) => (
            <Select.Option key={lease.id} value={lease.id}>
              {lease.property?.address} - {lease.tenant?.lastName} {lease.tenant?.firstName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="amount"
          label="Montant (€)"
          rules={[{ required: true, message: 'Le montant est requis' }]}
        >
          <InputNumber
            className="w-full"
            min={0}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            parser={value => value!.replace(/\s?/g, '')}
          />
        </Form.Item>

        <Form.Item
          name="type"
          label="Type"
          rules={[{ required: true, message: 'Le type est requis' }]}
        >
          <Select>
            <Select.Option value="rent">Loyer</Select.Option>
            <Select.Option value="deposit">Dépôt de garantie</Select.Option>
            <Select.Option value="fees">Frais</Select.Option>
          </Select>
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="dueDate"
          label="Date d'échéance"
          rules={[{ required: true, message: "La date d'échéance est requise" }]}
        >
          <DatePicker className="w-full" format="DD/MM/YYYY" />
        </Form.Item>

        <Form.Item
          name="status"
          label="Statut"
          rules={[{ required: true, message: 'Le statut est requis' }]}
        >
          <Select>
            <Select.Option value="pending">En attente</Select.Option>
            <Select.Option value="completed">Complété</Select.Option>
            <Select.Option value="failed">Échoué</Select.Option>
          </Select>
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="paymentMethod"
          label="Méthode de paiement"
        >
          <Select allowClear>
            <Select.Option value="bank_transfer">Virement bancaire</Select.Option>
            <Select.Option value="check">Chèque</Select.Option>
            <Select.Option value="cash">Espèces</Select.Option>
            <Select.Option value="direct_debit">Prélèvement automatique</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="paymentDate"
          label="Date de paiement"
        >
          <DatePicker className="w-full" format="DD/MM/YYYY" />
        </Form.Item>
      </div>

      <Form.Item
        name="reference"
        label="Référence"
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="notes"
        label="Notes"
      >
        <Input.TextArea rows={4} />
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

export default PaymentForm;