import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../login/context/useAuth';
import ChatbotPresenter from '../presenter/ChatbotPresenter';
import type {
  ChatMessage,
  LanguageCode,
  PendingAction,
} from '../types/ChatbotTypes';
import {
  getAssistantReply,
  getCancelReply,
  getConfirmIntent,
  getLanguageSetReply,
  getLogoutDoneReply,
  getNavigateDoneReply,
} from './assistantEngine';
import {
  LANGUAGE_LOCALE_MAP,
  LANGUAGE_OPTIONS,
  QUICK_PROMPTS,
} from './assistantRules';

interface ChatbotContainerProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface SpeechRecognitionResultLike {
  transcript: string;
}

interface SpeechRecognitionResultListLike {
  [index: number]: SpeechRecognitionResultLike;
  length: number;
}

interface SpeechRecognitionEventLike {
  results: SpeechRecognitionResultListLike[];
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

const ChatbotContainer = ({ isOpen, onToggle }: ChatbotContainerProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [isListening, setIsListening] = useState(false);
  const messageId = useRef(0);
  const inputRef = useRef('');
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const greetedRef = useRef(false);

  const speechSupported = useMemo(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    const browser = window as Window & {
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
      SpeechRecognition?: SpeechRecognitionConstructor;
    };
    return Boolean(browser.SpeechRecognition || browser.webkitSpeechRecognition);
  }, []);

  const buildMessage = useCallback(
    (text: string, role: ChatMessage['role']): ChatMessage => {
      messageId.current += 1;
      return {
        id: `chat-${messageId.current}`,
        role,
        text,
        timestamp: Date.now(),
        language,
      };
    },
    [language]
  );

  const appendMessages = useCallback((next: ChatMessage[]) => {
    setMessages((prev) => [...prev, ...next]);
  }, []);

  const handleSend = useCallback(
    (value?: string) => {
      const messageText = (value ?? input).trim();
      if (!messageText) {
        return;
      }
      const confirmation = pendingAction
        ? getConfirmIntent(messageText, language)
        : null;

      if (pendingAction && confirmation === 'confirm') {
        if (pendingAction.type === 'navigate') {
          navigate(pendingAction.path);
          appendMessages([
            buildMessage(messageText, 'user'),
            buildMessage(
              getNavigateDoneReply(language, pendingAction.label),
              'assistant'
            ),
          ]);
        }
        if (pendingAction.type === 'logout') {
          logout();
          navigate('/login');
          appendMessages([
            buildMessage(messageText, 'user'),
            buildMessage(getLogoutDoneReply(language), 'assistant'),
          ]);
        }
        setPendingAction(null);
        setInput('');
        return;
      }

      if (pendingAction && confirmation === 'cancel') {
        appendMessages([
          buildMessage(messageText, 'user'),
          buildMessage(getCancelReply(language), 'assistant'),
        ]);
        setPendingAction(null);
        setInput('');
        return;
      }

      if (pendingAction) {
        setPendingAction(null);
      }

      const reply = getAssistantReply(messageText, language);
      appendMessages([
        buildMessage(messageText, 'user'),
        buildMessage(reply.response, 'assistant'),
      ]);
      setPendingAction(reply.action ?? null);
      setInput('');
    },
    [
      appendMessages,
      buildMessage,
      input,
      language,
      logout,
      navigate,
      pendingAction,
    ]
  );

  useEffect(() => {
    inputRef.current = input;
  }, [input]);

  const handleQuickPrompt = useCallback(
    (prompt: string) => {
      handleSend(prompt);
    },
    [handleSend]
  );

  const handleLanguageChange = useCallback(
    (next: LanguageCode) => {
      setLanguage(next);
      appendMessages([buildMessage(getLanguageSetReply(next), 'assistant')]);
    },
    [appendMessages, buildMessage]
  );

  const handleConfirmAction = useCallback(() => {
    if (!pendingAction) {
      return;
    }
    if (pendingAction.type === 'navigate') {
      navigate(pendingAction.path);
      appendMessages([
        buildMessage(getNavigateDoneReply(language, pendingAction.label), 'assistant'),
      ]);
    }
    if (pendingAction.type === 'logout') {
      logout();
      navigate('/login');
      appendMessages([buildMessage(getLogoutDoneReply(language), 'assistant')]);
    }
    setPendingAction(null);
  }, [appendMessages, buildMessage, language, logout, navigate, pendingAction]);

  const handleCancelAction = useCallback(() => {
    if (!pendingAction) {
      return;
    }
    appendMessages([buildMessage(getCancelReply(language), 'assistant')]);
    setPendingAction(null);
  }, [appendMessages, buildMessage, language, pendingAction]);

  const initRecognition = useCallback(() => {
    if (!speechSupported) {
      return null;
    }
    const browser = window as Window & {
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
      SpeechRecognition?: SpeechRecognitionConstructor;
    };
    const Recognition =
      browser.SpeechRecognition || browser.webkitSpeechRecognition;
    if (!Recognition) {
      return null;
    }
    if (!recognitionRef.current) {
      const recognition = new Recognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript ?? '';
        const composed = normalizeInput(`${inputRef.current} ${transcript}`);
        setInput(composed);
        if (composed) {
          handleSend(composed);
        }
      };
      recognition.onerror = () => {
        setIsListening(false);
      };
      recognition.onend = () => {
        setIsListening(false);
      };
      recognitionRef.current = recognition;
    }
    recognitionRef.current.lang = LANGUAGE_LOCALE_MAP[language];
    return recognitionRef.current;
  }, [handleSend, language, speechSupported]);

  const handleStartListening = useCallback(() => {
    const recognition = initRecognition();
    if (!recognition) {
      return;
    }
    try {
      recognition.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
    }
  }, [initRecognition]);

  const handleStopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  useEffect(() => {
    if (isOpen && !greetedRef.current) {
      const reply = getAssistantReply('hello', language);
      appendMessages([buildMessage(reply.response, 'assistant')]);
      greetedRef.current = true;
    }
  }, [appendMessages, buildMessage, isOpen, language]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const quickPrompts = QUICK_PROMPTS[language];

  return (
    <ChatbotPresenter
      isOpen={isOpen}
      onToggle={onToggle}
      messages={messages}
      input={input}
      language={language}
      languageOptions={LANGUAGE_OPTIONS}
      pendingAction={pendingAction}
      quickPrompts={quickPrompts}
      isListening={isListening}
      voiceSupported={speechSupported}
      onInputChange={setInput}
      onSend={handleSend}
      onQuickPrompt={handleQuickPrompt}
      onLanguageChange={handleLanguageChange}
      onConfirmAction={handleConfirmAction}
      onCancelAction={handleCancelAction}
      onStartListening={handleStartListening}
      onStopListening={handleStopListening}
    />
  );
};

const normalizeInput = (value: string) => value.replace(/\s+/g, ' ').trim();

export default ChatbotContainer;
