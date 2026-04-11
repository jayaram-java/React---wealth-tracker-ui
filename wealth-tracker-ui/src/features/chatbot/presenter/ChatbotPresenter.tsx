import '../styles/Chatbot.css';
import type {
  ChatMessage,
  LanguageCode,
  LanguageOption,
  PendingAction,
} from '../types/ChatbotTypes';
import ChatbotView from '../view/ChatbotView';

interface ChatbotPresenterProps {
  isOpen: boolean;
  onToggle: () => void;
  messages: ChatMessage[];
  input: string;
  language: LanguageCode;
  languageOptions: LanguageOption[];
  pendingAction: PendingAction | null;
  quickPrompts: string[];
  isListening: boolean;
  voiceSupported: boolean;
  onInputChange: (value: string) => void;
  onSend: (value?: string) => void;
  onQuickPrompt: (prompt: string) => void;
  onLanguageChange: (code: LanguageCode) => void;
  onConfirmAction: () => void;
  onCancelAction: () => void;
  onStartListening: () => void;
  onStopListening: () => void;
}

const ChatbotPresenter = (props: ChatbotPresenterProps) => (
  <ChatbotView {...props} />
);

export default ChatbotPresenter;
