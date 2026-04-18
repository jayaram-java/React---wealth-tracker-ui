import { getRequest } from '../../../serviceconfigs/AxiosAPI';
import { API_ENDPOINTS } from '../../../serviceconfigs/ApiEndpoints';
import type { ExpenseReportItem } from '../types/ExpenseReportTypes';

interface FetchExpenseReportParams {
  userId: number;
  startDate: string;
  endDate: string;
  authHeader?: Record<string, string>;
}

export const fetchExpenseReportDetails = async ({
  userId,
  startDate,
  endDate,
  authHeader,
}: FetchExpenseReportParams): Promise<ExpenseReportItem[]> => {
  const url = new URL(API_ENDPOINTS.expense.reportDetails);
  url.searchParams.set('userId', String(userId));
  url.searchParams.set('startDate', startDate);
  url.searchParams.set('endDate', endDate);

  return getRequest<ExpenseReportItem[]>(url.toString(), {
    headers: authHeader,
  });
};

export const downloadExpensePdf = async (
  userId: number,
  startDate: string,
  endDate: string,
  authHeader?: Record<string, string>
): Promise<Blob> => {
  const url = new URL(API_ENDPOINTS.expense.reportPdf);
  url.searchParams.set('userId', String(userId));
  url.searchParams.set('startDate', startDate);
  url.searchParams.set('endDate', endDate);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      ...(authHeader ?? {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to fetch expense PDF.');
  }

  const blob = await response.blob();
  if (!blob || blob.size === 0) {
    throw new Error('Expense PDF response was empty.');
  }

  return blob;
};
