import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../login/context/AuthProvider';
import ChatbotContainer from './ChatbotContainer';

const FloatingChatbotContainer = () => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  if (!isAuthenticated || location.pathname === '/login') {
    return null;
  }

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return <ChatbotContainer isOpen={isOpen} onToggle={handleToggle} />;
};

export default FloatingChatbotContainer;
