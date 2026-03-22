export type ExpenseCategoryStatus = 'ACTIVE' | 'INACTIVE';

export interface ExpenseCategory {
  id: number;
  name: string;
  description: string;
  userId: number;
  permissionId: number;
  status: ExpenseCategoryStatus;
  createdBy: string;
  createdDate: string;
  modifiedBy: string | null;
  modifiedDate: string | null;
}

export interface ExpenseCategoryCreatePayload {
  name: string;
  description: string;
  userId: number;
  permissionId: number;
  status: ExpenseCategoryStatus;
  createdBy: string;
}

export interface ExpenseCategoryUpdatePayload {
  name: string;
  description: string;
  status: ExpenseCategoryStatus;
  modifiedBy: string;
}
