import React from 'react';
import { Tabs } from 'antd';
import { Euro, Users, Building2, FileText } from 'lucide-react';
import RentCollection from '../components/rents/RentCollection';
import TenantSituation from '../components/rents/TenantSituation';
import PropertySituation from '../components/rents/PropertySituation';
import RentReceipt from '../components/rents/RentReceipt';

const Rents = () => {
  const items = [
    {
      key: 'collection',
      label: (
        <div className="flex items-center gap-2">
          <Euro className="w-4 h-4" />
          <span>Encaissement</span>
        </div>
      ),
      children: <RentCollection />,
    },
    {
      key: 'tenants',
      label: (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>Situation locataires</span>
        </div>
      ),
      children: <TenantSituation />,
    },
    {
      key: 'properties',
      label: (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          <span>Situation logements</span>
        </div>
      ),
      children: <PropertySituation />,
    },
    {
      key: 'receipts',
      label: (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span>Quittances</span>
        </div>
      ),
      children: <RentReceipt />,
    },
  ];

  return (
    <div className="bg-white rounded-lg">
      <Tabs
        defaultActiveKey="collection"
        items={items}
        className="p-6"
        size="large"
      />
    </div>
  );
};

export default Rents;