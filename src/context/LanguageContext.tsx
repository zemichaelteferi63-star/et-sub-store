'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Dictionary, getDictionary } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Dictionary;
  isAmharic: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ethio_gemini_lang') as Language;
      if (saved && (saved === 'en' || saved === 'am')) {
        setLanguageState(saved);
      }
    } catch (e) {
      // ignore
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('ethio_gemini_lang', lang);
      document.cookie = `ethio_gemini_lang=${lang}; path=/; max-age=31536000`;
    } catch (e) {
      // ignore
    }
  };

  const t = getDictionary(language);
  const isAmharic = language === 'am';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isAmharic }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
