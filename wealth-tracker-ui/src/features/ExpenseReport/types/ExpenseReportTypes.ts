export interface ExpenseReportItem {
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
  status: 'ACTIVE' | 'INACTIVE';
  categoryId: number;
  createdBy: string;
  createdDate: string;
  modifiedBy: string | null;
  modifiedDate: string | null;
}

export interface ExpenseReportFilters {
  startDate: string;
  endDate: string;
  categoryId: string;
}

export type ExpenseReportSortField = 'expenseDate' | 'amount';
export type ExpenseReportSortOrder = 'asc' | 'desc';
