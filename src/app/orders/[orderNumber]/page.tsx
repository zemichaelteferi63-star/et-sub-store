'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingSupport from '@/components/FloatingSupport';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import Toast from '@/components/Toast';
import { useLanguage } from '@/context/LanguageContext';
import { formatETB, formatDate } from '@/lib/utils';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  MessageCircle,
  ShieldCheck,
  AlertTriangle,
  Camera,
  AlertCircle,
  Info,
  Globe,
  Hourglass,
  Send,
} from 'lucide-react';
import confetti from 'canvas-confetti';

function CountdownTimer({
  deliveredAt,
  isAmharic,
}: {
  deliveredAt: string;
  isAmharic: boolean;
}) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({ hours: 4, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    const deliveryTime = new Date(deliveredAt).getTime();
    const expiryTime = deliveryTime + 4 * 60 * 60 * 1000; // 4 hours in milliseconds

    const updateCountdown = () => {
      const now = Date.now();
      const diff = expiryTime - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true });
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds, isExpired: false });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [deliveredAt]);

  const pad = (n: number) => String(n).padStart(2, '0');

  if (timeLeft.isExpired) {
    return (
      <div className="bg-amber-500/20 border border-amber-300/40 rounded-2xl p-4 text-white space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-200 text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
          <span>{isAmharic ? '⚠️ የአክቲቬሽን ሊንኩ ጊዜው አልፎበት ሊሆን ይችላል።' : '⚠️ Activation link may have expired.'}</span>
        </div>
        <p className="text-xs text-amber-100/90 leading-relaxed">
          {isAmharic
            ? 'የ 4 ሰዓቱ የአክቲቬሽን ጊዜ አልፏል። ሳብስክሪፕሽኑን እስካሁን ካላስጀመሩ እባክዎ አዲስ ሊንክ ለማግኘት ድጋፍን ያነጋግሩ።'
            : 'The 4-hour activation window has elapsed. If you have not activated yet, please contact support for assistance.'}
        </p>
        <a
          href="https://t.me/Et_substore_support"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-400 text-gray-900 rounded-xl text-xs font-bold hover:bg-amber-300 transition-colors mt-1"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>{isAmharic ? 'ድጋፍን ያነጋግሩ (@Et_substore_support)' : 'Contact Support (@Et_substore_support)'}</span>
        </a>
      </div>
    );
  }

  return (
    <div className="bg-black/25 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Hourglass className="w-4 h-4 text-yellow-300 animate-pulse" />
        <span className="text-xs uppercase tracking-wider font-bold text-emerald-100">
          {isAmharic ? '⏱ የአክቲቬሽን ሊንኩ የሚያበቃበት ጊዜ:' : '⏱ Activation link expires in:'}
        </span>
      </div>
      <div className="font-mono text-lg font-black tracking-widest text-yellow-300 bg-black/30 px-3.5 py-1 rounded-xl border border-white/10 self-start sm:self-auto">
        {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
      </div>
    </div>
  );
}

function OrderTrackerContent() {
  const { t, isAmharic } = useLanguage();
  const params = useParams();
  const searchParams = useSearchParams();

  const orderNumber = params.orderNumber as string;
  const token = searchParams.get('token');

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const fetchOrder = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    try {
      const url = `/api/orders/${orderNumber}${token ? `?token=${token}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to load order');
      }

      setOrder(data.order);
      setError(null);

      // Trigger confetti if newly delivered
      if (data.order.orderStatus === 'DELIVERED' && data.order.activationLink) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {}
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      if (isManualRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // Poll every 10 seconds if order is not delivered yet
    const interval = setInterval(() => {
      if (order?.orderStatus !== 'DELIVERED' && order?.orderStatus !== 'CANCELLED') {
        fetchOrder();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [orderNumber, token, order?.orderStatus]);

  const copyActivationLink = () => {
    if (!order?.activationLink) return;
    navigator.clipboard.writeText(order.activationLink);
    setCopiedLink(true);
    setToast({ message: t.order.linkCopied, type: 'success' });
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const copyTrackingCode = () => {
    if (!order?.orderNumber) return;
    navigator.clipboard.writeText(order.orderNumber);
    setCopiedCode(true);
    setToast({ message: t.order.codeCopied, type: 'success' });
    setTimeout(() => setCopiedCode(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-google-blue border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-gray-500">Checking order status...</span>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Order Lookup Notice</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          {error || 'Unable to retrieve order details. Please verify your order number and security link.'}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/track"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-google-blue text-white rounded-xl text-xs font-bold shadow-sm"
          >
            <span>Track My Order</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold"
          >
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  const isDelivered = order.orderStatus === 'DELIVERED' && !!order.activationLink;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-8">
      
      {/* 1. Top Tracking Code Card with Copy Button */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-google-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
              {t.order.orderNumber}
            </span>
            <div className="flex items-center gap-3">
              <span className="font-display font-black text-2xl sm:text-3xl text-gray-900 font-mono tracking-tight">
                {order.orderNumber}
              </span>
              <OrderStatusBadge status={order.orderStatus} />
            </div>
            <span className="text-xs text-gray-500 block">
              {t.order.created}: {formatDate(order.createdAt)}
            </span>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-center">
            {/* Copy Tracking Code Button */}
            <button
              onClick={copyTrackingCode}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all shadow-xs"
            >
              {copiedCode ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCode ? t.order.codeCopied : t.order.copyCodeButton}</span>
            </button>

            {/* Refresh Status Button */}
            <button
              onClick={() => fetchOrder(true)}
              disabled={refreshing}
              className="p-2.5 text-gray-500 hover:text-google-blue bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all"
              title="Refresh order status"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-google-blue' : ''}`} />
            </button>
          </div>
        </div>

        {/* Important Customer Warning / Disclaimer Box */}
        <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 sm:p-5 space-y-2.5 text-amber-900 text-xs leading-relaxed">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{t.order.warningTitle}</span>
          </div>
          <p className="text-amber-800/90 whitespace-pre-line">
            {t.order.warningText}
          </p>
          <div className="flex items-center gap-2 pt-1 text-[11px] text-amber-700 font-medium">
            <Camera className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              {isAmharic
                ? 'የዚህን ገጽ ስክሪንሾት (Screenshot) አሁኑኑ አንስተው ያስቀምጡ።'
                : 'Tip: Take a screenshot of this screen for safe keeping.'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Delivery & Status Fulfillment Box */}
      {isDelivered ? (
        /* ACTIVATION READY SECTION */
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-500 via-teal-600 to-green-600 rounded-3xl p-7 sm:p-10 text-white shadow-google-lg space-y-6 relative overflow-hidden">
            
            {/* Subtle glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-yellow-300" />
                <span>{t.order.activationReadyStatus}</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight">
                {t.order.activationReadyTitle}
              </h2>

              <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
                {t.order.activationReadySubtitle}
              </p>
            </div>

            {/* 4-Hour Countdown Timer */}
            {order.deliveredAt && (
              <div className="relative z-10">
                <CountdownTimer deliveredAt={order.deliveredAt} isAmharic={isAmharic} />
              </div>
            )}

            {/* Activation Link Container */}
            <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-200">
                  {isAmharic ? 'የእርስዎ Redeem / Activation ሊንክ' : 'Your Redeem / Activation Link'}
                </span>
                <span className="text-[11px] text-emerald-200 font-mono">
                  Order: {order.orderNumber}
                </span>
              </div>

              <div className="bg-white rounded-xl p-3.5 text-gray-900 font-mono text-xs break-all shadow-inner select-all border border-emerald-200/50 font-semibold">
                {order.activationLink}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href={order.activationLink.startsWith('http') ? order.activationLink : `https://${order.activationLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 font-display font-black text-sm shadow-md transition-all duration-200 group"
                >
                  <span>{t.order.activateButton}</span>
                  <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </a>

                <button
                  type="button"
                  onClick={copyActivationLink}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm border border-white/30 transition-colors"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-yellow-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? t.order.linkCopied : t.order.copyLinkButton}</span>
                </button>
              </div>
            </div>

          </div>

          {/* 3 Dedicated Instructions Information Cards */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-google-sm space-y-4">
            <h3 className="font-display font-black text-lg text-gray-900 flex items-center gap-2">
              <Info className="w-5 h-5 text-google-blue" />
              <span>{t.order.instructionsHeading}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              
              {/* Card 1: Activate Offer */}
              <div className="bg-blue-50/60 rounded-2xl p-4 border border-blue-100 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-google-blue text-white flex items-center justify-center font-bold">
                  📦
                </div>
                <h4 className="font-bold text-gray-900 text-sm">
                  {isAmharic ? '1. ሊንኩን ይክፈቱ' : '1. Open Redeem Link'}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {t.order.instructionCard1}
                </p>
              </div>

              {/* Card 2: VPN Suggestion */}
              <div className="bg-purple-50/60 rounded-2xl p-4 border border-purple-100 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold">
                  🌐
                </div>
                <h4 className="font-bold text-gray-900 text-sm">
                  {isAmharic ? '2. VPN አማራጮች' : '2. VPN Suggested Options'}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {t.order.instructionCard2}
                </p>
              </div>

              {/* Card 3: 4-Hour Expiration Note */}
              <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-100 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
                  ⏱️
                </div>
                <h4 className="font-bold text-gray-900 text-sm">
                  {isAmharic ? '3. የ 4 ሰዓታት ጊዜ ገደብ' : '3. 4-Hour Time Limit'}
                </h4>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {t.order.instructionCard3}
                </p>
              </div>

            </div>
          </div>
        </div>
      ) : (
        /* PAYMENT SUBMITTED & PROCESSING SCREEN */
        <div className="bg-white rounded-3xl p-7 sm:p-10 border-2 border-google-blue/40 shadow-google-lg space-y-8 animate-slide-up">
          
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 text-google-blue flex items-center justify-center mx-auto shadow-sm ring-4 ring-blue-100">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <h2 className="font-display font-black text-2xl sm:text-3xl text-gray-900 tracking-tight">
              {t.order.paymentVerifiedHeader}
            </h2>

            <p className="text-sm font-bold text-google-blue bg-blue-50 inline-block px-4 py-1.5 rounded-full border border-blue-200">
              {t.order.paymentVerifiedNotice}
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 via-indigo-50/50 to-blue-50 p-6 rounded-2xl border border-blue-100 space-y-4">
            
            {/* 0-30 Minute Processing Message */}
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-google-blue shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs sm:text-sm">
                <span className="font-bold text-gray-900 block">
                  {t.order.orderProcessingNotice}
                </span>
                <p className="text-gray-700 font-medium leading-relaxed">
                  {t.order.estimatedTimeNotice}
                </p>
              </div>
            </div>

            <div className="border-t border-blue-200/60 pt-4 space-y-3">
              
              {/* Telegram Notice */}
              {order.customerTelegram ? (
                <div className="bg-white p-4 rounded-xl border border-blue-200 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-google-blue font-bold text-sm">
                    <Send className="w-4 h-4" />
                    <span>📲 CHECK TELEGRAM!</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {t.order.checkTelegramNotice}
                  </p>
                </div>
              ) : (
                <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                    <Info className="w-4 h-4" />
                    <span>💡 No Telegram Username Provided</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {t.order.noTelegramNotice}
                  </p>
                  <p className="text-[11px] text-gray-500 pt-1">
                    {t.order.telegramUnavailableNotice}
                  </p>
                </div>
              )}

            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-google-blue animate-spin shrink-0" />
              <span>Auto-refreshing status... You can return to this page anytime using your tracking code.</span>
            </div>
            <button
              onClick={() => fetchOrder(true)}
              disabled={refreshing}
              className="px-4 py-2 bg-google-blue text-white rounded-xl font-bold hover:bg-google-blue-hover transition-colors shrink-0"
            >
              {t.order.refreshStatus}
            </button>
          </div>

        </div>
      )}

      {/* 3. Order Details Breakdown Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-google-sm space-y-5">
        <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3">
          {isAmharic ? 'የትዕዛዝ ዝርዝር መረጃ' : 'Order Summary'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-gray-400 font-semibold uppercase tracking-wider block text-[10px]">
              Customer
            </span>
            <span className="font-bold text-gray-900 text-sm block">{order.customerName}</span>
            <span className="font-mono text-gray-600 block">{order.customerPhone}</span>
            {order.customerTelegram ? (
              <div className="pt-1">
                <span className="inline-block font-mono text-xs text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200">
                  @{order.customerTelegram.replace('@', '')}
                </span>
              </div>
            ) : (
              <div className="pt-1">
                <span className="inline-block font-mono text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200">
                  Telegram not provided
                </span>
              </div>
            )}
          </div>

          <div className="space-y-1 sm:text-right">
            <span className="text-gray-400 font-semibold uppercase tracking-wider block text-[10px]">
              Product & Price
            </span>
            <span className="font-bold text-gray-900 text-sm block">
              {isAmharic ? order.product?.nameAm : order.product?.nameEn}
            </span>
            <span className="font-display font-black text-google-blue text-base block font-mono">
              {formatETB(order.amountETB)}
            </span>
          </div>
        </div>

        {/* Telebirr Reference snippet */}
        <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-100 flex items-center justify-between text-xs">
          <span className="text-gray-500 font-medium">
            Telebirr Reference (TXN ID):
          </span>
          <span className="font-mono font-bold text-gray-900 bg-white px-2.5 py-1 rounded-lg border border-gray-200">
            {order.transactionId || 'None'}
          </span>
        </div>
      </div>

      {/* 4. Bookmark Notice & Support Help */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-google-green shrink-0" />
          <span>{t.order.bookmarkNotice}</span>
        </div>

        <a
          href={`https://t.me/Et_substore_support?text=Hello,%20I%20need%20help%20with%20order%20%23${order.orderNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-google-blue text-white rounded-xl font-bold hover:bg-google-blue-hover transition-colors shrink-0"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>{t.order.telegramSupportButton}</span>
        </a>
      </div>

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

export default function OrderPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="p-12 text-center text-sm text-gray-500">Loading Order...</div>}>
          <OrderTrackerContent />
        </Suspense>
      </main>
      <Footer />
      <FloatingSupport />
    </div>
  );
}
