'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TelebirrPaymentGuide from '@/components/TelebirrPaymentGuide';
import Toast from '@/components/Toast';
import { useLanguage } from '@/context/LanguageContext';
import { formatETB } from '@/lib/utils';
import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  User,
  Phone,
  MessageCircle,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

function CheckoutContent() {
  const { t, isAmharic, language } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  const planIdFromUrl = searchParams.get('plan');

  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerTelegram, setCustomerTelegram] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Load products & settings
  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, settRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/settings'),
        ]);

        const prodData = await prodRes.json();
        const settData = await settRes.json();

        setProducts(prodData.products || []);
        setSettings(settData.settings || null);

        if (prodData.products?.length > 0) {
          const match = prodData.products.find(
            (p: any) => p.id === planIdFromUrl || p.slug === planIdFromUrl
          );
          setSelectedProductId(match ? match.id : prodData.products[0].id);
        }
      } catch (err) {
        console.error('Checkout data load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [planIdFromUrl]);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      setToast({ message: t.checkout.errors.nameRequired, type: 'error' });
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 9) {
      setToast({ message: t.checkout.errors.phoneRequired, type: 'error' });
      return;
    }
    if (!transactionId.trim() || transactionId.trim().length < 4) {
      setToast({ message: t.checkout.errors.transactionRequired, type: 'error' });
      return;
    }

    // Normalize telegram username if provided
    let normalizedTelegram: string | null = null;
    if (customerTelegram.trim()) {
      const clean = customerTelegram.trim().replace(/^@/, '');
      if (clean.length > 0) {
        normalizedTelegram = clean;
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerTelegram: normalizedTelegram,
          productId: selectedProductId,
          transactionId: transactionId.trim().toUpperCase(),
          language,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit order');

      router.push(data.redirectUrl || `/orders/${data.orderNumber}?token=${data.accessToken}`);
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-google-blue border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-gray-500">Loading checkout...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      {/* Back Link */}
      <Link
        href="/#subscriptions"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-google-blue mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t.checkout.backToHome}</span>
      </Link>

      {/* Header */}
      <div className="mb-10 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-google-blue text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Telebirr Instant Checkout</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          {t.checkout.title}
        </h1>
        <p className="text-sm text-gray-600">{t.checkout.subtitle}</p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col: Customer Details & Telebirr Submission */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Plan Selector if multiple */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-google-sm space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
              1. {t.checkout.selectedPlan}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {products.map((prod) => {
                const isSelected = prod.id === selectedProductId;
                return (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => setSelectedProductId(prod.id)}
                    className={`text-left p-3.5 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-google-blue bg-blue-50/60 shadow-xs ring-2 ring-blue-100'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-gray-900 truncate">
                        {isAmharic ? prod.nameAm : prod.nameEn}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-google-blue shrink-0" />}
                    </div>
                    <div className="flex items-baseline justify-between text-xs text-gray-500">
                      <span>{isAmharic ? prod.durationAm : prod.duration}</span>
                      <span className="font-display font-black text-sm text-google-blue">
                        {formatETB(prod.priceETB)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Customer Information Inputs */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-google-sm space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
              2. {t.checkout.customerInfo}
            </span>

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-gray-400" />
                <span>{t.checkout.fullName} *</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={t.checkout.fullNamePlaceholder}
                required
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-google-blue focus:border-google-blue transition-all"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span>{t.checkout.phone} *</span>
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder={t.checkout.phonePlaceholder}
                required
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-google-blue focus:border-google-blue transition-all"
              />
            </div>

            {/* Telegram Username (Optional) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-google-blue" />
                  <span>{t.checkout.telegram}</span>
                </label>
                <span className="text-[11px] font-bold text-google-blue bg-blue-50 px-2 py-0.5 rounded-full">
                  Optional
                </span>
              </div>
              <input
                type="text"
                value={customerTelegram}
                onChange={(e) => setCustomerTelegram(e.target.value)}
                placeholder={t.checkout.telegramPlaceholder}
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-google-blue focus:border-google-blue transition-all"
              />
              <p className="text-[11px] text-gray-500 leading-relaxed bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                {t.checkout.telegramHint}
              </p>
            </div>
          </div>

          {/* Telebirr Payment Instructions & Guide */}
          {selectedProduct && (
            <TelebirrPaymentGuide
              amountETB={selectedProduct.priceETB}
              receiverName={settings?.telebirrReceiverName || 'ET-Sub Store AI Services'}
              receiverPhone={settings?.telebirrReceiverPhone || '+251988788834'}
              qrUrl={settings?.telebirrQrUrl}
            />
          )}

          {/* Telebirr Transaction ID Input */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-google-blue shadow-google-md space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-google-blue block">
              3. {t.checkout.transactionId} *
            </span>

            <div className="space-y-1.5">
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder={t.checkout.transactionIdPlaceholder}
                required
                className="w-full px-4 py-3 text-base font-mono font-bold tracking-wide border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-google-blue focus:border-google-blue transition-all"
              />
              <p className="text-xs text-gray-500">{t.checkout.transactionIdHint}</p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 rounded-2xl bg-google-blue hover:bg-google-blue-hover disabled:opacity-50 text-white font-display font-bold text-base shadow-google-md hover:shadow-google-lg transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t.checkout.processing}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>{t.checkout.submitOrder}</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Col: Order Summary Card */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          <div className="bg-gray-50 rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-google-sm space-y-6">
            
            <h3 className="font-bold text-base text-gray-900 border-b border-gray-200 pb-3">
              {t.checkout.orderSummary}
            </h3>

            {selectedProduct && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900 block text-sm">
                      {isAmharic ? selectedProduct.nameAm : selectedProduct.nameEn}
                    </span>
                    <span className="text-xs text-gray-500">
                      {isAmharic ? selectedProduct.durationAm : selectedProduct.duration}
                    </span>
                  </div>
                  <span className="font-bold text-gray-900 text-sm">
                    {formatETB(selectedProduct.priceETB)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-200">
                  <span>{t.checkout.paymentMethod}:</span>
                  <span className="font-bold text-telebirr flex items-center gap-1">
                    Telebirr (ETB)
                  </span>
                </div>

                {/* Total */}
                <div className="pt-4 border-t border-gray-200 flex items-baseline justify-between">
                  <span className="font-bold text-gray-900 text-base">
                    {t.checkout.totalETB}
                  </span>
                  <span className="font-display font-black text-2xl text-google-blue">
                    {formatETB(selectedProduct.priceETB)}
                  </span>
                </div>
              </div>
            )}

            {/* Guarantee Box */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2 font-semibold text-gray-800">
                <ShieldCheck className="w-4 h-4 text-google-green" />
                <span>Buyer Protection</span>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Your payment is safely protected. If your activation link encounters any issue, our 24/7 support will resolve or refund immediately.
              </p>
            </div>

          </div>
        </div>

      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="p-12 text-center text-sm text-gray-500">Loading Checkout...</div>}>
          <CheckoutContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
