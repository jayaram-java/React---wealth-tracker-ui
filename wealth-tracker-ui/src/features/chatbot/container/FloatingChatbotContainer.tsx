import { lazy, Suspense, useState } from 'react';
import { useAuth } from '../../login/context/useAuth';
import { useAppNavigation } from '../../../context/AppNavigationContext';

const ChatbotContainer = lazy(() => import('./ChatbotContainer'));

const FloatingChatbotContainer = () => {
  const { isAuthenticated } = useAuth();
  const { currentScreen } = useAppNavigation();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated || currentScreen === 'login') {
    return null;
  }

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <Suspense fallback={null}>
      <ChatbotContainer isOpen={isOpen} onToggle={handleToggle} />
    </Suspense>
  );
};

export default FloatingChatbotContainer;
