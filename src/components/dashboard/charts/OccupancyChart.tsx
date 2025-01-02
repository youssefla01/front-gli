import React from 'react';
import { Pie } from '@ant-design/plots';

const OccupancyChart = () => {
  const data = [
    { type: 'Occupés', value: 75 },
    { type: 'Vacants', value: 15 },
    { type: 'En attente', value: 10 },
  ];

  const config = {
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    color: ['#1e40af', '#ef4444', '#f59e0b'],
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'element-active' }],
    animation: {
      appear: {
        animation: 'fade-in',
        duration: 1000,
      },
    },
    legend: {
      position: 'bottom',
    },
    tooltip: {
      formatter: (datum: any) => {
        return { name: datum.type, value: `${datum.value}%` };
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Taux d'occupation</h3>
      <Pie {...config} height={300} />
    </div>
  );
};

export default OccupancyChart;