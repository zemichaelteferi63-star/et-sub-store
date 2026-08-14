'use client';

import React from 'react';
import { User, Bell, ShieldCheck } from 'lucide-react';

export default function AdminHeader({
  title,
  subtitle,
  adminEmail = 'admin@ethiogemini.com',
  children,
}: {
  title: string;
  subtitle?: string;
  adminEmail?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3 self-end sm:self-center">
        {children}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700">
          <div className="w-6 h-6 rounded-full bg-google-blue-light text-google-blue flex items-center justify-center font-bold text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-gray-800">{adminEmail}</span>
        </div>
      </div>
    </header>
  );
}
