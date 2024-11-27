import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Card, Table, Tag, Statistic, Row, Col, Select, Spin } from 'antd';
import { User2, Mail, Phone, Briefcase, Calendar, Building2, Euro } from 'lucide-react';
import axios from 'axios';
import dayjs from 'dayjs';

const TenantDetail = () => {
  const { id } = useParams();
  const [selectedYear, setSelectedYear] = useState(dayjs().year());

  const { data: tenant, isLoading: isLoadingTenant } = useQuery(
    ['tenant', id],
    async () => {
      const response = await axios.get(`/api/tenants/${id}`);
      return response.data;
    },
    { enabled: !!id }
  );

  const { data: leases = [], isLoading: isLoadingLeases } = useQuery(
    ['tenant-leases', id],
    async () => {
      const response = await axios.get(`/api/leases?tenantId=${id}`);
      return response.data?.leases || [];
    },
    { enabled: !!id }
  );

  const { data: payments = [], isLoading: isLoadingPayments } = useQuery(
    ['tenant-payments', id, selectedYear],
    async () => {
      const response = await axios.get(`/api/payments?tenantId=${id}&year=${selectedYear}`);
      return response.data?.payments || [];
    },
    { enabled: !!id }
  );

  const isLoading = isLoadingTenant || isLoadingLeases || isLoadingPayments;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl text-gray-600">Locataire non trouvé</h2>
      </div>
    );
  }

  const months = Array.from({ length: 12 }, (_, i) => dayjs().month(i).format('MMMM'));

  const getPaymentStatus = (lease: any, month: string) => {
    const monthIndex = months.indexOf(month);
    const payment = payments.find(p => 
      p.leaseId === lease.id && 
      dayjs(p.dueDate).month() === monthIndex &&
      dayjs(p.dueDate).year() === selectedYear
    );

    if (!payment) return { status: 'non dû', color: 'default' };
    if (payment.status === 'completed') {
      return dayjs(payment.paymentDate).isAfter(dayjs(payment.dueDate))
        ? { status: 'en retard', color: 'orange' }
        : { status: 'payé', color: 'green' };
    }
    if (payment.status === 'pending') return { status: 'en attente', color: 'blue' };
    return { status: 'impayé', color: 'red' };
  };

  const activeLeases = leases.filter(lease => lease.status === 'active');
  const totalMonthlyRent = activeLeases.reduce((sum, lease) => sum + lease.monthlyRent, 0);
  const latePayments = payments.filter(p => 
    dayjs(p.paymentDate).isAfter(dayjs(p.dueDate))
  ).length;

  const columns = [
    {
      title: 'Bien',
      fixed: 'left',
      width: 300,
      render: (lease: any) => (
        <div>
          <div className="font-medium">{lease.property?.address}</div>
          <div className="text-sm text-gray-500">
            Loyer: {new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR'
            }).format(lease.monthlyRent)}
          </div>
          <Tag color={lease.status === 'active' ? 'green' : 'orange'}>
            {lease.status === 'active' ? 'Actif' : 'En attente'}
          </Tag>
        </div>
      ),
    },
    ...months.map(month => ({
      title: month,
      width: 120,
      align: 'center' as const,
      render: (lease: any) => {
        const { status, color } = getPaymentStatus(lease, month);
        return <Tag color={color}>{status}</Tag>;
      },
    })),
  ];

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-start gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <User2 className="w-8 h-8 text-blue-900" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-800">
              {tenant.lastName} {tenant.firstName}
            </h1>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${tenant.email}`} className="hover:text-blue-900">
                  {tenant.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <a href={`tel:${tenant.phone}`} className="hover:text-blue-900">
                  {tenant.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Briefcase className="w-4 h-4" />
                <span>{tenant.occupation}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Biens loués"
              value={activeLeases.length}
              prefix={<Building2 className="w-4 h-4" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Loyers mensuels"
              value={totalMonthlyRent}
              prefix={<Euro className="w-4 h-4" />}
              precision={2}
              suffix="€"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Retards de paiement"
              value={latePayments}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-900" />
              <span>Calendrier des paiements {selectedYear}</span>
            </div>
            <Select
              value={selectedYear}
              onChange={setSelectedYear}
              options={[
                { value: dayjs().year() - 1, label: dayjs().year() - 1 },
                { value: dayjs().year(), label: dayjs().year() },
                { value: dayjs().year() + 1, label: dayjs().year() + 1 },
              ]}
            />
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={leases}
          rowKey="id"
          scroll={{ x: 1500 }}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default TenantDetail;