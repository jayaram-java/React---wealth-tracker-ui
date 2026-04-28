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
  actuator: {
    authService: {
      baseUrl: '/authservice',
      health: '/authservice/actuator/health',
      info: '/authservice/actuator/info',
      metricsIndex: '/authservice/actuator/metrics',
      prometheus: '/authservice/actuator/prometheus',
      customMetrics: {
        apiRequestsTotal: '/authservice/actuator/metrics/app_api_requests_total',
        apiRequestDuration: '/authservice/actuator/metrics/app_api_request_duration',
      },
    },
    spendwiseService: {
      baseUrl: '/expenseservice',
      health: '/expenseservice/actuator/health',
      prometheus: '/expenseservice/actuator/prometheus',
      customMetrics: {
        apiRequestsTotal: '/expenseservice/actuator/metrics/app_api_requests_total',
        apiRequestDuration: '/expenseservice/actuator/metrics/app_api_request_duration',
      },
    },
    reportAutomationService: {
      baseUrl: '/report-automation-service',
      health: '/report-automation-service/actuator/health',
      prometheus: '/report-automation-service/actuator/prometheus',
      customMetrics: {
        apiRequestsTotal:
          '/report-automation-service/actuator/metrics/app_api_requests_total',
        apiRequestDuration:
          '/report-automation-service/actuator/metrics/app_api_request_duration',
      },
    },
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
