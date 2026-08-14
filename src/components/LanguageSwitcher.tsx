'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`inline-flex items-center rounded-full p-1 bg-gray-100 border border-gray-200 shadow-inner ${className}`}>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
          language === 'en'
            ? 'bg-white text-google-blue shadow-sm font-bold'
            : 'text-gray-600 hover:text-gray-900'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <span className="text-gray-300 px-0.5 text-xs select-none">|</span>
      <button
        type="button"
        onClick={() => setLanguage('am')}
        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
          language === 'am'
            ? 'bg-white text-google-blue shadow-sm font-bold'
            : 'text-gray-600 hover:text-gray-900'
        }`}
        aria-label="Switch to Amharic"
      >
        አማ
      </button>
    </div>
  );
}
