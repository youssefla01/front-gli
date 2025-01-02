import { Property } from '../types/property';
import { Tenant } from '../types/tenant';
import { Lease } from '../types/lease';
import { Payment } from '../types/payment';
import { User } from '../types/user';
import { Notification } from '../types/notification';

export const mockUser: User = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  role: 'admin',
  permissions: ['manage_all'],
  status: 'active',
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
    }
  },
  {
    id: '2',
    propertyId: '2',
    tenantId: '2',
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
      firstName: 'Pierre',
      lastName: 'Dubois'
    }
  }
];

export const mockPayments: Payment[] = [
  {
    id: '1',
    leaseId: '1',
    amount: 1200,
    type: 'rent',
    status: 'completed',
    dueDate: '2024-03-05',
    paymentDate: '2024-03-05',
    paymentMethod: 'bank_transfer',
    reference: 'PAY-202403',
    createdAt: '2024-03-05',
    updatedAt: '2024-03-05',
    lease: {
      property: { address: '123 Rue de la Paix, Paris' },
      tenant: { firstName: 'Alice', lastName: 'Martin' },
      monthlyRent: 1200
    }
  }
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

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Nouveau paiement',
    description: 'Loyer reçu de M. Martin pour le mois de Mars',
    time: '5 min',
    type: 'success',
    read: false,
    link: '/app/rents'
  },
  {
    id: '2',
    title: 'Contrat expiré',
    description: 'Le bail de Mme Dubois arrive à échéance dans 30 jours',
    time: '1 heure',
    type: 'warning',
    read: false,
    link: '/app/leases'
  },
  {
    id: '3',
    title: 'Maintenance requise',
    description: 'Demande de réparation urgente - 123 rue de la Paix',
    time: '2 heures',
    type: 'error',
    read: false
  },
  {
    id: '4',
    title: 'Nouveau locataire',
    description: 'M. Bernard a complété son dossier de location',
    time: '1 jour',
    type: 'info',
    read: true,
    link: '/app/tenants'
  }
];