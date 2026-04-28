import type { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { decodeJwtPayload } from '../../../utils/jwt';
import { useAuth } from '../context/useAuth';

interface JwtPayload {
  roles?: string[];
}

const LoadingScreen = () => (
  <div style={{ padding: 24, fontWeight: 600 }}>Loading...</div>
);

const AdminRoute = ({ children }: { children: ReactElement }) => {
  const { isAuthenticated, isHydrated, accessToken } = useAuth();
  const location = useLocation();

  if (!isHydrated) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const payload = accessToken ? decodeJwtPayload<JwtPayload>(accessToken) : null;
  const roles = payload?.roles ?? [];
  const isAdmin = roles.includes('ROLE_ADMIN');

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;

