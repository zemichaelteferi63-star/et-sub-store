'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Sparkles, MessageCircle, Phone, Shield, FileText, RefreshCw, X, ShoppingBag, ExternalLink } from 'lucide-react';

export default function Footer({
  supportPhone = '0996976737',
  supportTelegram = 'Et_substore_support',
}: {
  supportPhone?: string;
  supportTelegram?: string;
}) {
  const { t, isAmharic } = useLanguage();
  const [modalContent, setModalContent] = useState<{ title: string; body: string } | null>(null);

  const openModal = (type: 'terms' | 'privacy' | 'refund') => {
    if (type === 'terms') {
      setModalContent({
        title: isAmharic ? 'የአጠቃቀም ውል' : 'Terms of Service',
        body: isAmharic
          ? 'ET-Sub Store የ Gemini AI Pro እና ሌሎች የዲጂታል ሳብስክሪፕሽኖችን አክቲቬሽን ለኢትዮጵያ ደንበኞች በቴሌብር ክፍያ የሚያቀርብ መድረክ ነው። ሁሉም ግብይቶች ከተከናወኑ በኋላ ይፋዊ የአክቲቬሽን ሊንኮች ወዲያውኑ ይላካሉ። ደንበኞች ትክክለኛ መረጃ እና የቴሌብር ማረጋገጫ መስጠት ይጠበቅባቸዋል።'
          : 'ET-Sub Store provides digital subscription activation services for Ethiopian customers with local Telebirr payment processing. By placing an order, you agree to provide accurate customer details and genuine Telebirr payment reference numbers. Activation links are issued for legitimate personal/commercial productivity use according to official platform terms.',
      });
    } else if (type === 'privacy') {
      setModalContent({
        title: isAmharic ? 'የግላዊነት ፖሊሲ' : 'Privacy Policy',
        body: isAmharic
          ? 'የደንበኞቻችን ስም፣ ስልክ ቁጥር እና የቴሌግራም ዩዘርኔም የሚቀመጠው ትዕዛዞችን ለማድረስ እና ድጋፍ ለመስጠት ብቻ ነው። ማንኛውም መረጃ ለሶስተኛ ወገን አይተላለፍም፤ ሚስጥራዊነቱ ሙሉ በሙሉ የተጠበቀ ነው።'
          : 'Your privacy is paramount. We collect your name, phone number, and Telegram handle solely to fulfill your subscription order, verify Telebirr payment, and deliver your activation link. We never sell, share, or disclose your personal contact details to unauthorized third parties.',
      });
    } else if (type === 'refund') {
      setModalContent({
        title: isAmharic ? 'የገንዘብ ተመላሽ ፖሊሲ' : 'Refund Policy',
        body: isAmharic
          ? 'የተላከው የአክቲቬሽን ሊንክ የማይሰራ ከሆነ ወይም በቴክኒካል ምክንያት ሳብስክሪፕሽኑ ካልሰራ ሙሉ የገንዘብ ተመላሽ በቴሌብር ይደረጋል። ሊንኩ አንዴ ተጠቅመውበት በተሳካ ሁኔታ ከተጀመረ በኋላ ተመላሽ ማድረግ አይቻልም።'
          : 'If an issued activation link is invalid or fails to activate your subscription due to a technical error on our side, you are entitled to an immediate replacement or a 100% full refund via Telebirr. Once an activation has been successfully claimed, the sale is final.',
      });
    }
  };

  const cleanHandle = supportTelegram.replace('@', '');

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20 pt-16 pb-12 text-sm text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-200">
          
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-google-blue via-google-green to-google-yellow flex items-center justify-center p-0.5 shadow-sm">
                <div className="w-full h-full bg-white rounded-[6px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-google-blue" />
                </div>
              </div>
              <span className="font-display font-bold text-lg text-gray-900">
                ET-Sub <span className="text-google-blue">Store</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-gray-500">
              {t.footer.brandDesc}
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-gray-900">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/#gemini-pro" className="hover:text-google-blue transition-colors">
                  {t.nav.geminiPro} (18 Months — 350 ETB)
                </Link>
              </li>
              <li>
                <Link href="/more-products" className="hover:text-google-blue transition-colors font-semibold text-google-blue">
                  {t.nav.moreFromUs}
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-google-blue transition-colors">
                  {t.nav.orderTracking}
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-google-blue transition-colors">
                  {t.nav.howItWorks}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Support */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-gray-900">
              {t.footer.supportSection}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href={`https://t.me/${cleanHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-google-blue hover:underline font-mono"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Telegram: @{cleanHandle}</span>
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-600 font-mono">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span>{supportPhone}</span>
              </li>
              <li className="text-[11px] text-green-600 font-medium">
                ● {t.floatingSupport.activeNow} (24/7 Support)
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Policies */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-gray-900">
              {t.footer.legal}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => openModal('terms')}
                  className="hover:text-google-blue transition-colors text-left flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-gray-400" />
                  <span>{t.footer.terms}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => openModal('privacy')}
                  className="hover:text-google-blue transition-colors text-left flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-gray-400" />
                  <span>{t.footer.privacy}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => openModal('refund')}
                  className="hover:text-google-blue transition-colors text-left flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
                  <span>{t.footer.refundPolicy}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 space-y-4">
          <p className="text-[11px] text-gray-400 leading-relaxed max-w-4xl text-center mx-auto">
            {t.footer.disclaimer}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-100 gap-3">
            <span>© {new Date().getFullYear()} ET-Sub Store. {t.footer.allRightsReserved}</span>
            
            {/* Powered by ZE Creatives with openable link */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <span>Powered by</span>
              <a
                href="https://zecreatives.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-gray-900 hover:text-google-blue transition-colors group"
                title="Visit ZE Creatives"
              >
                <span>ZE Creatives</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-google-blue group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>
            </div>

            <span className="mt-2 sm:mt-0 flex items-center gap-1 text-[11px]">
              Telebirr Verified • Support @{cleanHandle}
            </span>
          </div>
        </div>
      </div>

      {/* Policy Modal */}
      {modalContent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-slide-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900">{modalContent.title}</h3>
              <button
                onClick={() => setModalContent(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{modalContent.body}</p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setModalContent(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-google-blue rounded-xl hover:bg-google-blue-hover transition-colors"
              >
                {isAmharic ? 'እሺ (ዝጋ)' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
