export interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  reference?: string;
  propertyId?: string;
  ownerId?: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFormData extends Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> {}

export interface AccountingStats {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  pendingTransactions: number;
}