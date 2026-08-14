'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Clock, CheckCircle2, AlertCircle, Sparkles, XCircle, RotateCcw } from 'lucide-react';

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
          bg: 'bg-green-50 text-green-700 border-green-200',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />,
          label: t.order.status.PAID,
        };
      case 'DELIVERED':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold',
          icon: <Sparkles className="w-3.5 h-3.5 text-emerald-600" />,
          label: t.order.status.DELIVERED,
        };
      case 'PAYMENT_PROCESSING':
      case 'PROCESSING':
        return {
          bg: 'bg-blue-50 text-google-blue border-blue-200',
          icon: <Clock className="w-3.5 h-3.5 text-google-blue animate-spin" />,
          label: status === 'PAYMENT_PROCESSING' ? t.order.status.PAYMENT_PROCESSING : t.order.status.PROCESSING,
        };
      case 'PENDING':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
          label: t.order.status.PENDING,
        };
      case 'PAYMENT_FAILED':
        return {
          bg: 'bg-red-50 text-red-700 border-red-200',
          icon: <AlertCircle className="w-3.5 h-3.5 text-red-600" />,
          label: t.order.status.PAYMENT_FAILED,
        };
      case 'REFUNDED':
        return {
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: <RotateCcw className="w-3.5 h-3.5 text-purple-600" />,
          label: t.order.status.REFUNDED,
        };
      case 'CANCELLED':
      default:
        return {
          bg: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: <XCircle className="w-3.5 h-3.5 text-gray-500" />,
          label: t.order.status.CANCELLED || status,
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
