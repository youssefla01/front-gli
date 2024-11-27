import React from 'react';
import { Button, Select, DatePicker, Space } from 'antd';
import { Download, Printer } from 'lucide-react';
import { useQuery } from 'react-query';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;

const RentReceipt = () => {
  const { data: leases = [] } = useQuery(['active-leases'], async () => {
    const response = await axios.get('/api/leases?status=active');
    return response.data?.leases || [];
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          placeholder="Sélectionner un locataire"
          className="w-full"
          showSearch
          optionFilterProp="children"
        >
          {leases.map((lease: any) => (
            <Option key={lease.id} value={lease.id}>
              {lease.tenant?.lastName} {lease.tenant?.firstName} - {lease.property?.address}
            </Option>
          ))}
        </Select>

        <DatePicker.RangePicker
          className="w-full"
          placeholder={['Période début', 'Période fin']}
          format="MM/YYYY"
          picker="month"
          defaultValue={[dayjs().startOf('month'), dayjs().endOf('month')]}
        />

        <Space>
          <Button
            type="primary"
            icon={<Download className="w-4 h-4" />}
          >
            Télécharger
          </Button>
          <Button
            icon={<Printer className="w-4 h-4" />}
          >
            Imprimer
          </Button>
        </Space>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
        Sélectionnez un locataire et une période pour générer les quittances
      </div>
    </div>
  );
};

export default RentReceipt;