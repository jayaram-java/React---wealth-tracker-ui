export interface ExpenseCategorySummary {
  categoryId: number;
  categoryName: string;
  totalAmount: number;
  totalCount: number;
}

export interface ExpenseReportSummary {
  userId: number;
  startDate: string | null;
  endDate: string | null;
  currency: string;
  totalAmount: number;
  totalCount: number;
  categorySummaries: ExpenseCategorySummary[];
}
