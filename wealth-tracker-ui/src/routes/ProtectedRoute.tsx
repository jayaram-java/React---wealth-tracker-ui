import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../features/login/context/useAuth';

const ProtectedRoute = () => {
  const { isAuthenticated, isHydrated } = useAuth();
  const location = useLocation();

  if (!isHydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

