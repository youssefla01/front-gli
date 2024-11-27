import React from 'react';
import { Table, Tag, Tooltip } from 'antd';
import { AlertTriangle } from 'lucide-react';
import { useQuery } from 'react-query';
import axios from 'axios';
import PropertyCalendar from './PropertyCalendar';

const PropertySituation = () => {
  const { data: properties = [] } = useQuery(['properties-situation'], async () => {
    const response = await axios.get('/api/properties');
    return response.data?.properties || [];
  });

  const columns = [
    {
      title: 'Bien',
      key: 'property',
      render: (property: any) => (
        <div>
          <div className="font-medium">{property.address}</div>
          <Tag>{property.type === 'apartment' ? 'Appartement' : 
               property.type === 'house' ? 'Maison' : 
               property.type === 'commercial' ? 'Local commercial' : 'Terrain'}</Tag>
        </div>
      ),
    },
    {
      title: 'Loyer mensuel',
      key: 'rent',
      render: (property: any) => {
        const lease = property.currentLease;
        return lease ? (
          <div className="font-medium">
            {new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR'
            }).format(lease.monthlyRent)}
          </div>
        ) : '-';
      },
    },
    {
      title: 'Occupation',
      key: 'occupation',
      render: (property: any) => {
        const lease = property.currentLease;
        if (!lease) return <Tag>Vacant</Tag>;
        
        return (
          <div>
            <div>{lease.tenant?.lastName} {lease.tenant?.firstName}</div>
            <div className="text-sm text-gray-500">
              Depuis le {new Date(lease.startDate).toLocaleDateString('fr-FR')}
            </div>
          </div>
        );
      },
    },
    {
      title: 'État',
      key: 'condition',
      render: (property: any) => {
        const getConditionConfig = (condition: string) => {
          switch (condition) {
            case 'new':
              return { color: 'green', text: 'Neuf' };
            case 'good':
              return { color: 'blue', text: 'Bon état' };
            case 'renovate':
              return { color: 'orange', text: 'À rénover' };
            case 'poor':
              return { color: 'red', text: 'Mauvais état' };
            default:
              return { color: 'default', text: condition };
          }
        };

        const config = getConditionConfig(property.condition);
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Alertes',
      key: 'alerts',
      render: (property: any) => {
        const hasIssues = Math.random() > 0.7;
        return hasIssues ? (
          <Tooltip title="Maintenance requise">
            <Tag color="red" icon={<AlertTriangle className="w-4 h-4" />}>
              1 alerte
            </Tag>
          </Tooltip>
        ) : (
          <Tag color="green">Aucune alerte</Tag>
        );
      },
    },
  ];

  return (
    <div className="space-y-8">
      <Table
        columns={columns}
        dataSource={properties}
        rowKey="id"
        pagination={false}
      />
      
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Calendrier des paiements</h3>
        <PropertyCalendar />
      </div>
    </div>
  );
};

export default PropertySituation;