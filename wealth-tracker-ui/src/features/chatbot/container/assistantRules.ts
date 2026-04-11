import type { LanguageCode, LanguageOption } from '../types/ChatbotTypes';

export interface AllowedRoute {
  id: string;
  label: string;
  path: string;
  keywords: string[];
}

export interface FaqEntry {
  id: string;
  question: Record<LanguageCode, string>;
  answer: Record<LanguageCode, string>;
  keywords: string[];
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'es', label: 'Spanish' },
];

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  en: 'English',
  hi: 'Hindi',
  es: 'Spanish',
};

export const LANGUAGE_LOCALE_MAP: Record<LanguageCode, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  es: 'es-ES',
};

export const ALLOWED_ROUTES: AllowedRoute[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    keywords: ['dashboard', 'home', 'overview', 'summary'],
  },
  {
    id: 'expense-details',
    label: 'Expense Details',
    path: '/expense-details',
    keywords: [
      'expense details',
      'expense detail',
      'expenses',
      'transactions',
      'spendings',
      'expense list',
    ],
  },
  {
    id: 'expense-categories',
    label: 'Expense Categories',
    path: '/expense-categories',
    keywords: [
      'expense categories',
      'expense category',
      'categories',
      'category list',
    ],
  },
  {
    id: 'website-categories',
    label: 'Website Categories',
    path: '/website-categories',
    keywords: [
      'website categories',
      'website category',
      'web categories',
      'site categories',
    ],
  },
  {
    id: 'website-links',
    label: 'Website Links',
    path: '/website-links',
    keywords: ['website links', 'web links', 'links', 'site links'],
  },
];

export const QUICK_PROMPTS: Record<LanguageCode, string[]> = {
  en: [
    'Show my dashboard',
    'Go to expense details',
    'Open expense categories',
    'Where are website links?',
    'How do I add an expense?',
  ],
  hi: [
    'Dashboard kholna hai',
    'Expense details par jana hai',
    'Expense categories dikhao',
    'Website links kahan hain?',
    'Expense kaise add karu?',
  ],
  es: [
    'Ir al panel',
    'Abrir detalles de gastos',
    'Mostrar categorias de gastos',
    'Donde estan los enlaces?',
    'Como agrego un gasto?',
  ],
};

export const FAQ_ENTRIES: FaqEntry[] = [
  {
    id: 'add-expense',
    question: {
      en: 'How do I add a new expense?',
      hi: 'Naya expense kaise add karu?',
      es: 'Como agrego un nuevo gasto?',
    },
    answer: {
      en: 'Open Expense Details, fill the form, and press Save.',
      hi: 'Expense Details kholkar form bharo aur Save dabao.',
      es: 'Ve a Detalles de gastos, completa el formulario y guarda.',
    },
    keywords: ['add expense', 'new expense', 'create expense', 'add transaction'],
  },
  {
    id: 'edit-expense',
    question: {
      en: 'How do I edit an expense?',
      hi: 'Expense edit kaise karu?',
      es: 'Como edito un gasto?',
    },
    answer: {
      en: 'Open Expense Details, choose Edit, update fields, and Save.',
      hi: 'Expense Details me Edit chuno, fields update karo aur Save.',
      es: 'En Detalles de gastos, elige Editar, actualiza y guarda.',
    },
    keywords: ['edit expense', 'update expense', 'modify expense'],
  },
  {
    id: 'delete-expense',
    question: {
      en: 'How do I delete an expense?',
      hi: 'Expense delete kaise karu?',
      es: 'Como borro un gasto?',
    },
    answer: {
      en: 'In Expense Details, select Delete and confirm the prompt.',
      hi: 'Expense Details me Delete select karo aur confirm karo.',
      es: 'En Detalles de gastos, selecciona Eliminar y confirma.',
    },
    keywords: ['delete expense', 'remove expense', 'clear expense'],
  },
  {
    id: 'website-links',
    question: {
      en: 'Where can I manage website links?',
      hi: 'Website links kahan manage hote hain?',
      es: 'Donde gestiono los enlaces?',
    },
    answer: {
      en: 'Use the Website Links page to add or update links.',
      hi: 'Website Links page se links add ya update kar sakte ho.',
      es: 'Usa la pagina de Enlaces para agregar o actualizar.',
    },
    keywords: ['website links', 'web links', 'manage links'],
  },
];

export const TYPO_NORMALIZATION: Record<string, string> = {
  dashbaord: 'dashboard',
  dasboard: 'dashboard',
  expnse: 'expense',
  expanse: 'expense',
  detials: 'details',
  categry: 'category',
  categroy: 'category',
  linkes: 'links',
  logut: 'logout',
  loguot: 'logout',
};

export const TRANSLATION_DICTIONARY: Record<LanguageCode, Record<string, string>> = {
  en: {},
  hi: {
    dashboard: 'dashboard',
    kharcha: 'expense',
    kharch: 'expense',
    expenses: 'expense',
    expense: 'expense',
    details: 'details',
    category: 'category',
    categories: 'categories',
    website: 'website',
    link: 'links',
    links: 'links',
    logout: 'logout',
    signout: 'logout',
    help: 'help',
    batao: 'help',
    dikhhao: 'show',
    dikhao: 'show',
  },
  es: {
    panel: 'dashboard',
    tablero: 'dashboard',
    gastos: 'expense',
    gasto: 'expense',
    categorias: 'categories',
    categoria: 'category',
    detalles: 'details',
    enlaces: 'links',
    enlace: 'links',
    sitio: 'website',
    web: 'website',
    cerrar: 'logout',
    sesion: 'logout',
    ayuda: 'help',
    mostrar: 'show',
    abrir: 'open',
    ir: 'go',
  },
};

export const RESPONSE_TEMPLATES: Record<
  LanguageCode,
  {
    greeting: string;
    help: string;
    unknown: string;
    navigatePrompt: string;
    logoutPrompt: string;
    canceled: string;
    navigated: string;
    loggedOut: string;
    languageSet: string;
  }
> = {
  en: {
    greeting: 'Hi! I can help you jump to pages, answer quick FAQs, or log out.',
    help: 'Try: "Go to expense details", "Open dashboard", or ask a FAQ.',
    unknown:
      'I can help with navigation, FAQs, or logout. Tell me which page you need.',
    navigatePrompt: 'I can take you to {label}. Want me to navigate?',
    logoutPrompt: 'Do you want to log out now?',
    canceled: 'Got it. I will cancel that.',
    navigated: 'All set. Navigated to {label}.',
    loggedOut: 'You are signed out.',
    languageSet: 'Okay, I will reply in {language}.',
  },
  hi: {
    greeting:
      'Namaste! Main navigation, FAQs, aur logout me madad kar sakta hoon.',
    help: 'Aise poochho: "Expense details par jao" ya "Dashboard khol do".',
    unknown:
      'Main navigation, FAQs, aur logout me madad kar sakta hoon. Kis page par jana hai?',
    navigatePrompt: 'Main aapko {label} par le ja sakta hoon. Navigate karu?',
    logoutPrompt: 'Kya aap logout karna chahte ho?',
    canceled: 'Theek hai, maine cancel kar diya.',
    navigated: 'Ho gaya. {label} par le gaya.',
    loggedOut: 'Aap logout ho gaye.',
    languageSet: 'Theek hai, main {language} me reply karunga.',
  },
  es: {
    greeting:
      'Hola! Puedo ayudarte a navegar, responder FAQs o cerrar sesion.',
    help: 'Prueba: "Abrir detalles de gastos" o "Ir al panel".',
    unknown:
      'Puedo ayudar con navegacion, FAQs o cerrar sesion. Que pagina necesitas?',
    navigatePrompt: 'Puedo llevarte a {label}. Quieres navegar?',
    logoutPrompt: 'Quieres cerrar sesion ahora?',
    canceled: 'De acuerdo, cancelado.',
    navigated: 'Listo. Navegado a {label}.',
    loggedOut: 'Sesion cerrada.',
    languageSet: 'Vale, respondere en {language}.',
  },
};
