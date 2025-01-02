import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { Building2, Users, FileText, Wallet } from 'lucide-react';
import { useQuery } from 'react-query';
import axios from 'axios';

import { mockNotifications } from '../services/mockData';
import RevenueChart from '../components/dashboard/charts/RevenueChart';
import OccupancyChart from '../components/dashboard/charts/OccupancyChart';
import DashboardNotifications from '../components/dashboard/DashboardNotifications';

const Dashboard = () => {
  const { data: stats } = useQuery('dashboard-stats', async () => {
    const response = await axios.get('/api/stats');
    return response.data;
  });

  const cards = [
    {
      title: 'Biens',
      value: stats?.properties || 0,
      icon: <Building2 className="w-8 h-8 text-blue-900" />,
      color: 'bg-blue-50',
    },
    {
      title: 'Locataires',
      value: stats?.tenants || 0,
      icon: <Users className="w-8 h-8 text-green-700" />,
      color: 'bg-green-50',
    },
    {
      title: 'Baux actifs',
      value: stats?.activeLeases || 0,
      icon: <FileText className="w-8 h-8 text-purple-700" />,
      color: 'bg-purple-50',
    },
    {
      title: 'Revenus mensuels',
      value: stats?.monthlyIncome || 0,
      prefix: '€',
      icon: <Wallet className="w-8 h-8 text-amber-700" />,
      color: 'bg-amber-50',
    },
  ];

  return (
    <div className="space-y-6">
      <Row gutter={[16, 16]} className="animate-fade-in">
        {cards.map((card, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="h-full">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-gray-600 mb-2">{card.title}</h3>
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

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <RevenueChart />
        </Col>
        <Col xs={24} lg={8}>
          <OccupancyChart />
        </Col>
      </Row>

      <Row>
        <Col xs={24}>
          <DashboardNotifications notifications={mockNotifications} />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;