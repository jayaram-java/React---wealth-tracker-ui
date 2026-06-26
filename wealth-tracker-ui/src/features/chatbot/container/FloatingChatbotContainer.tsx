import { useState } from 'react';
import { useAuth } from '../../login/context/useAuth';
import { useAppNavigation } from '../../../context/AppNavigationContext';
import ChatbotContainer from './ChatbotContainer';

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

  return <ChatbotContainer isOpen={isOpen} onToggle={handleToggle} />;
};

export default FloatingChatbotContainer;
