import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata: Metadata = {
  title: 'ET-Sub Store — Gemini AI Pro & Digital Subscriptions Ethiopia',
  description:
    'Get official Gemini AI Pro (18 Months for 350 ETB), Telegram Stars, Cursor Pro, Supabase Pro, Claude, and CapCut subscriptions in Ethiopia. Fast Telebirr payment and 24/7 Telegram support (@Et_substore_support).',
  keywords: [
    'ET-Sub Store',
    'Gemini AI Pro Ethiopia',
    'Google AI Pro Addis Ababa',
    'Telegram Stars Ethiopia',
    'Cursor Pro Ethiopia',
    'Supabase Pro Ethiopia',
    'Claude Pro Ethiopia',
    'CapCut Pro Ethiopia',
    'Telebirr subscription',
  ],
  authors: [{ name: 'ET-Sub Store' }],
  openGraph: {
    title: 'ET-Sub Store — Gemini AI Pro (18 Months for 350 ETB) & More',
    description:
      'Activate Google Gemini AI Pro and premium digital subscriptions with Telebirr in Ethiopia.',
    type: 'website',
    locale: 'en_US',
    siteName: 'ET-Sub Store',
  },
};

export const viewport: Viewport = {
  themeColor: '#1a73e8',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased min-h-screen bg-white text-gray-900 selection:bg-blue-100 selection:text-google-blue">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
