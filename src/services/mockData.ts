import { Property } from '../types/property';
import { Tenant } from '../types/tenant';
import { Lease } from '../types/lease';
import { Payment } from '../types/payment';
import { User } from '../types/user';

export const mockUser: User = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  role: 'admin',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
};

export const mockProperties: Property[] = [
  {
    id: '1',
    type: 'apartment',
    address: '123 Rue de la Paix, Paris',
    description: 'Bel appartement lumineux avec vue sur la Tour Eiffel',
    surface: 75,
    rooms: 3,
    condition: 'good',
    estimatedPrice: 450000,
    ownerId: '1',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '2',
    type: 'house',
    address: '45 Avenue des Champs-Élysées, Paris',
    description: 'Maison spacieuse avec jardin',
    surface: 150,
    rooms: 5,
    condition: 'new',
    estimatedPrice: 850000,
    ownerId: '1',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02'
  },
  {
    id: '3',
    type: 'commercial',
    address: '78 Rue du Commerce, Paris',
    description: 'Local commercial en centre-ville',
    surface: 120,
    rooms: 2,
    condition: 'good',
    estimatedPrice: 550000,
    ownerId: '2',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    createdAt: '2024-01-03',
    updatedAt: '2024-01-03'
  }
];

export const mockTenants: Tenant[] = [
  {
    id: '1',
    firstName: 'Alice',
    lastName: 'Martin',
    email: 'alice@example.com',
    phone: '0612345678',
    birthDate: '1990-05-15',
    occupation: 'Ingénieur',
    monthlyIncome: 4500,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '2',
    firstName: 'Pierre',
    lastName: 'Dubois',
    email: 'pierre@example.com',
    phone: '0687654321',
    birthDate: '1985-09-20',
    occupation: 'Architecte',
    monthlyIncome: 5200,
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02'
  }
];

export const mockLeases: Lease[] = [
  {
    id: '1',
    propertyId: '1',
    tenantId: '1',
    ownerId: '1',
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    monthlyRent: 1200,
    deposit: 2400,
    agencyFees: 1200,
    status: 'active',
    documents: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    property: {
      address: '123 Rue de la Paix, Paris',
      type: 'apartment'
    },
    tenant: {
      firstName: 'Alice',
      lastName: 'Martin'
    },
    owner: {
      firstName: 'Jean',
      lastName: 'Dupont'
    }
  },
  {
    id: '2',
    propertyId: '2',
    tenantId: '1',
    ownerId: '1',
    startDate: '2024-02-01',
    endDate: '2025-02-01',
    monthlyRent: 2000,
    deposit: 4000,
    agencyFees: 2000,
    status: 'active',
    documents: [],
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01',
    property: {
      address: '45 Avenue des Champs-Élysées, Paris',
      type: 'house'
    },
    tenant: {
      firstName: 'Alice',
      lastName: 'Martin'
    },
    owner: {
      firstName: 'Jean',
      lastName: 'Dupont'
    }
  },
  {
    id: '3',
    propertyId: '3',
    tenantId: '2',
    ownerId: '2',
    startDate: '2024-03-01',
    endDate: '2025-03-01',
    monthlyRent: 1800,
    deposit: 3600,
    agencyFees: 1800,
    status: 'active',
    documents: [],
    createdAt: '2024-03-01',
    updatedAt: '2024-03-01',
    property: {
      address: '78 Rue du Commerce, Paris',
      type: 'commercial'
    },
    tenant: {
      firstName: 'Pierre',
      lastName: 'Dubois'
    },
    owner: {
      firstName: 'Marie',
      lastName: 'Laurent'
    }
  }
];

const generatePaymentsForYear = (year: number) => {
  const payments: Payment[] = [];
  const months = Array.from({ length: 12 }, (_, i) => i);

  mockLeases.forEach(lease => {
    months.forEach(month => {
      const dueDate = `${year}-${String(month + 1).padStart(2, '0')}-05`;
      const isLate = Math.random() > 0.8;
      const paymentDate = isLate 
        ? `${year}-${String(month + 1).padStart(2, '0')}-${Math.floor(Math.random() * 20) + 10}`
        : `${year}-${String(month + 1).padStart(2, '0')}-05`;

      payments.push({
        id: `${lease.id}-${year}-${month + 1}`,
        leaseId: lease.id,
        amount: lease.monthlyRent,
        type: 'rent',
        status: 'completed',
        dueDate,
        paymentDate,
        paymentMethod: 'bank_transfer',
        reference: `PAY-${year}${String(month + 1).padStart(2, '0')}`,
        createdAt: dueDate,
        updatedAt: paymentDate,
        lease: {
          property: lease.property,
          tenant: lease.tenant,
          monthlyRent: lease.monthlyRent
        }
      });
    });
  });

  return payments;
};

export const mockPayments: Payment[] = [
  ...generatePaymentsForYear(2023),
  ...generatePaymentsForYear(2024)
];

export const mockStats = {
  properties: mockProperties.length,
  tenants: mockTenants.length,
  activeLeases: mockLeases.filter(lease => lease.status === 'active').length,
  monthlyIncome: mockLeases
    .filter(lease => lease.status === 'active')
    .reduce((sum, lease) => sum + lease.monthlyRent, 0)
};

export const mockRentStats = {
  monthlyRent: 5000,
  collectionRate: 95,
  latePayments: 2,
  completedPayments: 28
};

export const mockTenantStats = {
  totalTenants: mockTenants.length,
  upToDateTenants: Math.floor(mockTenants.length * 0.8),
  lateTenants: Math.ceil(mockTenants.length * 0.2),
  averageIncome: mockTenants.reduce((sum, tenant) => sum + tenant.monthlyIncome, 0) / mockTenants.length
};