import type { AppScreen } from '../context/AppNavigationContext';

export const ROUTES = {
  login: '/login',
  register: '/register',
  dashboard: '/',
  expenseDetails: '/expense-details',
  expenseCategories: '/expense-categories',
  checklistCategories: '/checklist-categories',
  checklists: '/checklists',
  websiteCategories: '/website-categories',
  websiteLinks: '/website-links',
  expenseReports: '/expense-reports',
  serviceHealth: '/service-health',
  metrics: '/metrics',
} as const;

export const screenToPath: Record<AppScreen, string> = {
  login: ROUTES.login,
  register: ROUTES.register,
  dashboard: ROUTES.dashboard,
  'expense-details': ROUTES.expenseDetails,
  'expense-categories': ROUTES.expenseCategories,
  'checklist-categories': ROUTES.checklistCategories,
  checklists: ROUTES.checklists,
  'website-categories': ROUTES.websiteCategories,
  'website-links': ROUTES.websiteLinks,
  'expense-reports': ROUTES.expenseReports,
  'service-health': ROUTES.serviceHealth,
  metrics: ROUTES.metrics,
};

export const pathToScreen = (path: string): AppScreen => {
  const normalized = path.replace(/\/+$/, '') || '/';
  const entry = Object.entries(screenToPath).find(([, routePath]) => {
    const normalizedRoute = routePath.replace(/\/+$/, '') || '/';
    return normalized === normalizedRoute;
  });

  return (entry?.[0] as AppScreen) ?? 'dashboard';
};
