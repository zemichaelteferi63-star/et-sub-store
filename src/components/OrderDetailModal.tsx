'use client';

import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Send,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  Clock,
  User,
  Phone,
  MessageCircle,
  CreditCard,
  FileText,
  AlertCircle,
} from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';
import { formatETB, formatDate } from '@/lib/utils';

export interface OrderDetailProps {
  order: any;
  onClose: () => void;
  onRefresh: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export default function OrderDetailModal({
  order,
  onClose,
  onRefresh,
  onShowToast,
}: OrderDetailProps) {
  const [activationLink, setActivationLink] = useState(order.activationLink || '');
  const [adminNotes, setAdminNotes] = useState(order.adminNotes || '');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showConfirmRelease, setShowConfirmRelease] = useState(false);

  // 1. Verify Payment Action
  const handleVerifyPayment = async () => {
    setLoadingAction('verify');
    try {
      const res = await fetch(`/api/orders/${order.orderNumber}/verify-payment`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to verify payment');

      onShowToast('Payment marked as PAID successfully!', 'success');
      onRefresh();
    } catch (err: any) {
      onShowToast(err.message, 'error');
    } finally {
      setLoadingAction(null);
    }
  };

  // 2. Deliver / Release Activation Link
  const handleConfirmDeliver = async () => {
    if (!activationLink.trim()) {
      onShowToast('Please paste a valid activation link or code before releasing', 'error');
      return;
    }

    setLoadingAction('deliver');
    setShowConfirmRelease(false);

    try {
      const res = await fetch(`/api/orders/${order.orderNumber}/deliver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activationLink: activationLink.trim(),
          adminNotes: adminNotes.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to deliver activation link');

      const telegramMsg = order.customerTelegram
        ? 'Activation released & Telegram notification sent to customer!'
        : 'Activation released successfully! Available on customer tracking page.';

      onShowToast(telegramMsg, 'success');
      onRefresh();
    } catch (err: any) {
      onShowToast(err.message, 'error');
    } finally {
      setLoadingAction(null);
    }
  };

  // 3. Save Admin Notes
  const handleSaveNotes = async () => {
    setLoadingAction('notes');
    try {
      const res = await fetch(`/api/orders/${order.orderNumber}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update notes');

      onShowToast('Admin notes saved', 'success');
      onRefresh();
    } catch (err: any) {
      onShowToast(err.message, 'error');
    } finally {
      setLoadingAction(null);
    }
  };

  // 4. Cancel / Refund Order
  const handleStatusChange = async (newStatus: string) => {
    if (!confirm(`Are you sure you want to mark this order as ${newStatus}?`)) return;
    setLoadingAction('status');
    try {
      const res = await fetch(`/api/orders/${order.orderNumber}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update status');

      onShowToast(`Order status updated to ${newStatus}`, 'success');
      onRefresh();
    } catch (err: any) {
      onShowToast(err.message, 'error');
    } finally {
      setLoadingAction(null);
    }
  };

  const copyOrderLink = () => {
    const fullUrl = `${window.location.origin}/orders/${order.orderNumber}?token=${order.accessToken}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const isPaid = order.paymentStatus === 'PAID';
  const isDelivered = order.orderStatus === 'DELIVERED';
  const hasTelegram = !!order.customerTelegram;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-slide-up my-8">
        
        {/* Modal Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-mono font-bold text-lg text-gray-900">
              #{order.orderNumber}
            </h2>
            <OrderStatusBadge status={order.orderStatus} />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Customer & Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Customer Box */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 space-y-2.5 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                Customer Info
              </span>
              <div className="flex items-center gap-2 font-semibold text-gray-900 text-sm">
                <User className="w-4 h-4 text-gray-400" />
                <span>{order.customerName}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 font-mono">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span>{order.customerPhone}</span>
              </div>

              <div className="pt-1">
                {hasTelegram ? (
                  <span className="inline-block font-mono text-xs text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200">
                    @{order.customerTelegram.replace('@', '')}
                  </span>
                ) : (
                  <span className="inline-block font-mono text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200">
                    Telegram not provided
                  </span>
                )}
              </div>
            </div>

            {/* Product & Payment Box */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 space-y-2 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                Order & Payment
              </span>
              <div className="font-bold text-gray-900 text-sm">
                {order.product?.nameEn || order.productId}
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Amount:</span>
                <span className="font-black text-gray-900 text-sm font-mono">
                  {formatETB(order.amountETB)}
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Payment Status:</span>
                <OrderStatusBadge status={order.paymentStatus} type="payment" />
              </div>
              <div className="flex items-center justify-between text-gray-600 font-mono">
                <span>Telebirr Ref:</span>
                <span className="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
                  {order.transactionId || 'None'}
                </span>
              </div>
            </div>

          </div>

          {/* Payment Verification Banner */}
          {!isPaid && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <span className="font-bold block">Payment needs verification</span>
                  <span>Customer submitted Telebirr Ref: <b className="font-mono">{order.transactionId || 'Pending'}</b></span>
                </div>
              </div>

              <button
                onClick={handleVerifyPayment}
                disabled={loadingAction === 'verify'}
                className="px-4 py-2 bg-google-green hover:bg-google-green-hover text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-xs flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{loadingAction === 'verify' ? 'Verifying...' : 'Verify & Mark Paid'}</span>
              </button>
            </div>
          )}

          {/* Supplier Activation Link Delivery Section (Section 11) */}
          <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-google-blue" />
                <h3 className="font-bold text-gray-900 text-sm">
                  Activation Link / Offer Redeem URL
                </h3>
              </div>
              {isDelivered && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  Delivered on {formatDate(order.deliveredAt)}
                </span>
              )}
            </div>

            <p className="text-xs text-gray-600">
              Paste the activation redeem link below. Clicking <b>Release Activation</b> updates the order status to DELIVERED and dispatches a Telegram alert if a username is available.
            </p>

            <div className="space-y-3">
              <textarea
                value={activationLink}
                onChange={(e) => setActivationLink(e.target.value)}
                placeholder="https://one.google.com/invitation/gemini-pro-ethiopia-..."
                rows={3}
                className="w-full px-3.5 py-2.5 text-xs font-mono border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-google-blue bg-white"
              />

              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={copyOrderLink}
                  className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-google-blue"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Customer link copied!' : 'Copy Customer Tracking URL'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowConfirmRelease(true)}
                  disabled={loadingAction === 'deliver' || !activationLink.trim()}
                  className="px-5 py-2.5 bg-google-blue hover:bg-google-blue-hover disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-google-sm flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {loadingAction === 'deliver'
                      ? 'Releasing...'
                      : isDelivered
                      ? 'Resend / Update Release'
                      : 'Release Activation'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Admin Internal Notes */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-700 block">
              Internal Admin Notes
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Private note for this order..."
                className="flex-1 px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-google-blue"
              />
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={loadingAction === 'notes'}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-xl transition-colors"
              >
                Save
              </button>
            </div>
          </div>

          {/* Timestamps & Quick Actions */}
          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-500 gap-3">
            <div>
              <span>Created: </span>
              <span className="font-medium text-gray-700">{formatDate(order.createdAt)}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleStatusChange('CANCELLED')}
                className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Cancel Order
              </button>
              <button
                onClick={() => handleStatusChange('REFUNDED')}
                className="px-3 py-1.5 text-xs text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                Mark Refunded
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Confirmation Modal before Release Activation (Section 11) */}
      {showConfirmRelease && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-slide-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-gray-900">
                Release Activation to Customer?
              </h3>
              <button onClick={() => setShowConfirmRelease(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-600">
              <div className="bg-gray-50 p-3.5 rounded-2xl space-y-1.5 border border-gray-200">
                <div><b>Customer:</b> {order.customerName} ({order.customerPhone})</div>
                <div><b>Order Code:</b> <span className="font-mono font-bold text-gray-900">#{order.orderNumber}</span></div>
                <div><b>Product:</b> {order.product?.nameEn || 'Gemini AI Pro'}</div>
                <div><b>Telegram:</b> {order.customerTelegram ? `@${order.customerTelegram.replace('@', '')}` : 'Not provided'}</div>
              </div>

              <p className="text-gray-500 leading-relaxed">
                This will save the activation link, update the order status to <b>ACTIVATION READY / DELIVERED</b>, and publish it to the customer order tracking page.
                {order.customerTelegram ? ' A notification will also be sent to Telegram.' : ''}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmRelease(false)}
                className="px-4 py-2.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeliver}
                className="px-5 py-2.5 text-xs font-bold text-white bg-google-blue hover:bg-google-blue-hover rounded-xl shadow-google-sm transition-all flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Release Activation</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
