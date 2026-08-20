'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Clock, CheckCircle2, AlertCircle, Sparkles, XCircle, RotateCcw, Send } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: string;
  type?: 'payment' | 'order';
  className?: string;
}

export default function OrderStatusBadge({ status, type = 'order', className = '' }: OrderStatusBadgeProps) {
  const { t } = useLanguage();

  const getBadgeConfig = () => {
    switch (status?.toUpperCase()) {
      case 'PAID':
        return {
          bg: 'bg-green-50 text-green-700 border-green-200 font-semibold',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />,
          label: 'Paid',
        };
      case 'SENT':
      case 'DELIVERED':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold',
          icon: <Sparkles className="w-3.5 h-3.5 text-emerald-600" />,
          label: 'Sent',
        };
      case 'SENDING':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold',
          icon: <Send className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />,
          label: 'Sending...',
        };
      case 'VERIFIED':
      case 'PROCESSING':
        return {
          bg: 'bg-blue-50 text-google-blue border-blue-200 font-semibold',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-google-blue" />,
          label: 'Verified',
        };
      case 'PAYMENT_PROCESSING':
        return {
          bg: 'bg-blue-50 text-google-blue border-blue-200 font-medium',
          icon: <Clock className="w-3.5 h-3.5 text-google-blue animate-spin" />,
          label: 'Processing',
        };
      case 'PENDING':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200 font-semibold',
          icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
          label: 'Pending / Unverified',
        };
      case 'PAYMENT_FAILED':
        return {
          bg: 'bg-red-50 text-red-700 border-red-200',
          icon: <AlertCircle className="w-3.5 h-3.5 text-red-600" />,
          label: 'Payment Failed',
        };
      case 'REFUNDED':
        return {
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: <RotateCcw className="w-3.5 h-3.5 text-purple-600" />,
          label: 'Refunded',
        };
      case 'CANCELLED':
      default:
        return {
          bg: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: <XCircle className="w-3.5 h-3.5 text-gray-500" />,
          label: status || 'Cancelled',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full border ${config.bg} ${className}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
}
