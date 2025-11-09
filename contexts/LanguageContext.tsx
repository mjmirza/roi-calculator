"use client"

/**
 * Language Context Provider
 * Manages language state and provides translation functionality across the app
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  LanguageCode,
  TranslationObject,
  TranslateFunction,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  getStoredLanguage,
  setStoredLanguage,
  getBrowserLanguage,
  loadTranslation,
  createTranslateFunction,
  applyRTLStyles,
} from '@/lib/i18n';

/**
 * Language Context value type
 */
interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: TranslateFunction;
  isLoading: boolean;
  isRTL: boolean;
}

/**
 * Create the context with undefined default
 */
const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

/**
 * Language Provider Props
 */
interface LanguageProviderProps {
  children: React.ReactNode;
}

/**
 * Language Provider Component
 */
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [translations, setTranslations] = useState<TranslationObject>({});
  const [fallbackTranslations, setFallbackTranslations] = useState<TranslationObject>({});
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Initialize language on mount
   */
  useEffect(() => {
    const initializeLanguage = async () => {
      setIsLoading(true);

      // Determine initial language: stored > browser > default
      const storedLang = getStoredLanguage();
      const initialLang = storedLang || getBrowserLanguage();

      // Load English as fallback
      const englishTranslations = await loadTranslation('en');
      setFallbackTranslations(englishTranslations);

      // Load initial language translations
      if (initialLang !== 'en') {
        const langTranslations = await loadTranslation(initialLang);
        setTranslations(langTranslations);
      } else {
        setTranslations(englishTranslations);
      }

      setLanguageState(initialLang);
      applyRTLStyles(SUPPORTED_LANGUAGES[initialLang].isRTL);
      setIsLoading(false);
    };

    initializeLanguage();
  }, []);

  /**
   * Change language
   */
  const setLanguage = useCallback(async (newLanguage: LanguageCode) => {
    if (newLanguage === language) return;

    setIsLoading(true);

    try {
      // Load new language translations
      const newTranslations = await loadTranslation(newLanguage);
      setTranslations(newTranslations);
      setLanguageState(newLanguage);

      // Save to localStorage
      setStoredLanguage(newLanguage);

      // Apply RTL if needed
      applyRTLStyles(SUPPORTED_LANGUAGES[newLanguage].isRTL);
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  /**
   * Create memoized translation function
   */
  const t = useMemo<TranslateFunction>(
    () => createTranslateFunction(translations, fallbackTranslations),
    [translations, fallbackTranslations]
  );

  /**
   * Check if current language is RTL
   */
  const isRTL = useMemo(
    () => SUPPORTED_LANGUAGES[language].isRTL,
    [language]
  );

  /**
   * Context value
   */
  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t,
      isLoading,
      isRTL,
    }),
    [language, setLanguage, t, isLoading, isRTL]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Custom hook to use language context
 */
export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
};

/**
 * Custom hook for translation only (convenience hook)
 */
export const useTranslation = (): TranslateFunction => {
  const { t } = useLanguage();
  return t;
};
