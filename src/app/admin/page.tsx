import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import AdminHeader from '@/components/AdminHeader';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import { formatETB, formatDate } from '@/lib/utils';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  // Fetch metrics in parallel
  const [
    totalOrders,
    paidOrders,
    pendingOrders,
    deliveredOrders,
    activeSubscriptions,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { paymentStatus: 'PAID' } }),
    prisma.order.count({ where: { orderStatus: { in: ['PENDING', 'PROCESSING'] } } }),
    prisma.order.count({ where: { orderStatus: 'DELIVERED' } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: { product: true },
    }),
  ]);

  const safeRecentOrders = Array.isArray(recentOrders) ? recentOrders : [];
  const revenueAgg = await prisma.order.aggregate({
    _sum: { amountETB: true },
    where: { paymentStatus: 'PAID' },
  });
  const totalRevenueETB = revenueAgg?._sum?.amountETB || 0;

  const metrics = [
    {
      title: 'Total Revenue',
      value: formatETB(totalRevenueETB),
      icon: <DollarSign className="w-5 h-5 text-google-green" />,
      bg: 'bg-green-50',
      border: 'border-green-100',
    },
    {
      title: 'Total Orders',
      value: (totalOrders || 0).toString(),
      icon: <ShoppingBag className="w-5 h-5 text-google-blue" />,
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      title: 'Pending Fulfillment',
      value: (pendingOrders || 0).toString(),
      icon: <Clock className="w-5 h-5 text-amber-500" />,
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
    {
      title: 'Delivered Subscriptions',
      value: (deliveredOrders || 0).toString(),
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      title: 'Paid Orders',
      value: (paidOrders || 0).toString(),
      icon: <TrendingUp className="w-5 h-5 text-purple-600" />,
      bg: 'bg-purple-50',
      border: 'border-purple-100',
    },
    {
      title: 'Active Subscription Plans',
      value: (activeSubscriptions || 0).toString(),
      icon: <Layers className="w-5 h-5 text-sky-600" />,
      bg: 'bg-sky-50',
      border: 'border-sky-100',
    },
  ];

  return (
    <div className="flex-1 space-y-8">
      <AdminHeader
        title="Dashboard Overview"
        subtitle="Real-time orders, Telebirr payments, and activation fulfillment status."
        adminEmail={session.email}
      />

      <div className="px-6 space-y-8 max-w-7xl">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-gray-200 shadow-google-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {m.title}
                </span>
                <div className={`w-10 h-10 rounded-2xl ${m.bg} ${m.border} border flex items-center justify-center`}>
                  {m.icon}
                </div>
              </div>
              <div className="font-display font-black text-2xl sm:text-3xl text-gray-900 tracking-tight">
                {m.value}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-google-sm overflow-hidden space-y-4">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-gray-900">Recent Customer Orders</h2>
              <p className="text-xs text-gray-500">Latest orders placed via Telebirr</p>
            </div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-xs font-bold text-google-blue hover:underline"
            >
              <span>View All Orders</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-400 uppercase font-semibold text-[10px] tracking-wider border-y border-gray-100">
                <tr>
                  <th className="px-6 py-3">Order Number</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Payment</th>
                  <th className="px-6 py-3">Order Status</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {safeRecentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-400">
                      No orders recorded yet.
                    </td>
                  </tr>
                ) : (
                  safeRecentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-gray-900">
                        #{ord.orderNumber}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-800 block">{ord.customerName}</span>
                        <span className="text-gray-400 font-mono text-[11px]">{ord.customerPhone}</span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-700">
                        {ord.product?.nameEn || 'Gemini AI Pro'}
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-gray-900">
                        {formatETB(ord.amountETB)}
                      </td>
                      <td className="px-6 py-4">
                        <OrderStatusBadge status={ord.paymentStatus} type="payment" />
                      </td>
                      <td className="px-6 py-4">
                        <OrderStatusBadge status={ord.orderStatus} />
                      </td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                        {formatDate(ord.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/orders?search=${ord.orderNumber}`}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-google-blue hover:text-white rounded-lg font-semibold text-gray-700 transition-colors"
                        >
                          Fulfill
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
