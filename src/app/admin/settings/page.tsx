'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/AdminHeader';
import Toast from '@/components/Toast';
import { Save, Store, CreditCard, MessageSquare, Send, ShieldAlert } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.settings) setSettings(data.settings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (key: string, val: any) => {
    setSettings((prev: any) => ({ ...prev, [key]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save settings');

      setToast({ message: 'Settings saved successfully!', type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="flex-1 space-y-6">
      <AdminHeader
        title="Store & Integration Settings"
        subtitle="Manage Telebirr merchant details, Telegram bot credentials, and storefront contact info."
      />

      <form onSubmit={handleSave} className="px-6 space-y-6 max-w-5xl pb-16">
        
        {/* Section 1: Store Information */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-google-sm space-y-5">
          <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
            <Store className="w-5 h-5 text-google-blue" />
            <h2 className="font-bold text-sm text-gray-900">Store Profile & Contacts</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Store Brand Name</label>
              <input
                type="text"
                value={settings.storeName || ''}
                onChange={(e) => handleChange('storeName', e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-google-blue"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Currency Code</label>
              <input
                type="text"
                value={settings.currency || 'ETB'}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-google-blue"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Customer Support Phone</label>
              <input
                type="text"
                value={settings.supportPhone || ''}
                onChange={(e) => handleChange('supportPhone', e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-google-blue"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Customer Support Telegram Handle</label>
              <input
                type="text"
                value={settings.supportTelegram || ''}
                onChange={(e) => handleChange('supportTelegram', e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-google-blue"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Telebirr Payment Gateway */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-google-sm space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-5 h-5 text-telebirr" />
              <h2 className="font-bold text-sm text-gray-900">Telebirr Payment Integration</h2>
            </div>
            <span className="text-[11px] text-gray-500 font-mono">Telebirr ETB</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Telebirr Receiver Name</label>
              <input
                type="text"
                value={settings.telebirrReceiverName || ''}
                onChange={(e) => handleChange('telebirrReceiverName', e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-google-blue"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Telebirr Receiver Phone</label>
              <input
                type="text"
                value={settings.telebirrReceiverPhone || ''}
                onChange={(e) => handleChange('telebirrReceiverPhone', e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-google-blue"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Merchant Shortcode / Account</label>
              <input
                type="text"
                value={settings.telebirrShortCode || ''}
                onChange={(e) => handleChange('telebirrShortCode', e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-mono border border-gray-300 rounded-xl focus:ring-2 focus:ring-google-blue"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">USSD Template String</label>
              <input
                type="text"
                value={settings.telebirrUssdCode || ''}
                onChange={(e) => handleChange('telebirrUssdCode', e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-mono border border-gray-300 rounded-xl focus:ring-2 focus:ring-google-blue"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3 bg-blue-50/70 p-3.5 rounded-2xl border border-blue-100">
            <input
              type="checkbox"
              id="telebirrDevMode"
              checked={settings.telebirrDevMode === true || settings.telebirrDevMode === 'true'}
              onChange={(e) => handleChange('telebirrDevMode', e.target.checked)}
              className="w-4 h-4 text-google-blue rounded focus:ring-google-blue"
            />
            <label htmlFor="telebirrDevMode" className="text-xs text-gray-800 cursor-pointer">
              <b className="block">Enable Sandbox / Dev Simulation Mode</b>
              <span>Allows rapid testing of customer checkout and admin manual reference verification without needing live Telebirr RSA credentials.</span>
            </label>
          </div>
        </div>

        {/* Section 3: Telegram Bot Credentials */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-google-sm space-y-5">
          <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
            <Send className="w-5 h-5 text-google-blue" />
            <h2 className="font-bold text-sm text-gray-900">Telegram Bot Notifications</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Telegram Bot Token</label>
              <input
                type="password"
                value={settings.telegramBotToken || ''}
                onChange={(e) => handleChange('telegramBotToken', e.target.value)}
                placeholder="123456789:ABCDef..."
                className="w-full px-3.5 py-2 text-xs font-mono border border-gray-300 rounded-xl focus:ring-2 focus:ring-google-blue"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Admin Telegram Chat ID</label>
              <input
                type="text"
                value={settings.telegramAdminChatId || ''}
                onChange={(e) => handleChange('telegramAdminChatId', e.target.value)}
                placeholder="e.g. 123456789"
                className="w-full px-3.5 py-2 text-xs font-mono border border-gray-300 rounded-xl focus:ring-2 focus:ring-google-blue"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-google-blue hover:bg-google-blue-hover disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-google-sm transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Settings...' : 'Save All Settings'}</span>
          </button>
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
