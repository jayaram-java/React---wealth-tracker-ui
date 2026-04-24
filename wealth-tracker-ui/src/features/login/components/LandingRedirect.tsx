import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const LAST_PATH_KEY = 'wealth_tracker_last_path';

const LoadingScreen = () => (
  <div style={{ padding: 24, fontWeight: 600 }}>Loading...</div>
);

const LandingRedirect = () => {
  const { isAuthenticated, isHydrated } = useAuth();

  if (!isHydrated) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const lastPath =
    typeof window === 'undefined' ? null : window.sessionStorage.getItem(LAST_PATH_KEY);

  const target =
    lastPath && lastPath.startsWith('/') && lastPath !== '/login'
      ? lastPath
      : '/dashboard';

  return <Navigate to={target} replace />;
};

export default LandingRedirect;
