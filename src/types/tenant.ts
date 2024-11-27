export interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  occupation: string;
  monthlyIncome: number;
  createdAt: string;
  updatedAt: string;
}

export interface TenantFormData extends Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'> {}