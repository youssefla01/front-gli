import React, { useState } from 'react';
import { Table, Select, Tag } from 'antd';
import { useQuery } from 'react-query';
import axios from 'axios';
import dayjs from 'dayjs';

const PropertyCalendar = () => {
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [selectedOwnerId, setSelectedOwnerId] = useState<string>();

  const { data: owners = [] } = useQuery(['owners'], async () => {
    const response = await axios.get('/api/owners');
    return response.data?.owners || [];
  });

  const { data: properties = [] } = useQuery(
    ['properties', selectedOwnerId],
    async () => {
      const params = new URLSearchParams();
      if (selectedOwnerId) params.append('ownerId', selectedOwnerId);
      const response = await axios.get(`/api/properties?${params}`);
      return response.data?.properties || [];
    }
  );

  const { data: payments = [] } = useQuery(
    ['payments', selectedYear, selectedOwnerId],
    async () => {
      const params = new URLSearchParams();
      params.append('year', selectedYear.toString());
      if (selectedOwnerId) params.append('ownerId', selectedOwnerId);
      const response = await axios.get(`/api/payments?${params}`);
      return response.data?.payments || [];
    }
  );

  const months = Array.from({ length: 12 }, (_, i) => dayjs().month(i).format('MMMM'));

  const getPaymentStatus = (propertyId: string, month: string) => {
    const monthIndex = months.indexOf(month);
    const payment = payments.find(p => 
      p.lease?.propertyId === propertyId && 
      dayjs(p.dueDate).month() === monthIndex &&
      dayjs(p.dueDate).year() === selectedYear
    );

    if (!payment) return { status: 'non dû', color: 'default' };
    if (payment.status === 'completed') {
      return dayjs(payment.paymentDate).isAfter(dayjs(payment.dueDate))
        ? { status: 'en retard', color: 'orange' }
        : { status: 'payé', color: 'green' };
    }
    if (payment.status === 'pending') return { status: 'en attente', color: 'blue' };
    return { status: 'impayé', color: 'red' };
  };

  const columns = [
    {
      title: 'Bien',
      fixed: 'left',
      width: 300,
      render: (property: any) => (
        <div>
          <div className="font-medium">{property.address}</div>
          <div className="text-sm text-gray-500">
            Loyer: {new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR'
            }).format(property.currentLease?.monthlyRent || 0)}
          </div>
          <Tag>{property.type === 'apartment' ? 'Appartement' : 
               property.type === 'house' ? 'Maison' : 
               property.type === 'commercial' ? 'Local commercial' : 'Terrain'}</Tag>
        </div>
      ),
    },
    ...months.map(month => ({
      title: month,
      width: 120,
      align: 'center' as const,
      render: (property: any) => {
        const { status, color } = getPaymentStatus(property.id, month);
        return <Tag color={color}>{status}</Tag>;
      },
    })),
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Select
          placeholder="Filtrer par propriétaire"
          allowClear
          className="w-64"
          onChange={setSelectedOwnerId}
        >
          {owners.map((owner: any) => (
            <Select.Option key={owner.id} value={owner.id}>
              {owner.lastName} {owner.firstName}
            </Select.Option>
          ))}
        </Select>

        <Select
          value={selectedYear}
          onChange={setSelectedYear}
          className="w-32"
        >
          {[selectedYear - 1, selectedYear, selectedYear + 1].map(year => (
            <Select.Option key={year} value={year}>
              {year}
            </Select.Option>
          ))}
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={properties}
        rowKey="id"
        scroll={{ x: 1500 }}
        pagination={false}
      />
    </div>
  );
};

export default PropertyCalendar;