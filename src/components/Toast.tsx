'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function Toast({ message, type = 'success', onClose }: ToastProps) {
  const getStyle = () => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200 text-red-800',
          icon: <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />,
        };
      case 'info':
        return {
          bg: 'bg-blue-50 border-blue-200 text-blue-800',
          icon: <Info className="w-4 h-4 text-google-blue shrink-0" />,
        };
      case 'success':
      default:
        return {
          bg: 'bg-green-50 border-green-200 text-green-800',
          icon: <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />,
        };
    }
  };

  const style = getStyle();

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-google-lg animate-slide-up max-w-md w-full mx-4 ${style.bg}`}
    >
      {style.icon}
      <span className="text-xs font-semibold flex-1">{message}</span>
      <button
        onClick={onClose}
        className="p-1 hover:opacity-70 rounded-lg transition-opacity"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
