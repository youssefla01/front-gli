import React from 'react';
import { Tabs } from 'antd';
import { Euro, TrendingUp, FileText } from 'lucide-react';
import TransactionList from '../components/accounting/TransactionList';
import AccountingStats from '../components/accounting/AccountingStats';
import Reports from '../components/accounting/Reports';

const Accounting = () => {
  const items = [
    {
      key: 'transactions',
      label: (
        <div className="flex items-center gap-2">
          <Euro className="w-4 h-4" />
          <span>Transactions</span>
        </div>
      ),
      children: <TransactionList />,
    },
    {
      key: 'stats',
      label: (
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          <span>Statistiques</span>
        </div>
      ),
      children: <AccountingStats />,
    },
    {
      key: 'reports',
      label: (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span>Rapports</span>
        </div>
      ),
      children: <Reports />,
    },
  ];

  return (
    <div className="bg-white rounded-lg">
      <Tabs
        defaultActiveKey="transactions"
        items={items}
        className="p-6"
        size="large"
      />
    </div>
  );
};

export default Accounting;