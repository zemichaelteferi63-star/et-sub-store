'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { MessageCircle } from 'lucide-react';

export default function FloatingSupport({ supportTelegram = 'Et_substore_support' }: { supportTelegram?: string }) {
  const { t } = useLanguage();
  const cleanHandle = supportTelegram.replace('@', '');

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <a
        href={`https://t.me/${cleanHandle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 bg-gradient-to-r from-google-blue to-google-blue-hover text-white px-4 py-3 rounded-full shadow-google-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
        aria-label="Telegram Customer Support"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 fill-white/20" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-google-green border-2 border-white rounded-full animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-google-green border-2 border-white rounded-full"></span>
        </div>
        <div className="flex flex-col items-start pr-1">
          <span className="text-xs font-bold leading-tight tracking-tight">
            {t.floatingSupport.needHelp}
          </span>
          <span className="text-[10px] text-blue-100 font-normal leading-none font-mono">
            @{cleanHandle}
          </span>
        </div>
      </a>
    </div>
  );
}
