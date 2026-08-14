import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import CustomRequestSection from '@/components/CustomRequestSection';
import Footer from '@/components/Footer';
import FloatingSupport from '@/components/FloatingSupport';
import ProductCard from '@/components/ProductCard';
import prisma from '@/lib/prisma';
import { getSettings } from '@/lib/settings';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShoppingBag } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [productsList, settings] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
    getSettings(),
  ]);

  // Primary Gemini Product (18 Months)
  const primaryGemini = productsList.find((p) => p.isPrimary || p.slug.includes('18m')) || productsList[0];
  
  // Secondary "More From Us" Products
  const secondaryProducts = productsList.filter((p) => p.id !== primaryGemini?.id);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Main Product: Gemini AI Pro (Primary Focus) */}
        <section id="gemini-pro" className="py-16 sm:py-24 bg-gradient-to-b from-white via-blue-50/30 to-white scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-google-blue text-xs font-bold border border-blue-100">
                <Sparkles className="w-3.5 h-3.5" />
                <span>PRIMARY STORE OFFER</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                Gemini AI Pro — 18 Months Access
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Get full access to Google Gemini 1.5 Pro, 2 Million token context window, and Workspace AI integration for only 350 ETB.
              </p>
            </div>

            {/* Prominent Single Card for Gemini AI Pro */}
            {primaryGemini && (
              <div className="max-w-xl mx-auto">
                <ProductCard product={primaryGemini} isFeatured={true} />
              </div>
            )}
          </div>
        </section>

        {/* 3. Secondary Section: More From Us Preview */}
        <section className="py-16 sm:py-20 bg-gray-50/60 border-t border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>MORE DIGITAL SUBSCRIPTIONS</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  More From Us
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Premium AI, developer tools, and creative subscriptions available with Telebirr in Ethiopia.
                </p>
              </div>

              <Link
                href="/more-products"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-google-blue bg-white hover:bg-blue-50 border border-blue-200 rounded-xl shadow-xs transition-colors"
              >
                <span>View All Subscriptions</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Grid of Secondary Products */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {secondaryProducts.map((product) => (
                <ProductCard key={product.id} product={product} isFeatured={false} />
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/more-products"
                className="inline-flex items-center gap-2 text-sm font-semibold text-google-blue hover:underline"
              >
                <span>Browse dedicated More From Us page</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 4. How It Works */}
        <HowItWorks />

        {/* 5. Custom Request Section */}
        <CustomRequestSection
          titleEn={settings.customRequestTitleEn}
          titleAm={settings.customRequestTitleAm}
          descEn={settings.customRequestDescEn}
          descAm={settings.customRequestDescAm}
          buttonEn={settings.customRequestButtonEn}
          buttonAm={settings.customRequestButtonAm}
          telegramUsername={settings.supportTelegram}
        />
      </main>

      <Footer
        supportPhone={settings.supportPhone}
        supportTelegram={settings.supportTelegram}
      />

      <FloatingSupport supportTelegram={settings.supportTelegram} />
    </div>
  );
}
