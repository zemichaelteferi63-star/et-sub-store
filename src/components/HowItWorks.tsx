'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { MousePointerClick, Smartphone, CheckCircle2, KeyRound } from 'lucide-react';

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      number: '01',
      icon: <MousePointerClick className="w-6 h-6 text-google-blue" />,
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      title: t.howItWorks.step1Title,
      desc: t.howItWorks.step1Desc,
    },
    {
      number: '02',
      icon: <Smartphone className="w-6 h-6 text-telebirr" />,
      bg: 'bg-sky-50',
      border: 'border-sky-100',
      title: t.howItWorks.step2Title,
      desc: t.howItWorks.step2Desc,
    },
    {
      number: '03',
      icon: <CheckCircle2 className="w-6 h-6 text-google-green" />,
      bg: 'bg-green-50',
      border: 'border-green-100',
      title: t.howItWorks.step3Title,
      desc: t.howItWorks.step3Desc,
    },
    {
      number: '04',
      icon: <KeyRound className="w-6 h-6 text-amber-500" />,
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      title: t.howItWorks.step4Title,
      desc: t.howItWorks.step4Desc,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50/70 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {t.howItWorks.sectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            {t.howItWorks.sectionSubtitle}
          </p>
        </div>

        {/* 4 Step Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-google-sm hover:shadow-google-md transition-all duration-200 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl ${step.bg} border ${step.border} flex items-center justify-center`}>
                    {step.icon}
                  </div>
                  <span className="font-display font-black text-2xl text-gray-200 select-none">
                    {step.number}
                  </span>
                </div>

                <h3 className="font-bold text-base text-gray-900 leading-snug">
                  {step.title}
                </h3>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
