export interface Payment {
  id: string;
  leaseId: string;
  amount: number;
  type: 'rent' | 'deposit' | 'fees';
  status: 'pending' | 'completed' | 'failed';
  dueDate: string;
  paymentDate?: string;
  paymentMethod?: 'bank_transfer' | 'check' | 'cash' | 'direct_debit';
  reference?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  lease?: {
    property?: {
      address: string;
    };
    tenant?: {
      firstName: string;
      lastName: string;
    };
    monthlyRent: number;
  };
}

export interface PaymentFormData extends Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'lease'> {}