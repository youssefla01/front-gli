import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { Users, UserCheck, UserX, Wallet } from 'lucide-react';
import { useQuery } from 'react-query';
import axios from 'axios';

const TenantStats = () => {
  const { data: stats } = useQuery(['tenant-stats'], async () => {
    const response = await axios.get('/api/stats/tenants');
    return response.data;
  });

  const cards = [
    {
      title: 'Total locataires',
      value: stats?.totalTenants || 0,
      icon: <Users className="w-8 h-8 text-blue-600" />,
      color: 'bg-blue-50',
    },
    {
      title: 'Locataires à jour',
      value: stats?.upToDateTenants || 0,
      icon: <UserCheck className="w-8 h-8 text-green-600" />,
      color: 'bg-green-50',
    },
    {
      title: 'Locataires en retard',
      value: stats?.lateTenants || 0,
      icon: <UserX className="w-8 h-8 text-red-600" />,
      color: 'bg-red-50',
    },
    {
      title: 'Revenu moyen',
      value: stats?.averageIncome || 0,
      prefix: '€',
      icon: <Wallet className="w-8 h-8 text-purple-600" />,
      color: 'bg-purple-50',
    },
  ];

  return (
    <Row gutter={[16, 16]} className="mb-6">
      {cards.map((card, index) => (
        <Col xs={24} sm={12} lg={6} key={index}>
          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 mb-1">{card.title}</p>
                <Statistic
                  value={card.value}
                  prefix={card.prefix}
                  valueStyle={{ color: '#1e293b', fontWeight: 600 }}
                />
              </div>
              <div className={`p-3 rounded-lg ${card.color}`}>
                {card.icon}
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default TenantStats;