import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const LAST_PATH_KEY = 'wealth_tracker_last_path';

const PersistLastLocation = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    if (typeof window === 'undefined') {
      return;
    }
    if (location.pathname === '/login') {
      return;
    }
    window.sessionStorage.setItem(
      LAST_PATH_KEY,
      `${location.pathname}${location.search}`
    );
  }, [isAuthenticated, location.pathname, location.search]);

  return null;
};

export default PersistLastLocation;
