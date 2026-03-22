const AUTH_BASE_URL =
  import.meta.env.VITE_AUTH_BASE_URL ?? 'http://localhost:8085';
const EXPENSE_BASE_URL =
  import.meta.env.VITE_EXPENSE_BASE_URL ?? 'http://localhost:8086';

export const API_ENDPOINTS = {
  auth: {
    login: `${AUTH_BASE_URL}/authservice/api/auth/login`,
  },
  expense: {
    categories: `${EXPENSE_BASE_URL}/expenseservice/api/v1/expense-categories`,
    categoryById: (id: number) =>
      `${EXPENSE_BASE_URL}/expenseservice/api/v1/expense-categories/${id}`,
    details: `${EXPENSE_BASE_URL}/expenseservice/api/v1/expense-details`,
    detailById: (id: number) =>
      `${EXPENSE_BASE_URL}/expenseservice/api/v1/expense-details/${id}`,
    summary: `${EXPENSE_BASE_URL}/expenseservice/api/v1/expense-reports/summary`,
  },
};
