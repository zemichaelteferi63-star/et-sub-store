'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AdminHeader from '@/components/AdminHeader';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import OrderDetailModal from '@/components/OrderDetailModal';
import Toast from '@/components/Toast';
import { formatETB, formatDate } from '@/lib/utils';
import {
  Search,
  RefreshCw,
  Send,
  ShoppingBag,
} from 'lucide-react';

function AdminOrdersContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const fetchOrders = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load orders');

      const fetched = data.orders || [];
      setAllOrders(fetched);

      // Auto-open modal if search param exists
      if (initialSearch && fetched.length > 0) {
        const exact = fetched.find((o: any) => o.orderNumber === initialSearch);
        if (exact) setSelectedOrder(exact);
      }
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders(true);
  }, []);

  // Calculate counts dynamically from allOrders
  const counts = useMemo(() => {
    return {
      all: allOrders.length,
      pending: allOrders.filter((o) => o.orderStatus === 'PENDING').length,
      verified: allOrders.filter((o) => ['VERIFIED', 'PROCESSING'].includes(o.orderStatus)).length,
      sending: allOrders.filter((o) => o.orderStatus === 'SENDING').length,
      sent: allOrders.filter((o) => ['SENT', 'DELIVERED'].includes(o.orderStatus)).length,
    };
  }, [allOrders]);

  // Filter orders instantly in memory without network delay or flickering
  const filteredOrders = useMemo(() => {
    let result = [...allOrders];

    if (selectedStatus !== 'ALL') {
      if (selectedStatus === 'PENDING') {
        result = result.filter((o) => o.orderStatus === 'PENDING');
      } else if (selectedStatus === 'VERIFIED') {
        result = result.filter((o) => ['VERIFIED', 'PROCESSING'].includes(o.orderStatus));
      } else if (selectedStatus === 'SENDING') {
        result = result.filter((o) => o.orderStatus === 'SENDING');
      } else if (selectedStatus === 'SENT') {
        result = result.filter((o) => ['SENT', 'DELIVERED'].includes(o.orderStatus));
      } else {
        result = result.filter((o) => o.orderStatus === selectedStatus);
      }
    }

    if (searchTerm.trim()) {
      const s = searchTerm.trim().toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber?.toLowerCase().includes(s) ||
          o.customerName?.toLowerCase().includes(s) ||
          o.customerPhone?.includes(s) ||
          (o.customerTelegram && o.customerTelegram.toLowerCase().includes(s)) ||
          (o.transactionId && o.transactionId.toLowerCase().includes(s))
      );
    }

    return result;
  }, [allOrders, selectedStatus, searchTerm]);

  const statusFilters = [
    { label: 'All Orders', value: 'ALL', count: counts.all },
    { label: 'Pending / Unverified', value: 'PENDING', count: counts.pending },
    { label: 'Verified', value: 'VERIFIED', count: counts.verified },
    { label: 'Sending', value: 'SENDING', count: counts.sending },
    { label: 'Sent & Delivered', value: 'SENT', count: counts.sent },
  ];

  return (
    <div className="flex-1 space-y-6">
      <AdminHeader
        title="Order Management"
        subtitle="Manage customer orders, verify Telebirr payments, and deliver supplier activation links."
      >
        <button
          onClick={() => fetchOrders(false)}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-google-blue' : 'text-gray-500'}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </AdminHeader>

      <div className="px-6 space-y-6 max-w-7xl">
        
        {/* Controls: Search Bar & Status Filter Tabs */}
        <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-google-sm space-y-4">
          
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Order #, Customer Name, Phone, or Telebirr Ref..."
                className="w-full pl-10 pr-4 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-google-blue focus:border-google-blue"
              />
            </div>
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="text-xs font-bold text-gray-500 hover:text-gray-900 px-3 py-2 bg-gray-100 rounded-xl"
              >
                Clear Search
              </button>
            )}
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-gray-100 pt-3 text-xs">
            {statusFilters.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedStatus(tab.value)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                  selectedStatus === tab.value
                    ? 'bg-google-blue text-white shadow-xs'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 text-[11px] rounded-full font-mono ${
                    selectedStatus === tab.value
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-google-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-400 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5">Order Number</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Product</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">Payment</th>
                  <th className="px-6 py-3.5">Order Status</th>
                  <th className="px-6 py-3.5">Telebirr Ref</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-google-blue border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading orders...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <ShoppingBag className="w-8 h-8 text-gray-300" />
                        <span className="font-semibold text-gray-600">No orders recorded in this filter.</span>
                        <p className="text-xs text-gray-400">Orders submitted by customers via Telebirr checkout will automatically appear here.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-gray-900">
                        #{ord.orderNumber}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900 block">{ord.customerName}</span>
                        <div className="flex flex-col gap-1 text-gray-500 text-[11px] font-mono mt-1">
                          <span>📞 {ord.customerPhone}</span>
                          {ord.customerTelegram ? (
                            <span className="inline-block font-mono text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded border border-gray-200 w-fit">
                              @{ord.customerTelegram.replace('@', '')}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-[11px]">
                              No Telegram
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {ord.product?.nameEn || ord.productId}
                      </td>
                      <td className="px-6 py-4 font-mono font-black text-gray-900">
                        {formatETB(ord.amountETB)}
                      </td>
                      <td className="px-6 py-4">
                        <OrderStatusBadge status={ord.paymentStatus} type="payment" />
                      </td>
                      <td className="px-6 py-4">
                        <OrderStatusBadge status={ord.orderStatus} />
                      </td>
                      <td className="px-6 py-4 font-mono text-[11px] text-gray-700">
                        {ord.transactionId ? (
                          <span className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200 font-bold">
                            {ord.transactionId}
                          </span>
                        ) : (
                          <span className="text-gray-400">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                        {formatDate(ord.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-google-blue hover:bg-google-blue-hover text-white rounded-xl font-bold shadow-xs transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{ord.orderStatus === 'DELIVERED' || ord.orderStatus === 'SENT' ? 'View / Edit' : 'Fulfill'}</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Order Detail & Fulfillment Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onRefresh={() => {
            fetchOrders(false);
            setSelectedOrder(null);
          }}
          onShowToast={(msg, type) => setToast({ message: msg, type: type || 'success' })}
        />
      )}

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

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Loading Orders...</div>}>
      <AdminOrdersContent />
    </Suspense>
  );
}
