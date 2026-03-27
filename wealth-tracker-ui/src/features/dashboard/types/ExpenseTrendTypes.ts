export interface ExpenseDailySpend {
  date: string;
  dayLabel: string;
  amount: number;
}

export interface ExpenseMonthlySpend {
  monthStart: string;
  monthLabel: string;
  amount: number;
}

export interface ExpenseReportTrends {
  userId: number;
  currency: string;
  dailyStartDate: string;
  dailyEndDate: string;
  dailyTotalAmount: number;
  dailySpends: ExpenseDailySpend[];
  monthlyStartDate: string;
  monthlyEndDate: string;
  monthlyTotalAmount: number;
  monthlySpends: ExpenseMonthlySpend[];
}
