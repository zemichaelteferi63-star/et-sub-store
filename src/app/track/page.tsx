'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingSupport from '@/components/FloatingSupport';
import { useLanguage } from '@/context/LanguageContext';
import { Search, ArrowRight, ShieldCheck, AlertCircle, MessageCircle, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function TrackPage() {
  const { t, isAmharic } = useLanguage();
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const clean = query.trim().toUpperCase();
    if (!clean) {
      setError(isAmharic ? 'እባክዎ የትራኪንግ ኮድዎን ያስገቡ' : 'Please enter your tracking code');
      return;
    }

    setLoading(true);

    try {
      // Lookup order by tracking code or order number
      const res = await fetch(`/api/orders/lookup?code=${encodeURIComponent(clean)}`);
      const data = await res.json();

      if (res.ok && data.orderNumber) {
        // Redirect to customer order page with token if available
        const url = data.accessToken
          ? `/orders/${data.orderNumber}?token=${data.accessToken}`
          : `/orders/${data.orderNumber}`;
        window.location.href = url;
      } else {
        setError(
          data.error ||
            (isAmharic
              ? 'በዚህ ትራኪንግ ኮድ የተመዘገበ ትዕዛዝ አልተገኘም። እባክዎ ኮዱን አረጋግጠው ይሞክሩ ወይም @Et_substore_support ን ያነጋግሩ።'
              : 'No order found with this tracking code. Please double check and try again, or contact @Et_substore_support.')
        );
        setLoading(false);
      }
    } catch (err) {
      // Fallback direct navigate
      window.location.href = `/orders/${clean}`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 py-12 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-google-blue flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              {t.track.title}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {t.track.subtitle}
            </p>
          </div>

          {/* Search Form Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-google-lg border border-gray-100 space-y-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                  {isAmharic ? 'የትራኪንግ ኮድ ወይም የትዕዛዝ ቁጥር' : 'Tracking Code / Order Number'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder={t.track.inputPlaceholder}
                    className="w-full px-4 py-3.5 text-base font-mono uppercase border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-google-blue bg-gray-50/50"
                    disabled={loading}
                    autoFocus
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <span className="text-xs text-gray-400 font-mono">ETS-XXXXXX</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 text-base font-bold text-white bg-google-blue hover:bg-google-blue-hover rounded-2xl shadow-google-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? t.track.searching : t.track.button}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            {/* Reassurance notes */}
            <div className="pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-2">
              <div className="flex items-center gap-2 text-green-700 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {isAmharic
                    ? 'ሁሉም ትዕዛዞች በዳታቤዝ ውስጥ በቋሚነት ተቀምጠዋል'
                    : 'All orders are permanently saved and recoverable'}
                </span>
              </div>
              <p>
                {isAmharic
                  ? 'ገጹን ሪፍሬሽ ቢያደርጉት ወይም ቢዘጉትም እንኳ በትራኪንግ ኮድዎ በማንኛውም ጊዜ ሁኔታውን ማየት ይችላሉ።'
                  : 'Even if you refreshed or closed your browser after placing an order, entering your tracking code retrieves your status instantly.'}
              </p>
            </div>
          </div>

          {/* Help Callout */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 text-center text-xs text-gray-600 space-y-2">
            <p className="font-semibold text-gray-800 flex items-center justify-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-gray-400" />
              <span>{t.track.needHelp}</span>
            </p>
            <a
              href="https://t.me/Et_substore_support"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-google-blue hover:underline font-mono text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>@Et_substore_support</span>
            </a>
          </div>

        </div>
      </main>

      <Footer />
      <FloatingSupport />
    </div>
  );
}
