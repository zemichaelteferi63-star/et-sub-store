import React from 'react';
import { headers } from 'next/headers';
import { getAdminSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import AdminSidebar from '@/components/AdminSidebar';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || '';

  // Never render sidebar on the login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const session = await getAdminSession();
  if (!session) {
    return <>{children}</>;
  }

  const pendingOrdersCount = await prisma.order.count({
    where: {
      orderStatus: { in: ['PENDING', 'PROCESSING'] },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminSidebar
        pendingOrdersCount={pendingOrdersCount}
        adminName={session.name}
      />
      <div className="flex-1 flex flex-col overflow-x-hidden min-h-screen">
        {children}
      </div>
    </div>
  );
}
