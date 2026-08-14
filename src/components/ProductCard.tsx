'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Check, Sparkles, ArrowRight, Clock, Zap, ShieldCheck } from 'lucide-react';
import { formatETB } from '@/lib/utils';

export interface ProductItem {
  id: string;
  slug: string;
  nameEn: string;
  nameAm: string;
  descEn: string;
  descAm: string;
  duration: string;
  durationAm: string;
  priceETB: number;
  badge?: string | null;
  featuresEn: string; // JSON string array
  featuresAm: string; // JSON string array
  isActive: boolean;
  isPrimary?: boolean;
}

export default function ProductCard({
  product,
  isFeatured = false,
}: {
  product: ProductItem;
  isFeatured?: boolean;
}) {
  const { t, isAmharic } = useLanguage();

  const title = isAmharic ? product.nameAm : product.nameEn;
  const desc = isAmharic ? product.descAm : product.descEn;
  const duration = isAmharic ? product.durationAm : product.duration;

  let features: string[] = [];
  try {
    const raw = isAmharic ? product.featuresAm : product.featuresEn;
    features = typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch (e) {
    features = [
      isAmharic ? 'የ Gemini AI ሙሉ አጠቃቀም' : 'Gemini AI access',
      isAmharic ? 'የአክቲቬሽን ሊንክ ማድረሻ' : 'Activation link delivery',
      isAmharic ? 'የቴሌግራም ማድረሻ' : 'Telegram delivery',
      isAmharic ? 'የደንበኞች ድጋፍ' : 'Customer support',
      isAmharic ? 'ቀላል የኢትዮጵያ ብር ክፍያ' : 'Simple ETB payment',
    ];
  }

  const isSpecial = isFeatured || product.isPrimary || product.badge?.toLowerCase().includes('deal');

  return (
    <div
      className={`relative flex flex-col justify-between bg-white rounded-3xl transition-all duration-300 ${
        isSpecial
          ? 'p-8 sm:p-10 border-2 border-google-blue shadow-google-lg ring-8 ring-blue-50/70 hover:shadow-2xl'
          : 'p-7 sm:p-8 border border-gray-200 shadow-google-sm hover:shadow-google-md hover:-translate-y-0.5'
      }`}
    >
      {/* Top Floating Badge */}
      {product.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
          <span
            className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5 ${
              isSpecial
                ? 'bg-gradient-to-r from-google-blue via-indigo-600 to-google-blue text-white shadow-google-sm'
                : 'bg-gradient-to-r from-google-green to-emerald-600 text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{product.badge}</span>
          </span>
        </div>
      )}

      {/* Plan Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className={`font-bold text-gray-900 tracking-tight ${isSpecial ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
            {title}
          </h3>
          <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 bg-blue-50 text-google-blue rounded-full border border-blue-100">
            <Clock className="w-3.5 h-3.5" />
            {duration}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed min-h-[38px]">{desc}</p>

        {/* Price display in ETB */}
        <div className="py-4 border-y border-gray-100 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className={`font-display font-black text-gray-900 tracking-tight font-mono ${isSpecial ? 'text-4xl sm:text-5xl text-google-blue' : 'text-3xl sm:text-4xl'}`}>
              {formatETB(product.priceETB)}
            </span>
          </div>
          <span className="text-xs text-gray-400 font-medium">Telebirr ETB</span>
        </div>

        {/* Features List */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
            {t.products.featuresTitle}
          </span>
          <ul className="space-y-2.5">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                <div className="w-4 h-4 rounded-full bg-green-50 text-google-green flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span className="leading-snug">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Buy Button */}
      <div className="pt-8 mt-6 border-t border-gray-100">
        <Link
          href={`/checkout?plan=${product.id}`}
          className={`w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-sm sm:text-base transition-all duration-200 shadow-sm ${
            isSpecial
              ? 'bg-google-blue hover:bg-google-blue-hover text-white shadow-google-md hover:shadow-google-lg hover:scale-[1.02]'
              : 'bg-gray-900 hover:bg-black text-white hover:shadow-md'
          }`}
        >
          <span>{t.products.buyNow}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
