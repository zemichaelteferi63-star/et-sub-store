'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Copy, Check, Phone, AlertCircle, ShieldCheck } from 'lucide-react';
import { formatETB } from '@/lib/utils';

interface TelebirrPaymentGuideProps {
  amountETB: number;
  receiverName: string;
  receiverPhone: string;
  qrUrl?: string;
}

export default function TelebirrPaymentGuide({
  amountETB,
  receiverName,
  receiverPhone,
}: TelebirrPaymentGuideProps) {
  const { isAmharic } = useLanguage();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50/70 via-white to-sky-50/40 rounded-2xl p-5 sm:p-6 border border-blue-100 shadow-sm space-y-5">
      {/* Telebirr Header */}
      <div className="flex items-center justify-between border-b border-blue-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-gray-200 flex items-center justify-center shadow-xs shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/telebirr-logo.jpg" 
              alt="Telebirr Logo" 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.ctfassets.net/r8cm1n1mpqev/2yHoEHDIDuF1BLzXVqo1Uz/e6a1c5a0c8599da014d51e8b0ab48167/photo_2021-05-10_22-48-53-telebirr_icon.jpg?w=800&q=50';
              }}
            />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base">
              {isAmharic ? 'የቴሌብር ክፍያ መረጃ' : 'Telebirr Payment Details'}
            </h3>
            <p className="text-xs text-gray-500">
              {isAmharic ? 'የሚከፈል መጠን' : 'Amount to pay'}: <span className="font-bold text-telebirr">{formatETB(amountETB)}</span>
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          {isAmharic ? 'ደህንነቱ የተጠበቀ' : 'Verified Merchant'}
        </span>
      </div>

      {/* Payment Steps & Details without shortcode */}
      <div className="space-y-3 text-xs sm:text-sm">
        {/* Detail 1: Receiver Name */}
        <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-xs">
          <div className="space-y-0.5">
            <span className="text-gray-500 text-[11px] uppercase tracking-wide block">
              {isAmharic ? 'ተቀባይ ስም (Receiver Name)' : 'Receiver Name'}
            </span>
            <span className="font-semibold text-gray-900 text-sm">{receiverName}</span>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(receiverName, 'name')}
            className="p-2 text-gray-400 hover:text-telebirr hover:bg-blue-50 rounded-lg transition-colors"
            title="Copy receiver name"
          >
            {copiedField === 'name' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Detail 2: Receiver Phone Number */}
        <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-xs">
          <div className="space-y-0.5">
            <span className="text-gray-500 text-[11px] uppercase tracking-wide block">
              {isAmharic ? 'የቴሌብር ስልክ ቁጥር (Transfer to Phone)' : 'Telebirr Receiver Phone'}
            </span>
            <span className="font-mono font-bold text-gray-900 text-base">{receiverPhone}</span>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(receiverPhone.replace(/\s+/g, ''), 'phone')}
            className="p-2 text-gray-400 hover:text-telebirr hover:bg-blue-50 rounded-lg transition-colors"
            title="Copy phone"
          >
            {copiedField === 'phone' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* How to pay options */}
      <div className="bg-white/80 rounded-xl p-4 border border-blue-100/80 text-xs text-gray-600 space-y-2.5">
        <span className="font-semibold text-gray-800 block">
          {isAmharic ? 'ክፍያውን እንዴት መፈጸም ይችላሉ?' : 'How to pay via Telebirr:'}
        </span>
        <ol className="list-decimal list-inside space-y-1.5 text-gray-600 text-xs">
          <li>{isAmharic ? 'የቴሌብር አፕሊኬሽን ይክፈቱ ወይም *127# ይደውሉ' : 'Open Telebirr App or dial *127#'}</li>
          <li>
            {isAmharic
              ? `ገንዘብ ያስተላልፉ (Send Money) ወደ ስልክ ቁጥር: ${receiverPhone}`
              : `Select "Send Money / Transfer" to phone: ${receiverPhone}`}
          </li>
          <li>
            {isAmharic
              ? `ትክክለኛውን ${formatETB(amountETB)} ይላኩ`
              : `Enter the exact amount of ${formatETB(amountETB)}`}
          </li>
          <li>
            {isAmharic
              ? 'ክፍያው ሲጠናቀቅ የሚደርስዎትን የግብይት ቁጥር (Transaction ID) ከታች ባለው ሳጥን ውስጥ ያስገቡ'
              : 'Copy the Transaction/Reference ID received in your Telebirr SMS and paste it below'}
          </li>
        </ol>
      </div>

      {/* Notice */}
      <div className="flex items-start gap-2.5 text-xs text-amber-800 bg-amber-50/90 p-3.5 rounded-xl border border-amber-200">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>
          {isAmharic
            ? 'አስፈላጊ፡ ክፍያዎን እንደፈጸሙ ወዲያውኑ የግብይት ቁጥርዎን (Transaction ID) ያስገቡ። ሲስተማችን አረጋግጦ አክቲቬሽን ሊንኩን ይልክልዎታል።'
            : 'Important: Once you transfer the ETB amount, paste the Telebirr Transaction/Reference ID below to submit your order for instant verification.'}
        </span>
      </div>
    </div>
  );
}
