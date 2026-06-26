import { useMemo } from 'react';
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
import LoginContainer from './features/login/container/LoginContainer';
import DashboardContainer from './features/dashboard/container/DashboardContainer';
import { AuthProvider } from './features/login/context/AuthProvider';
import ExpenseCategoryContainer from './features/ExpenseCategory/container/ExpenseCategoryContainer';
import ExpenseDetailsContainer from './features/ExpenseDetails/container/ExpenseDetailsContainer';
import WebsiteCategoryContainer from './features/WebsiteCategory/container/WebsiteCategoryContainer';
import WebsiteLinkContainer from './features/WebsiteLink/container/WebsiteLinkContainer';
import ChecklistCategoryContainer from './features/ChecklistCategory/container/ChecklistCategoryContainer';
import ChecklistContainer from './features/Checklist/container/ChecklistContainer';
import FloatingChatbotContainer from './features/chatbot/container/FloatingChatbotContainer';
import ExpenseReportContainer from './features/ExpenseReport/container/ExpenseReportContainer';
import ServiceHealthDashboardContainer from './features/ServiceHealthDashboard/container/ServiceHealthDashboardContainer';
import MetricsContainer from './features/Metrics/container/MetricsContainer';
import Header from './components/Header';
import { AppNavigationContext, getScreenFromLocation, buildNavigateTo } from './context/AppNavigationContext';
import ProtectedRoute from './routes/ProtectedRoute';
import { ROUTES } from './routes/routePaths';
import { useAuth } from './features/login/context/useAuth';

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const currentScreen = useMemo(() => getScreenFromLocation(location), [location]);

  return (
    <AppNavigationContext.Provider
      value={{ currentScreen, navigateTo: buildNavigateTo(navigate) }}
    >
      <Header onLogout={logout} />
      <Outlet />
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

  return <LoginContainer />;
};

function App() {
  return (
    <BrowserRouter basename="/wealth-tracker">
      <AuthProvider>
        <Routes>
          <Route element={<LoginRoute />} path={ROUTES.login} />
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
