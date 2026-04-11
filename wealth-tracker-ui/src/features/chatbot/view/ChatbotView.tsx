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
        <span>{isOpen ? 'Close' : 'Chat'}</span>
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
              <button type="button" onClick={onToggle}>
                Close
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
                {isListening ? 'Stop' : 'Voice'}
              </button>
            )}
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatbotView;
