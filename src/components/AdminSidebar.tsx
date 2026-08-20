'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  Settings,
  History,
  LogOut,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export default function AdminSidebar({
  pendingOrdersCount = 0,
  adminName = 'Admin',
}: {
  pendingOrdersCount?: number;
  adminName?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      router.push('/admin/login');
    }
  };

  const navItems = [
    {
      name: 'Overview',
      href: '/admin',
      icon: <LayoutDashboard className="w-4 h-4" />,
      exact: true,
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: <ShoppingBag className="w-4 h-4" />,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
    },
    {
      name: 'Subscriptions & Products',
      href: '/admin/products',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      name: 'Store & Payment Settings',
      href: '/admin/settings',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between min-h-screen">
      {/* Top Brand */}
      <div>
        <div className="p-6 border-b border-gray-100">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-google-blue via-google-green to-google-yellow flex items-center justify-center p-0.5 shadow-sm">
              <div className="w-full h-full bg-white rounded-[8px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-google-blue" />
              </div>
            </div>
            <div>
              <span className="font-display font-bold text-base text-gray-900 block leading-tight">
                ET-Sub <span className="text-google-blue">Store</span>
              </span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Admin Control
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-google-blue text-white shadow-google-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive ? 'bg-white text-google-blue' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Info & Logout */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Store</span>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
