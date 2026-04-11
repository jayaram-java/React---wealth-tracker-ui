import type { IntentResult, LanguageCode, PendingAction } from '../types/ChatbotTypes';
import {
  ALLOWED_ROUTES,
  FAQ_ENTRIES,
  LANGUAGE_LABELS,
  RESPONSE_TEMPLATES,
  TRANSLATION_DICTIONARY,
  TYPO_NORMALIZATION,
} from './assistantRules';

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, ' ').trim();

const removeDiacritics = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const applyTypoNormalization = (value: string) => {
  let output = value;
  Object.entries(TYPO_NORMALIZATION).forEach(([typo, correction]) => {
    const pattern = new RegExp(`\\b${escapeRegExp(typo)}\\b`, 'gi');
    output = output.replace(pattern, correction);
  });
  return output;
};

const translateToEnglish = (value: string, language: LanguageCode) => {
  const dictionary = TRANSLATION_DICTIONARY[language];
  if (!dictionary || Object.keys(dictionary).length === 0) {
    return value;
  }
  let output = value.toLowerCase();
  Object.entries(dictionary).forEach(([source, target]) => {
    const pattern = new RegExp(`\\b${escapeRegExp(source)}\\b`, 'gi');
    output = output.replace(pattern, target);
  });
  return output;
};

const normalizeForIntent = (value: string, language: LanguageCode) => {
  const translated = translateToEnglish(value, language);
  const withoutDiacritics = removeDiacritics(translated);
  const lettersOnly = withoutDiacritics.replace(/[^a-z0-9\s]/gi, ' ');
  const collapsed = normalizeWhitespace(lettersOnly.toLowerCase());
  return applyTypoNormalization(collapsed);
};

const includesAny = (value: string, tokens: string[]) =>
  tokens.some((token) => value.includes(token));

const matchRoute = (value: string) => {
  let best: { score: number; index: number } | null = null;
  ALLOWED_ROUTES.forEach((route, index) => {
    let score = 0;
    route.keywords.forEach((keyword) => {
      if (value.includes(keyword)) {
        score += keyword.split(' ').length + 1;
      }
    });
    if (score > 0 && (!best || score > best.score)) {
      best = { score, index };
    }
  });
  return best ? ALLOWED_ROUTES[best.index] : null;
};

const matchFaq = (value: string) =>
  FAQ_ENTRIES.find((entry) => includesAny(value, entry.keywords));

const isGreeting = (value: string) =>
  includesAny(value, ['hi', 'hello', 'hey', 'namaste', 'hola']);

const isHelp = (value: string) =>
  includesAny(value, ['help', 'support', 'what can you do', 'options']);

const isLogout = (value: string) =>
  includesAny(value, ['logout', 'log out', 'sign out', 'exit']);

const formatTemplate = (template: string, replacements: Record<string, string>) => {
  let output = template;
  Object.entries(replacements).forEach(([key, value]) => {
    output = output.replace(`{${key}}`, value);
  });
  return output;
};

export const getAssistantReply = (
  input: string,
  language: LanguageCode
): IntentResult => {
  const normalized = normalizeForIntent(input, language);
  const responses = RESPONSE_TEMPLATES[language];

  if (!normalized) {
    return { intent: 'unknown', response: responses.unknown };
  }

  if (isGreeting(normalized)) {
    return { intent: 'greeting', response: responses.greeting };
  }

  if (isLogout(normalized)) {
    const action: PendingAction = { type: 'logout' };
    return { intent: 'logout', response: responses.logoutPrompt, action };
  }

  if (isHelp(normalized)) {
    return { intent: 'help', response: responses.help };
  }

  const route = matchRoute(normalized);
  if (route) {
    const action: PendingAction = {
      type: 'navigate',
      path: route.path,
      label: route.label,
    };
    return {
      intent: 'navigate',
      response: formatTemplate(responses.navigatePrompt, { label: route.label }),
      action,
    };
  }

  const faq = matchFaq(normalized);
  if (faq) {
    return {
      intent: 'faq',
      response: faq.answer[language],
      faqId: faq.id,
    };
  }

  const allowedList = ALLOWED_ROUTES.map((route) => route.label).join(', ');
  return {
    intent: 'unknown',
    response: `${responses.unknown} (${allowedList})`,
  };
};

export const getLanguageSetReply = (language: LanguageCode) => {
  const responses = RESPONSE_TEMPLATES[language];
  return formatTemplate(responses.languageSet, {
    language: LANGUAGE_LABELS[language],
  });
};

export const getCancelReply = (language: LanguageCode) =>
  RESPONSE_TEMPLATES[language].canceled;

export const getNavigateDoneReply = (language: LanguageCode, label: string) =>
  formatTemplate(RESPONSE_TEMPLATES[language].navigated, { label });

export const getLogoutDoneReply = (language: LanguageCode) =>
  RESPONSE_TEMPLATES[language].loggedOut;

export const getConfirmIntent = (input: string, language: LanguageCode) => {
  const normalized = normalizeForIntent(input, language);
  const confirmTokens = ['yes', 'yep', 'ok', 'okay', 'confirm', 'go', 'proceed'];
  const cancelTokens = ['no', 'cancel', 'stop', 'wait', 'not now', 'later'];

  if (includesAny(normalized, confirmTokens)) {
    return 'confirm';
  }
  if (includesAny(normalized, cancelTokens)) {
    return 'cancel';
  }
  return null;
};
