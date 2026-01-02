'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { locales, type Locale, defaultLocale } from '@/i18n/config';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

function detectBrowserLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale;

  const browserLang = navigator.language.split('-')[0].toLowerCase();
  
  // Check if browser language matches one of our supported locales
  if (locales.includes(browserLang as Locale)) {
    return browserLang as Locale;
  }
  
  return defaultLocale;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Detect browser locale on mount
    const detectedLocale = detectBrowserLocale();
    const storedLocale = localStorage.getItem('locale') as Locale | null;
    
    const initialLocale = storedLocale && locales.includes(storedLocale)
      ? storedLocale
      : detectedLocale;
    
    setLocaleState(initialLocale);
    setIsInitialized(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  // Always provide the context, even during initialization
  // Use defaultLocale as fallback until initialization completes
  const contextValue: LocaleContextType = {
    locale: isInitialized ? locale : defaultLocale,
    setLocale,
  };

  return (
    <LocaleContext.Provider value={contextValue}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
