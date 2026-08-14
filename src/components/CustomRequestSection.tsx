'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { MessageCircle, Sparkles, Clock, CheckCircle } from 'lucide-react';

interface CustomRequestSectionProps {
  titleEn?: string;
  titleAm?: string;
  descEn?: string;
  descAm?: string;
  buttonEn?: string;
  buttonAm?: string;
  supportTelegram?: string;
  telegramUsername?: string;
}

export default function CustomRequestSection({
  titleEn,
  titleAm,
  descEn,
  descAm,
  buttonEn,
  buttonAm,
  supportTelegram,
  telegramUsername = 'Et_substore_support',
}: CustomRequestSectionProps) {
  const { t, isAmharic } = useLanguage();

  const handle = supportTelegram || telegramUsername || 'Et_substore_support';
  const title = (isAmharic ? titleAm : titleEn) || t.customRequest.title;
  const desc = (isAmharic ? descAm : descEn) || t.customRequest.description;
  const button = (isAmharic ? buttonAm : buttonEn) || t.customRequest.button;
  const cleanHandle = handle.replace('@', '');

  return (
    <section id="custom-request" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 via-slate-900 to-gray-950 text-white p-8 sm:p-12 lg:p-14 shadow-google-lg">
          
          {/* Subtle Google accent glow in background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-google-blue/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-google-green/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-200 backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-google-yellow" />
                <span>ChatGPT Plus • Claude 3.5 Pro • Midjourney • Cursor • Canva</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-snug">
                {title}
              </h2>

              <p className="text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed">
                {desc}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-google-green" />
                  {t.customRequest.fastResponse}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-google-blue" />
                  {isAmharic ? 'በቴሌብር የሚከፈል' : 'Pay in ETB with Telebirr'}
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <a
                href={`https://t.me/${cleanHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-google-blue hover:bg-google-blue-hover text-white text-base font-bold rounded-2xl shadow-google-md hover:scale-105 transition-all duration-200"
              >
                <MessageCircle className="w-5 h-5 fill-white/20" />
                <span>{button}</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
