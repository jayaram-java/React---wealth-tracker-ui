import { useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { useAppNavigation } from '../../../context/AppNavigationContext';

const LAST_SCREEN_KEY = 'wealth_tracker_last_screen';

const PersistLastLocation = () => {
  const { isAuthenticated } = useAuth();
  const { currentScreen } = useAppNavigation();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    if (typeof window === 'undefined') {
      return;
    }
    window.sessionStorage.setItem(LAST_SCREEN_KEY, currentScreen);
  }, [currentScreen, isAuthenticated]);

  return null;
};

export default PersistLastLocation;
