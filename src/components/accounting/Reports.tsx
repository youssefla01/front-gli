import React, { useState } from 'react';
import { Button, DatePicker, Select, Card, Table } from 'antd';
import { Download, Printer } from 'lucide-react';
import { useQuery } from 'react-query';
import axios from 'axios';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const Reports = () => {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().startOf('month'),
    dayjs().endOf('month')
  ]);
  const [reportType, setReportType] = useState('income_statement');

  const { data: reportData, isLoading } = useQuery(
    ['report', reportType, dateRange],
    async () => {
      const params = new URLSearchParams({
        type: reportType,
        startDate: dateRange[0].format('YYYY-MM-DD'),
        endDate: dateRange[1].format('YYYY-MM-DD'),
      });
      const response = await axios.get(`/api/reports?${params}`);
      return response.data;
    }
  );

  const columns = {
    income_statement: [
      {
        title: 'Catégorie',
        dataIndex: 'category',
        key: 'category',
      },
      {
        title: 'Recettes',
        key: 'income',
        render: (row: any) => (
          <span className="text-green-600">
            {new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR'
            }).format(row.income)}
          </span>
        ),
      },
      {
        title: 'Dépenses',
        key: 'expenses',
        render: (row: any) => (
          <span className="text-red-600">
            {new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR'
            }).format(row.expenses)}
          </span>
        ),
      },
      {
        title: 'Solde',
        key: 'balance',
        render: (row: any) => {
          const balance = row.income - row.expenses;
          return (
            <span className={balance >= 0 ? 'text-green-600' : 'text-red-600'}>
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              }).format(balance)}
            </span>
          );
        },
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Select
          value={reportType}
          onChange={setReportType}
          className="w-full sm:w-64"
        >
          <Select.Option value="income_statement">Compte de résultat</Select.Option>
          <Select.Option value="balance_sheet">Bilan</Select.Option>
          <Select.Option value="cash_flow">Flux de trésorerie</Select.Option>
        </Select>

        <RangePicker
          value={dateRange}
          onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
          className="w-full sm:w-auto"
        />

        <div className="flex gap-2 sm:ml-auto">
          <Button icon={<Download className="w-4 h-4" />}>
            Télécharger
          </Button>
          <Button icon={<Printer className="w-4 h-4" />}>
            Imprimer
          </Button>
        </div>
      </div>

      <Card loading={isLoading}>
        <Table
          columns={columns[reportType as keyof typeof columns]}
          dataSource={reportData?.items || []}
          pagination={false}
          summary={(data) => {
            const totals = data.reduce(
              (acc, row) => ({
                income: acc.income + row.income,
                expenses: acc.expenses + row.expenses,
              }),
              { income: 0, expenses: 0 }
            );

            return (
              <Table.Summary.Row className="font-bold">
                <Table.Summary.Cell>Total</Table.Summary.Cell>
                <Table.Summary.Cell>
                  <span className="text-green-600">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR'
                    }).format(totals.income)}
                  </span>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <span className="text-red-600">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR'
                    }).format(totals.expenses)}
                  </span>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <span className={totals.income - totals.expenses >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR'
                    }).format(totals.income - totals.expenses)}
                  </span>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            );
          }}
        />
      </Card>
    </div>
  );
};

export default Reports;