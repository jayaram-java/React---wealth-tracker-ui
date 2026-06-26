import { createContext, useContext } from 'react';
import type { NavigateFunction, Location } from 'react-router-dom';
import { screenToPath } from '../routes/routePaths';

export type AppScreen =
  | 'login'
  | 'dashboard'
  | 'expense-details'
  | 'expense-categories'
  | 'checklist-categories'
  | 'checklists'
  | 'website-categories'
  | 'website-links'
  | 'expense-reports'
  | 'service-health'
  | 'metrics';

interface AppNavigationContextValue {
  currentScreen: AppScreen;
  navigateTo: (screen: AppScreen) => void;
}

export const AppNavigationContext = createContext<AppNavigationContextValue | null>(
  null
);

export const useAppNavigation = () => {
  const context = useContext(AppNavigationContext);
  if (!context) {
    throw new Error('useAppNavigation must be used within AppNavigationContext');
  }
  return context;
};

export const getScreenFromLocation = (location: Location): AppScreen => {
  const path = location.pathname.startsWith('/wealth-tracker')
    ? location.pathname.replace('/wealth-tracker', '') || '/'
    : location.pathname;
  const normalizedPath = path === '' ? '/' : path;

  const match = Object.entries(screenToPath).find(([, routePath]) => {
    const normalizedRoute = routePath === '' ? '/' : routePath;
    return normalizedRoute === normalizedPath;
  });

  return (match?.[0] as AppScreen) ?? 'dashboard';
};

export const buildNavigateTo = (navigate: NavigateFunction) => (screen: AppScreen) => {
  navigate(screenToPath[screen]);
};
