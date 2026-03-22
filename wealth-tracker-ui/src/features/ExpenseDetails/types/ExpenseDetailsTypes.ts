export type ExpenseStatus = 'ACTIVE' | 'INACTIVE';

export interface ExpenseDetails {
  id: number;
  expenseName: string;
  expenseDate: string;
  amount: number;
  description: string;
  paymentMethod: string;
  expenseCode: string;
  referenceNumber: string;
  receiptUrl: string;
  currency: string;
  userId: number;
  status: ExpenseStatus;
  categoryId: number;
  createdBy: string;
  createdDate: string;
  modifiedBy: string | null;
  modifiedDate: string | null;
}

export interface ExpenseDetailsCreatePayload {
  expenseName: string;
  expenseDate: string;
  amount: number;
  description: string;
  paymentMethod: string;
  expenseCode: string;
  referenceNumber: string;
  receiptUrl: string;
  currency: string;
  userId: number;
  status: ExpenseStatus;
  categoryId: number;
  createdBy: string;
}

export interface ExpenseDetailsUpdatePayload {
  amount: number;
  description: string;
  paymentMethod: string;
  modifiedBy: string;
}
