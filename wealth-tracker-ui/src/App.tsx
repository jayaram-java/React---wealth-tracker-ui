import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginContainer from './features/login/container/LoginContainer';
import DashboardContainer from './features/dashboard/container/DashboardContainer';
import { AuthProvider, useAuth } from './features/login/context/AuthProvider';
import ExpenseCategoryContainer from './features/ExpenseCategory/container/ExpenseCategoryContainer';
import ExpenseDetailsContainer from './features/ExpenseDetails/container/ExpenseDetailsContainer';
import WebsiteCategoryContainer from './features/WebsiteCategory/container/WebsiteCategoryContainer';
import WebsiteLinkContainer from './features/WebsiteLink/container/WebsiteLinkContainer';

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<LoginContainer />} />
    <Route
      path="/dashboard"
      element={
        <RequireAuth>
          <DashboardContainer />
        </RequireAuth>
      }
    />
    <Route
      path="/expense-categories"
      element={
        <RequireAuth>
          <ExpenseCategoryContainer />
        </RequireAuth>
      }
    />
    <Route
      path="/expense-details"
      element={
        <RequireAuth>
          <ExpenseDetailsContainer />
        </RequireAuth>
      }
    />
    <Route
      path="/website-categories"
      element={
        <RequireAuth>
          <WebsiteCategoryContainer />
        </RequireAuth>
      }
    />
    <Route
      path="/website-links"
      element={
        <RequireAuth>
          <WebsiteLinkContainer />
        </RequireAuth>
      }
    />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
