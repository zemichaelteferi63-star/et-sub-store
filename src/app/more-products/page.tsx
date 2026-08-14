import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingSupport from '@/components/FloatingSupport';
import ProductCard from '@/components/ProductCard';
import prisma from '@/lib/prisma';
import { getSettings } from '@/lib/settings';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'More From Us — ET-Sub Store Digital Subscriptions Ethiopia',
  description:
    'Browse our complete catalog of digital subscriptions in Ethiopia: Telegram Stars, Cursor Pro, Supabase Pro, Claude Pro, CapCut, and Google AI Pro with Telebirr payments.',
};

export default async function MoreProductsPage() {
  const [productsList, settings] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
    getSettings(),
  ]);

  // Secondary products (all except primary Gemini 18M, or all active catalog products)
  const secondaryProducts = productsList.filter((p) => !p.isPrimary && !p.slug.includes('18m'));
  const primaryGemini = productsList.find((p) => p.isPrimary || p.slug.includes('18m'));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header Banner */}
          <div className="space-y-4 text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-google-blue transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Home</span>
              </Link>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>MORE FROM US</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
              Premium Digital Subscriptions
            </h1>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Explore our full range of curated AI tools, developer platforms, creative suites, and Telegram services. All payable in Ethiopian Birr (ETB) with fast Telebirr verification.
            </p>
          </div>

          {/* Primary Gemini Banner Callout */}
          {primaryGemini && (
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-6 sm:p-8 border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
              <div className="space-y-2 text-center md:text-left">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-google-blue text-white text-[11px] font-bold">
                  <Sparkles className="w-3 h-3" />
                  FLAGSHIP OFFER
                </span>
                <h3 className="font-bold text-xl sm:text-2xl text-gray-900">
                  Looking for our main Gemini AI Pro deal?
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Get full Google Gemini 1.5 Pro access with 2 Million token context for 18 Months for only 350 ETB.
                </p>
              </div>

              <Link
                href="/#gemini-pro"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-google-blue hover:bg-google-blue-hover rounded-xl shadow-google-sm transition-colors shrink-0"
              >
                <span>View Gemini Pro (350 ETB)</span>
                <Sparkles className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Products Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                <span>Available Subscriptions</span>
                <span className="text-xs font-normal text-gray-400">({secondaryProducts.length} items)</span>
              </h2>
              <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Telebirr Payment Supported
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {secondaryProducts.map((product) => (
                <ProductCard key={product.id} product={product} isFeatured={false} />
              ))}
            </div>
          </div>

          {/* Bottom Help Section */}
          <div className="bg-gray-50 rounded-2xl p-6 text-center text-xs text-gray-600 border border-gray-200/80 space-y-2">
            <p className="font-semibold text-gray-900">Need a subscription not listed on this page?</p>
            <p>We provide custom activations for any AI, developer, or design platform on request.</p>
            <a
              href={`https://t.me/${settings.supportTelegram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 font-bold text-google-blue hover:underline"
            >
              Contact @{settings.supportTelegram.replace('@', '')} on Telegram →
            </a>
          </div>

        </div>
      </main>

      <Footer
        supportPhone={settings.supportPhone}
        supportTelegram={settings.supportTelegram}
      />

      <FloatingSupport supportTelegram={settings.supportTelegram} />
    </div>
  );
}
