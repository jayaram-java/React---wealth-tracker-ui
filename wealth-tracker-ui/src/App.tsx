import { lazy, Suspense, useMemo } from 'react';
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  type Location,
} from 'react-router-dom';
import './App.css';
import { AuthProvider } from './features/login/context/AuthProvider';
import FloatingChatbotContainer from './features/chatbot/container/FloatingChatbotContainer';
import Header from './components/Header';
import { AppNavigationContext, getScreenFromLocation, buildNavigateTo } from './context/AppNavigationContext';
import ProtectedRoute from './routes/ProtectedRoute';
import { ROUTES } from './routes/routePaths';
import { useAuth } from './features/login/context/useAuth';
import ApiLoader from './components/common/ApiLoader';
import PageSkeleton from './components/common/PageSkeleton';

// Route-level lazy loading for all 12 screens
const LoginContainer = lazy(() => import('./features/login/container/LoginContainer'));
const RegisterContainer = lazy(() => import('./features/Register/RegisterContainer'));
const DashboardContainer = lazy(() => import('./features/dashboard/container/DashboardContainer'));
const ExpenseDetailsContainer = lazy(() => import('./features/ExpenseDetails/container/ExpenseDetailsContainer'));
const ExpenseCategoryContainer = lazy(() => import('./features/ExpenseCategory/container/ExpenseCategoryContainer'));
const ChecklistCategoryContainer = lazy(() => import('./features/ChecklistCategory/container/ChecklistCategoryContainer'));
const ChecklistContainer = lazy(() => import('./features/Checklist/container/ChecklistContainer'));
const WebsiteCategoryContainer = lazy(() => import('./features/WebsiteCategory/container/WebsiteCategoryContainer'));
const WebsiteLinkContainer = lazy(() => import('./features/WebsiteLink/container/WebsiteLinkContainer'));
const ExpenseReportContainer = lazy(() => import('./features/ExpenseReport/container/ExpenseReportContainer'));
const ServiceHealthDashboardContainer = lazy(() => import('./features/ServiceHealthDashboard/container/ServiceHealthDashboardContainer'));
const MetricsContainer = lazy(() => import('./features/Metrics/container/MetricsContainer'));

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const currentScreen = useMemo(() => getScreenFromLocation(location), [location]);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.login, { replace: true });
  };

  return (
    <AppNavigationContext.Provider
      value={{ currentScreen, navigateTo: buildNavigateTo(navigate) }}
    >
      <Header onLogout={handleLogout} />
      <Suspense fallback={<PageSkeleton />}>
        <Outlet />
      </Suspense>
      <FloatingChatbotContainer />
    </AppNavigationContext.Provider>
  );
};

const LoginRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: Location } | null)?.from?.pathname;

  if (isAuthenticated) {
    return <Navigate to={from ?? ROUTES.dashboard} replace />;
  }

  return (
    <Suspense fallback={<PageSkeleton />}>
      <LoginContainer />
    </Suspense>
  );
};

const RegisterRoute = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  return (
    <Suspense fallback={<PageSkeleton />}>
      <RegisterContainer />
    </Suspense>
  );
};

function App() {
  return (
    <BrowserRouter basename="/wealth-tracker">
      <AuthProvider>
        <ApiLoader />
        <Routes>
          <Route element={<LoginRoute />} path={ROUTES.login} />
          <Route element={<RegisterRoute />} path={ROUTES.register} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<DashboardContainer />} />
              <Route
                path={ROUTES.expenseDetails}
                element={<ExpenseDetailsContainer />}
              />
              <Route
                path={ROUTES.expenseCategories}
                element={<ExpenseCategoryContainer />}
              />
              <Route
                path={ROUTES.checklistCategories}
                element={<ChecklistCategoryContainer />}
              />
              <Route path={ROUTES.checklists} element={<ChecklistContainer />} />
              <Route
                path={ROUTES.websiteCategories}
                element={<WebsiteCategoryContainer />}
              />
              <Route path={ROUTES.websiteLinks} element={<WebsiteLinkContainer />} />
              <Route
                path={ROUTES.expenseReports}
                element={<ExpenseReportContainer />}
              />
              <Route
                path={ROUTES.serviceHealth}
                element={<ServiceHealthDashboardContainer />}
              />
              <Route path={ROUTES.metrics} element={<MetricsContainer />} />
            </Route>
          </Route>
          <Route element={<Navigate to={ROUTES.dashboard} replace />} path="/" />
          <Route path="*" element={<Navigate to={ROUTES.login} replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
