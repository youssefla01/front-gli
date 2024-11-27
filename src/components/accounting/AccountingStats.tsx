import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { TrendingUp, TrendingDown, Euro, AlertCircle } from 'lucide-react';
import { useQuery } from 'react-query';
import axios from 'axios';

const AccountingStats = () => {
  const { data: stats } = useQuery(['accounting-stats'], async () => {
    const response = await axios.get('/api/stats/accounting');
    return response.data;
  });

  const cards = [
    {
      title: 'Recettes totales',
      value: stats?.totalIncome || 0,
      prefix: '€',
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      color: 'bg-green-50',
    },
    {
      title: 'Dépenses totales',
      value: stats?.totalExpenses || 0,
      prefix: '€',
      icon: <TrendingDown className="w-8 h-8 text-red-600" />,
      color: 'bg-red-50',
    },
    {
      title: 'Résultat net',
      value: stats?.netIncome || 0,
      prefix: '€',
      icon: <Euro className="w-8 h-8 text-blue-600" />,
      color: 'bg-blue-50',
    },
    {
      title: 'Transactions en attente',
      value: stats?.pendingTransactions || 0,
      icon: <AlertCircle className="w-8 h-8 text-orange-600" />,
      color: 'bg-orange-50',
    },
  ];

  return (
    <Row gutter={[16, 16]}>
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

export default AccountingStats;