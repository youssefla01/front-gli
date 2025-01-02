import React from 'react';
import { Line } from '@ant-design/plots';

const RevenueChart = () => {
  const data = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2024, i).toLocaleString('fr-FR', { month: 'long' }),
    revenue: Math.floor(Math.random() * 50000) + 30000,
    expenses: Math.floor(Math.random() * 20000) + 10000,
  }));

  const config = {
    data,
    xField: 'month',
    yField: ['revenue', 'expenses'],
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    color: ['#1e40af', '#ef4444'],
    legend: {
      position: 'top',
    },
    xAxis: {
      label: {
        style: {
          fill: '#666',
        },
      },
    },
    yAxis: {
      label: {
        formatter: (v: string) => `${parseInt(v).toLocaleString('fr-FR')}€`,
        style: {
          fill: '#666',
        },
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: datum.type === 'revenue' ? 'Revenus' : 'Dépenses',
          value: `${datum.value.toLocaleString('fr-FR')}€`,
        };
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Évolution des revenus</h3>
      <Line {...config} height={300} />
    </div>
  );
};

export default RevenueChart;