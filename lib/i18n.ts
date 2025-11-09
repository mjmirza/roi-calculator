/**
 * i18n Translation Utilities
 * Provides type-safe translation functions and language management
 */

// Language codes matching our translation files
export type LanguageCode = 'en' | 'es' | 'pt' | 'de' | 'fr' | 'zh' | 'ja' | 'ar' | 'hi' | 'ru';

// Language metadata with flag emojis and RTL support
export interface LanguageMetadata {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  isRTL: boolean;
}

// All supported languages
export const SUPPORTED_LANGUAGES: Record<LanguageCode, LanguageMetadata> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    isRTL: false,
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    isRTL: false,
  },
  pt: {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    isRTL: false,
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    isRTL: false,
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    isRTL: false,
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    isRTL: false,
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    isRTL: false,
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    isRTL: true,
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    isRTL: false,
  },
  ru: {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    isRTL: false,
  },
};

// Default language
export const DEFAULT_LANGUAGE: LanguageCode = 'en';

// LocalStorage key for language preference
export const LANGUAGE_STORAGE_KEY = 'roi-calculator-language';

/**
 * Get language from localStorage
 */
export const getStoredLanguage = (): LanguageCode | null => {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && isValidLanguageCode(stored)) {
      return stored as LanguageCode;
    }
  } catch (error) {
    console.error('Error reading language from localStorage:', error);
  }

  return null;
};

/**
 * Save language to localStorage
 */
export const setStoredLanguage = (language: LanguageCode): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    console.error('Error saving language to localStorage:', error);
  }
};

/**
 * Check if a string is a valid language code
 */
export const isValidLanguageCode = (code: string): code is LanguageCode => {
  return code in SUPPORTED_LANGUAGES;
};

/**
 * Get browser's preferred language (if supported)
 */
export const getBrowserLanguage = (): LanguageCode => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  try {
    const browserLang = navigator.language.split('-')[0];
    if (isValidLanguageCode(browserLang)) {
      return browserLang as LanguageCode;
    }
  } catch (error) {
    console.error('Error detecting browser language:', error);
  }

  return DEFAULT_LANGUAGE;
};

/**
 * Nested object type for translations
 */
export type TranslationObject = {
  [key: string]: string | TranslationObject;
};

/**
 * Translation data structure
 */
export type TranslationData = {
  [K in LanguageCode]?: TranslationObject;
};

/**
 * Load translation file for a specific language
 */
export const loadTranslation = async (language: LanguageCode): Promise<TranslationObject> => {
  try {
    const response = await fetch(`/translations/${language}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load translation: ${response.statusText}`);
    }
    const data = await response.json();
    return data[language] || {};
  } catch (error) {
    console.error(`Error loading translation for ${language}:`, error);
    // Fallback to English if available
    if (language !== DEFAULT_LANGUAGE) {
      return loadTranslation(DEFAULT_LANGUAGE);
    }
    return {};
  }
};

/**
 * Get nested translation value by key path
 * @param obj - Translation object
 * @param path - Dot-separated path (e.g., "header.title")
 * @returns Translation string or undefined
 */
export const getNestedValue = (obj: TranslationObject, path: string): string | undefined => {
  const keys = path.split('.');
  let current: any = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }

  return typeof current === 'string' ? current : undefined;
};

/**
 * Translation function type
 */
export type TranslateFunction = (key: string, fallback?: string) => string;

/**
 * Create a translation function for a specific language
 */
export const createTranslateFunction = (
  translations: TranslationObject,
  fallbackTranslations?: TranslationObject
): TranslateFunction => {
  return (key: string, fallback?: string): string => {
    // Try to get from current language
    const value = getNestedValue(translations, key);
    if (value !== undefined) {
      return value;
    }

    // Try fallback translations (usually English)
    if (fallbackTranslations) {
      const fallbackValue = getNestedValue(fallbackTranslations, key);
      if (fallbackValue !== undefined) {
        return fallbackValue;
      }
    }

    // Return provided fallback or key itself
    return fallback || key;
  };
};

/**
 * Apply RTL styles based on language
 */
export const applyRTLStyles = (isRTL: boolean): void => {
  if (typeof document === 'undefined') return;

  const htmlElement = document.documentElement;

  if (isRTL) {
    htmlElement.setAttribute('dir', 'rtl');
    htmlElement.style.direction = 'rtl';
  } else {
    htmlElement.setAttribute('dir', 'ltr');
    htmlElement.style.direction = 'ltr';
  }
};
