import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
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
import ProtectedRoute from './features/login/components/ProtectedRoute';
import PersistLastLocation from './features/login/components/PersistLastLocation';
import LandingRedirect from './features/login/components/LandingRedirect';
import AdminRoute from './features/login/components/AdminRoute';
import ServiceHealthDashboardContainer from './features/ServiceHealthDashboard/container/ServiceHealthDashboardContainer';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingRedirect />} />
    <Route path="/login" element={<LoginContainer />} />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <DashboardContainer />
        </ProtectedRoute>
      }
    />
    <Route
      path="/expense-categories"
      element={
        <ProtectedRoute>
          <ExpenseCategoryContainer />
        </ProtectedRoute>
      }
    />
    <Route
      path="/expense-details"
      element={
        <ProtectedRoute>
          <ExpenseDetailsContainer />
        </ProtectedRoute>
      }
    />
    <Route
      path="/checklist-categories"
      element={
        <ProtectedRoute>
          <ChecklistCategoryContainer />
        </ProtectedRoute>
      }
    />
    <Route
      path="/checklists"
      element={
        <ProtectedRoute>
          <ChecklistContainer />
        </ProtectedRoute>
      }
    />
    <Route
      path="/website-categories"
      element={
        <ProtectedRoute>
          <WebsiteCategoryContainer />
        </ProtectedRoute>
      }
    />
    <Route
      path="/website-links"
      element={
        <ProtectedRoute>
          <WebsiteLinkContainer />
        </ProtectedRoute>
      }
    />
    <Route
      path="/expense-reports"
      element={
        <ProtectedRoute>
          <ExpenseReportContainer />
        </ProtectedRoute>
      }
    />
    <Route
      path="/service-health"
      element={
        <AdminRoute>
          <ServiceHealthDashboardContainer />
        </AdminRoute>
      }
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <PersistLastLocation />
        <AppRoutes />
        <FloatingChatbotContainer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
