const AUTH_BASE_URL =
  import.meta.env.VITE_AUTH_BASE_URL ?? 'http://localhost:8085';
const EXPENSE_BASE_URL =
  import.meta.env.VITE_EXPENSE_BASE_URL ?? 'http://localhost:8086';
const REPORT_AUTOMATION_BASE_URL =
  import.meta.env.VITE_REPORT_AUTOMATION_BASE_URL ?? 'http://localhost:8089';

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
    trends: `${EXPENSE_BASE_URL}/expenseservice/api/v1/expense-reports/trends`,
    reportDetails: `${EXPENSE_BASE_URL}/expenseservice/api/v1/expense-reports/details`,
    reportPdf: `${REPORT_AUTOMATION_BASE_URL}/report-automation-service/documents/expense/pdf`,
  },
  reportAutomation: {
    sendExpenseDetailsEmail: `${REPORT_AUTOMATION_BASE_URL}/report-automation-service/api/v1/email/sendemailforexpensedetails`,
  },
  website: {
    categories: `${EXPENSE_BASE_URL}/expenseservice/api/v1/website-categories`,
    categoryById: (id: number) =>
      `${EXPENSE_BASE_URL}/expenseservice/api/v1/website-categories/${id}`,
    links: `${EXPENSE_BASE_URL}/expenseservice/api/v1/website-links`,
    linkById: (id: number) =>
      `${EXPENSE_BASE_URL}/expenseservice/api/v1/website-links/${id}`,
  },
  checklist: {
    categories: `${EXPENSE_BASE_URL}/expenseservice/api/v1/checklist-categories`,
    categoryById: (id: number) =>
      `${EXPENSE_BASE_URL}/expenseservice/api/v1/checklist-categories/${id}`,
    items: `${EXPENSE_BASE_URL}/expenseservice/api/v1/checklists`,
    itemById: (id: number) =>
      `${EXPENSE_BASE_URL}/expenseservice/api/v1/checklists/${id}`,
  },
};
