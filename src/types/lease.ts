export interface Lease {
  id: string;
  propertyId: string;
  tenantId: string;
  ownerId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  deposit: number;
  agencyFees: number;
  status: 'active' | 'pending' | 'terminated';
  documents: string[];
  createdAt: string;
  updatedAt: string;
  property?: {
    address: string;
    type: string;
  };
  tenant?: {
    firstName: string;
    lastName: string;
  };
  owner?: {
    firstName: string;
    lastName: string;
  };
}

export interface LeaseFormData extends Omit<Lease, 'id' | 'createdAt' | 'updatedAt' | 'property' | 'tenant' | 'owner'> {}