import { useEffect, useMemo, useRef } from 'react';
import type {
  ChatMessage,
  LanguageCode,
  LanguageOption,
  PendingAction,
} from '../types/ChatbotTypes';

interface ChatbotViewProps {
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

const ChatbotView = ({
  isOpen,
  onToggle,
  messages,
  input,
  language,
  languageOptions,
  pendingAction,
  quickPrompts,
  isListening,
  voiceSupported,
  onInputChange,
  onSend,
  onQuickPrompt,
  onLanguageChange,
  onConfirmAction,
  onCancelAction,
  onStartListening,
  onStopListening,
}: ChatbotViewProps) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pendingAction]);

  const hasMessages = messages.length > 0;

  const formattedMessages = useMemo(
    () =>
      messages.map((message) => ({
        ...message,
        timeLabel: new Date(message.timestamp).toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
        }),
      })),
    [messages]
  );

  return (
    <div className="chatbot-float">
      <button
        type="button"
        className={isOpen ? 'chatbot-fab chatbot-fab--open' : 'chatbot-fab'}
        onClick={onToggle}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6.5 6.5h11a3.5 3.5 0 0 1 3.5 3.5v4a3.5 3.5 0 0 1-3.5 3.5H11l-4.5 3v-3H6.5A3.5 3.5 0 0 1 3 14v-4a3.5 3.5 0 0 1 3.5-3.5Z"
            fill="currentColor"
          />
        </svg>
        <span className="sr-only">Chat</span>
      </button>

      {isOpen && (
        <div className="chatbot-panel" role="dialog" aria-label="Assistant chat">
          <header className="chatbot-panel__header">
            <div>
              <p className="chatbot-panel__eyebrow">Wealth Tracker</p>
              <h3>Assistant</h3>
            </div>
            <div className="chatbot-panel__controls">
              <select
                value={language}
                onChange={(event) =>
                  onLanguageChange(event.target.value as LanguageCode)
                }
                aria-label="Select language"
              >
                {languageOptions.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={onToggle}
                className="chatbot-icon-button"
                aria-label="Close chat"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M18 6 6 18M6 6l12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="sr-only">Close</span>
              </button>
            </div>
          </header>

          <div className="chatbot-panel__messages">
            {!hasMessages && (
              <div className="chatbot-panel__empty">
                Ask me to navigate, answer FAQs, or sign you out.
              </div>
            )}
            {formattedMessages.map((message) => (
              <div
                key={message.id}
                className={`chatbot-message chatbot-message--${message.role}`}
              >
                <p>{message.text}</p>
                <span>{message.timeLabel}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-panel__prompts">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => onQuickPrompt(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          {pendingAction && (
            <div className="chatbot-panel__actions">
              <p>
                {pendingAction.type === 'navigate'
                  ? `Navigate to ${pendingAction.label}?`
                  : 'Confirm logout?'}
              </p>
              <div className="chatbot-panel__action-buttons">
                <button type="button" onClick={onConfirmAction}>
                  {pendingAction.type === 'navigate' ? 'Navigate' : 'Logout'}
                </button>
                <button type="button" onClick={onCancelAction}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          <form
            className="chatbot-panel__input"
            onSubmit={(event) => {
              event.preventDefault();
              onSend();
            }}
          >
            <input
              type="text"
              value={input}
              placeholder="Type a message"
              onChange={(event) => onInputChange(event.target.value)}
            />
            {voiceSupported && (
              <button
                type="button"
                className={
                  isListening
                    ? 'chatbot-panel__mic chatbot-panel__mic--active'
                    : 'chatbot-panel__mic'
                }
                onClick={isListening ? onStopListening : onStartListening}
                aria-label={isListening ? 'Stop listening' : 'Start voice input'}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z"
                    fill="currentColor"
                  />
                  <path
                    d="M5 11a1 1 0 1 1 2 0 5 5 0 0 0 10 0 1 1 0 1 1 2 0 7 7 0 0 1-6 6.92V21a1 1 0 1 1-2 0v-3.08A7 7 0 0 1 5 11Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="sr-only">
                  {isListening ? 'Stop' : 'Voice'}
                </span>
              </button>
            )}
            <button type="submit" className="chatbot-panel__send">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M21 12 3 4v6l11 2-11 2v6l18-8Z"
                  fill="currentColor"
                />
              </svg>
              <span className="sr-only">Send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatbotView;
