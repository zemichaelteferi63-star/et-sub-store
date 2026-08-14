import React from 'react';
import { redirect } from 'next/navigation';
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
  const session = await getAdminSession();
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || '';

  // Allow login page through without redirect loop
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
