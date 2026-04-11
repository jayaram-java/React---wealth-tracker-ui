export type ChatRole = 'user' | 'assistant' | 'system';

export type LanguageCode = 'en' | 'hi' | 'es';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  timestamp: number;
  language: LanguageCode;
}

export type PendingAction =
  | { type: 'navigate'; path: string; label: string }
  | { type: 'logout' };

export type IntentType =
  | 'greeting'
  | 'help'
  | 'navigate'
  | 'logout'
  | 'faq'
  | 'unknown'
  | 'confirm'
  | 'cancel';

export interface IntentResult {
  intent: IntentType;
  response: string;
  action?: PendingAction;
  faqId?: string;
}
