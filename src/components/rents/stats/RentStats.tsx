import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { Euro, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { useQuery } from 'react-query';
import axios from 'axios';

const RentStats = () => {
  const { data: stats } = useQuery(['rent-stats'], async () => {
    const response = await axios.get('/api/stats/rents');
    return response.data;
  });

  const cards = [
    {
      title: 'Loyers du mois',
      value: stats?.monthlyRent || 0,
      prefix: '€',
      icon: <Euro className="w-8 h-8 text-blue-600" />,
      color: 'bg-blue-50',
    },
    {
      title: 'Taux de recouvrement',
      value: stats?.collectionRate || 0,
      suffix: '%',
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      color: 'bg-green-50',
    },
    {
      title: 'Paiements en retard',
      value: stats?.latePayments || 0,
      icon: <AlertCircle className="w-8 h-8 text-red-600" />,
      color: 'bg-red-50',
    },
    {
      title: 'Paiements reçus',
      value: stats?.completedPayments || 0,
      icon: <CheckCircle2 className="w-8 h-8 text-emerald-600" />,
      color: 'bg-emerald-50',
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
                  suffix={card.suffix}
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

export default RentStats;