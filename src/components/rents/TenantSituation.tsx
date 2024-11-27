import React from 'react';
import { Table, Tag, Progress } from 'antd';
import { useQuery } from 'react-query';
import axios from 'axios';
import dayjs from 'dayjs';
import TenantStats from './stats/TenantStats';

const TenantSituation = () => {
  const { data: tenants = [] } = useQuery(['tenants-situation'], async () => {
    const response = await axios.get('/api/tenants');
    return response.data?.tenants || [];
  });

  const columns = [
    {
      title: 'Locataire',
      key: 'tenant',
      render: (tenant: any) => (
        <div>
          <div className="font-medium">{tenant.lastName} {tenant.firstName}</div>
          <div className="text-sm text-gray-500">{tenant.email}</div>
        </div>
      ),
    },
    {
      title: 'Paiements à l\'heure',
      key: 'paymentRate',
      render: () => {
        const rate = Math.floor(Math.random() * 30) + 70; // Simulé pour l'exemple
        return (
          <Progress
            percent={rate}
            size="small"
            status={rate >= 90 ? 'success' : rate >= 75 ? 'normal' : 'exception'}
          />
        );
      },
    },
    {
      title: 'Dernier paiement',
      key: 'lastPayment',
      render: () => dayjs().subtract(Math.floor(Math.random() * 30), 'days').format('DD/MM/YYYY'),
    },
    {
      title: 'Statut',
      key: 'status',
      render: () => {
        const statuses = [
          { text: 'À jour', color: 'green' },
          { text: 'Retard', color: 'red' },
          { text: 'Attention', color: 'orange' },
        ];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        return <Tag color={randomStatus.color}>{randomStatus.text}</Tag>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <TenantStats />
      <Table
        columns={columns}
        dataSource={tenants}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
};

export default TenantSituation;