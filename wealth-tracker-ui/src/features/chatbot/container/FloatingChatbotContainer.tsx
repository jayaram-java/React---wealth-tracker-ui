import { useState } from 'react';
import { useAuth } from '../../login/context/AuthProvider';
import ChatbotContainer from './ChatbotContainer';

const FloatingChatbotContainer = () => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated) {
    return null;
  }

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return <ChatbotContainer isOpen={isOpen} onToggle={handleToggle} />;
};

export default FloatingChatbotContainer;
