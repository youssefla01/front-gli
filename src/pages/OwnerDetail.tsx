import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Card, Table, Tag, Statistic, Row, Col, List, Avatar, Spin } from 'antd';
import { User2, Mail, Phone, Building2, Euro, Wallet, Home } from 'lucide-react';
import api from 'api';
import dayjs from 'dayjs';
import api from '../config/api';

const OwnerDetail = () => {
  const { id } = useParams();

  const { data: owner, isLoading: isLoadingOwner } = useQuery(
    ['owner', id],
    async () => {
      const response = await api.get(`/proprietaires/${id}`);
      return response.data;
    },
    { enabled: !!id }
  );

  const { data: properties = [], isLoading: isLoadingProperties } = useQuery(
    ['owner-properties', id],
    async () => {
      const response = await api.get(`/api/properties?ownerId=${id}`);
      return response.data?.properties || [];
    },
    { enabled: !!id }
  );

  const { data: leases = [], isLoading: isLoadingLeases } = useQuery(
    ['owner-leases', id],
    async () => {
      const response = await api.get(`/api/leases?ownerId=${id}`);
      return response.data?.leases || [];
    },
    { enabled: !!id }
  );

  const { data: payments = [], isLoading: isLoadingPayments } = useQuery(
    ['owner-payments', id],
    async () => {
      const response = await api.get(`/api/payments?ownerId=${id}`);
      return response.data?.payments || [];
    },
    { enabled: !!id }
  );

  const isLoading = isLoadingOwner || isLoadingProperties || isLoadingLeases || isLoadingPayments;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!owner) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl text-gray-600">Propriétaire non trouvé</h2>
      </div>
    );
  }

  const activeLeases = leases.filter(lease => lease.status === 'active');
  const totalRent = activeLeases.reduce((acc, lease) => acc + lease.monthlyRent, 0);
  const agencyFeesTotal = leases.reduce((acc, lease) => acc + (lease.agencyFees || 0), 0);

  const propertyColumns = [
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
      title: 'Surface',
      dataIndex: 'surface',
      key: 'surface',
      render: (surface: number) => `${surface} m²`,
    },
    {
      title: 'Prix estimé',
      key: 'price',
      render: (property: any) => (
        <span className="font-medium">
          {new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
          }).format(property.estimatedPrice)}
        </span>
      ),
    },
    {
      title: 'Statut location',
      key: 'leaseStatus',
      render: (property: any) => {
        const lease = leases.find((l: any) => l.propertyId === property.id);
        return lease ? (
          <Tag color={lease.status === 'active' ? 'green' : 'orange'}>
            {lease.status === 'active' ? 'Loué' : 'En attente'}
          </Tag>
        ) : (
          <Tag>Disponible</Tag>
        );
      },
    },
    {
      title: 'Revenu mensuel',
      key: 'monthlyIncome',
      render: (property: any) => {
        const lease = leases.find((l: any) => l.propertyId === property.id);
        return lease?.status === 'active' ? (
          <span className="font-medium text-green-600">
            {new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR'
            }).format(lease.monthlyRent)}
          </span>
        ) : '-';
      },
    },
  ];

  const recentPayments = payments
    .sort((a, b) => dayjs(b.dueDate).valueOf() - dayjs(a.dueDate).valueOf())
    .slice(0, 5)
    .map((payment: any) => ({
      ...payment,
      property: properties.find((p: any) => {
        const lease = leases.find((l: any) => l.id === payment.leaseId);
        return p.id === lease?.propertyId;
      }),
    }));

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-start gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <User2 className="w-8 h-8 text-blue-900" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-800">
              {owner.nom} {owner.prenom}
            </h1>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${owner.email}`} className="hover:text-blue-900">
                  {owner.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <a href={`tel:${owner.telephone}`} className="hover:text-blue-900">
                  {owner.telephone} - {owner.numero_urgence}
                </a>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Biens"
              value={properties.length}
              prefix={<Building2 className="w-4 h-4" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Biens loués"
              value={activeLeases.length}
              prefix={<Home className="w-4 h-4" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Revenus mensuels"
              value={totalRent}
              prefix={<Euro className="w-4 h-4" />}
              precision={2}
              suffix="€"
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Frais d'agence totaux"
              value={agencyFeesTotal}
              prefix={<Wallet className="w-4 h-4" />}
              precision={2}
              suffix="€"
            />
          </Card>
        </Col>
      </Row>

      <Card title="Biens immobiliers">
        <Table
          columns={propertyColumns}
          dataSource={properties}
          rowKey="id"
          pagination={false}
        />
      </Card>

      <Card 
        title="Derniers paiements"
        extra={<Tag color="blue">5 dernières transactions</Tag>}
      >
        <List
          itemLayout="horizontal"
          dataSource={recentPayments}
          renderItem={(payment: any) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar icon={<Euro className="w-4 h-4" />} className="bg-blue-100" />
                }
                title={
                  <div className="flex justify-between">
                    <span>{payment.property?.address}</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR'
                      }).format(payment.amount)}
                    </span>
                  </div>
                }
                description={
                  <div className="flex justify-between text-sm">
                    <span>
                      {dayjs(payment.paymentDate || payment.dueDate).format('DD/MM/YYYY')}
                    </span>
                    <Tag color={
                      payment.status === 'completed' ? 'green' :
                      payment.status === 'pending' ? 'orange' : 'red'
                    }>
                      {payment.status === 'completed' ? 'Payé' :
                       payment.status === 'pending' ? 'En attente' : 'Échoué'}
                    </Tag>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default OwnerDetail;