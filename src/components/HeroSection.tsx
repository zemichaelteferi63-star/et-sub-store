'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Sparkles, ArrowRight, ShieldCheck, Zap, MessageCircle, CheckCircle, Bot, ShoppingBag } from 'lucide-react';

export default function HeroSection() {
  const { t, isAmharic } = useLanguage();

  const handleScrollToGemini = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('gemini-pro');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background Subtle Google Gradient Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none -z-10 overflow-hidden opacity-60">
        <div className="absolute top-[-100px] left-[15%] w-[350px] h-[350px] rounded-full bg-blue-100/60 blur-3xl"></div>
        <div className="absolute top-[-50px] right-[20%] w-[300px] h-[300px] rounded-full bg-emerald-100/50 blur-3xl"></div>
        <div className="absolute top-[100px] left-[45%] w-[250px] h-[250px] rounded-full bg-yellow-100/50 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-google-blue-light via-google-green-light to-google-yellow-light border border-blue-100 text-xs font-semibold text-google-dark shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-google-blue" />
              <span>{t.hero.badge}</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 leading-[1.15]">
              {t.hero.titleLine1}{' '}
              <span className="bg-gradient-to-r from-google-blue via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {t.hero.titleLine2}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {t.hero.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#gemini-pro"
                onClick={handleScrollToGemini}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-bold text-white bg-google-blue hover:bg-google-blue-hover rounded-2xl shadow-google-md hover:shadow-google-lg transition-all duration-200 group cursor-pointer"
              >
                <span>{t.hero.ctaBuy}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <Link
                href="/more-products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-semibold text-gray-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-2xl shadow-xs transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-google-blue" />
                <span>{t.hero.ctaMore}</span>
              </Link>
            </div>

            {/* Value Props & Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-gray-100 text-xs text-gray-600">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <span>{t.hero.instantDelivery}</span>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-google-blue shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>{t.hero.securePayment}</span>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-2">
                <div className="w-7 h-7 rounded-lg bg-yellow-50 flex items-center justify-center text-amber-600 shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span>{t.hero.ethiopianSupport}</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-google-lg border border-gray-100 space-y-6">
              
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm">
                    <Bot className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">Gemini AI Pro</h3>
                    <span className="text-xs text-google-blue font-bold">18 Months Full Access</span>
                  </div>
                </div>
                <span className="px-3 py-1 text-xs font-black text-white bg-gradient-to-r from-google-green to-emerald-600 rounded-full shadow-xs">
                  350 ETB
                </span>
              </div>

              {/* Simulated UI Feature Preview */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-3 border border-gray-100 text-xs">
                <div className="flex items-center justify-between text-gray-500">
                  <span>Context Window:</span>
                  <span className="font-bold text-gray-800">2,000,000 Tokens</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-google-blue via-google-green to-google-yellow h-full w-full rounded-full"></div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-500">
                  <span>Google One / Gemini 1.5 Pro</span>
                  <span className="text-green-600 font-semibold">18 Months Included ✓</span>
                </div>
              </div>

              {/* Telebirr Fast Activation Snippet */}
              <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[11px] text-gray-500 uppercase tracking-wider block">
                    {isAmharic ? 'የመክፈያ ዘዴ' : 'Payment Method'}
                  </span>
                  <span className="font-bold text-gray-900 text-sm">Telebirr (350 ETB)</span>
                </div>
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-white border border-gray-200 flex items-center justify-center shadow-xs shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="/telebirr-logo.jpg" 
                    alt="Telebirr Logo" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.ctfassets.net/r8cm1n1mpqev/2yHoEHDIDuF1BLzXVqo1Uz/e6a1c5a0c8599da014d51e8b0ab48167/photo_2021-05-10_22-48-53-telebirr_icon.jpg?w=800&q=50';
                    }}
                  />
                </div>
              </div>

              {/* Delivery Guarantee */}
              <div className="flex items-center gap-2 text-xs text-gray-500 pt-1">
                <CheckCircle className="w-4 h-4 text-google-green shrink-0" />
                <span>{t.products.instantActivationNotice}</span>
              </div>
            </div>

            {/* Decorative Floating Pill */}
            <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-sm border border-gray-200 px-4 py-2.5 rounded-2xl shadow-google-md hidden sm:flex items-center gap-2.5 animate-bounce">
              <span className="w-2.5 h-2.5 rounded-full bg-google-green animate-pulse"></span>
              <span className="text-xs font-bold text-gray-800">
                {isAmharic ? 'በ 350 ብር ብቻ ለ 18 ወራት' : 'Only 350 ETB for 18 Months'}
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
