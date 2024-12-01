import MockAdapter from 'axios-mock-adapter';
import {
  mockUser,
  mockProperties,
  mockTenants,
  mockLeases,
  mockPayments,
  mockStats,
  mockRentStats,
  mockTenantStats
} from './mockData';
import api from '../config/api';

const mock = new MockAdapter(api, { delayResponse: 500 });

// Auth endpoints
mock.onPost('/auth/login').reply(200, {
  token: 'fake-jwt-token',
  user: mockUser
});

mock.onGet('/auth/me').reply(200, mockUser);

// Properties endpoints
mock.onGet(/\/properties.*/).reply(config => {
  const params = new URLSearchParams(config.url?.split('?')[1]);
  const ownerId = params.get('ownerId');

  let properties = [...mockProperties];
  if (ownerId) {
    properties = properties.filter(p => p.ownerId === ownerId);
  }

  return [200, { properties }];
});

// Tenants endpoints
mock.onGet(/\/tenants\/\d+/).reply(config => {
  const id = config.url?.split('/').pop();
  const tenant = mockTenants.find(t => t.id === id);
  return tenant ? [200, tenant] : [404];
});

mock.onGet(/\/tenants.*/).reply(200, {
  tenants: mockTenants
});

// Owners endpoints
mock.onGet(/\/owners\/\d+/).reply(config => {
  const id = config.url?.split('/').pop();
  const owner = mockTenants.find(t => t.id === id);
  return owner ? [200, owner] : [404];
});

mock.onGet(/\/owners.*/).reply(200, {
  owners: mockTenants
});

// Leases endpoints
mock.onGet(/\/leases.*/).reply(config => {
  const params = new URLSearchParams(config.url?.split('?')[1]);
  const tenantId = params.get('tenantId');
  const ownerId = params.get('ownerId');
  const status = params.get('status');

  let leases = [...mockLeases];
  if (tenantId) {
    leases = leases.filter(l => l.tenantId === tenantId);
  }
  if (ownerId) {
    leases = leases.filter(l => l.ownerId === ownerId);
  }
  if (status) {
    leases = leases.filter(l => l.status === status);
  }

  return [200, { leases }];
});

// Payments endpoints
mock.onGet(/\/payments.*/).reply(config => {
  const params = new URLSearchParams(config.url?.split('?')[1]);
  const tenantId = params.get('tenantId');
  const year = params.get('year');
  const ownerId = params.get('ownerId');
  const month = params.get('month');

  let payments = [...mockPayments];

  if (tenantId) {
    const tenantLeases = mockLeases.filter(l => l.tenantId === tenantId).map(l => l.id);
    payments = payments.filter(p => tenantLeases.includes(p.leaseId));
  }

  if (ownerId) {
    const ownerLeases = mockLeases.filter(l => l.ownerId === ownerId).map(l => l.id);
    payments = payments.filter(p => ownerLeases.includes(p.leaseId));
  }

  if (year) {
    payments = payments.filter(p => p.dueDate.startsWith(year));
  }

  if (month) {
    payments = payments.filter(p => p.dueDate.startsWith(month));
  }

  return [200, { payments }];
});

// Stats endpoints
mock.onGet('/stats').reply(200, mockStats);
mock.onGet('/stats/rents').reply(200, mockRentStats);
mock.onGet('/stats/tenants').reply(200, mockTenantStats);