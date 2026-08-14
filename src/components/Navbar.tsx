'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { Sparkles, Menu, X, ShieldCheck, Search, ShoppingBag } from 'lucide-react';

export default function Navbar() {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [trackOrderOpen, setTrackOrderOpen] = useState(false);
  const [trackOrderInput, setTrackOrderInput] = useState('');

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackOrderInput.trim()) return;
    const cleanId = trackOrderInput.trim().toUpperCase();
    window.location.href = `/orders/${cleanId}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-google-blue via-google-green to-google-yellow flex items-center justify-center p-0.5 shadow-sm group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-google-blue fill-google-blue/20" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-xl tracking-tight text-gray-900 flex items-center gap-1">
                ET-Sub <span className="text-google-blue">Store</span>
                <span className="inline-block w-2 h-2 rounded-full bg-google-red"></span>
              </span>
              <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest -mt-1">
                Digital Subscriptions Ethiopia
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-google-blue transition-colors">
              {t.nav.home}
            </Link>
            <Link href="/#gemini-pro" className="hover:text-google-blue transition-colors">
              {t.nav.geminiPro}
            </Link>
            <Link
              href="/more-products"
              className="inline-flex items-center gap-1 text-google-blue font-semibold hover:text-google-blue-hover transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{t.nav.moreFromUs}</span>
            </Link>
            <Link href="/#how-it-works" className="hover:text-google-blue transition-colors">
              {t.nav.howItWorks}
            </Link>
            <Link href="/track" className="hover:text-google-blue transition-colors">
              {t.nav.orderTracking}
            </Link>
          </nav>

          {/* Actions: Track Order, Language Switcher & Admin */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Track Order Button */}
            <button
              onClick={() => setTrackOrderOpen(!trackOrderOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
              title="Track existing order"
            >
              <Search className="w-3.5 h-3.5 text-gray-500" />
              <span>{t.nav.orderTracking}</span>
            </button>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Admin Portal link */}
            <Link
              href="/admin"
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
              title="Admin Portal"
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button & Lang Switcher */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Track Order Input Dropdown */}
        {trackOrderOpen && (
          <div className="hidden md:block py-3 border-t border-gray-100 bg-gray-50/80 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 animate-slide-up">
            <form onSubmit={handleTrackOrder} className="max-w-md mx-auto flex items-center gap-2">
              <input
                type="text"
                value={trackOrderInput}
                onChange={(e) => setTrackOrderInput(e.target.value)}
                placeholder="Enter Tracking Code (e.g. ETS-8F42K9)"
                className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-google-blue"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-google-blue hover:bg-google-blue-hover rounded-lg transition-colors"
              >
                Track
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-slide-up">
          {/* Quick Track Mobile */}
          <form onSubmit={handleTrackOrder} className="flex items-center gap-2 pt-1 pb-2">
            <input
              type="text"
              value={trackOrderInput}
              onChange={(e) => setTrackOrderInput(e.target.value)}
              placeholder="Tracking Code (ETS-...)"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue"
            />
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-google-blue rounded-lg"
            >
              Track
            </button>
          </form>

          <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              {t.nav.home}
            </Link>
            <Link
              href="/#gemini-pro"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              {t.nav.geminiPro}
            </Link>
            <Link
              href="/more-products"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-bold text-google-blue hover:bg-blue-50 rounded-lg flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t.nav.moreFromUs}</span>
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              {t.nav.howItWorks}
            </Link>
            <Link
              href="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              {t.nav.orderTracking}
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-lg flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-gray-400" />
              <span>{t.nav.adminLogin}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
