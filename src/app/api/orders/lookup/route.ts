import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawCode = searchParams.get('code');
    const code = typeof rawCode === 'string' ? rawCode.trim().toUpperCase() : '';

    if (!code) {
      return NextResponse.json({ error: 'Tracking code is required' }, { status: 400 });
    }

    // Lookup order by exact orderNumber (e.g. ETS-8F42K9, GEM-20260814-7413, or suffix)
    const order = await prisma.order.findFirst({
      where: {
        orderNumber: code,
      },
      include: {
        product: true,
      },
    });

    if (!order) {
      // Also try searching if user typed code without ETS- prefix or with trailing spaces
      const fallbackOrder = await prisma.order.findFirst({
        where: {
          OR: [
            { orderNumber: `ETS-${code}` },
            { orderNumber: `GEM-${code}` },
          ],
        },
      });

      if (fallbackOrder) {
        return NextResponse.json({
          success: true,
          orderNumber: fallbackOrder.orderNumber,
          accessToken: fallbackOrder.accessToken,
        });
      }

      return NextResponse.json(
        { error: 'No order found matching this tracking code' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      accessToken: order.accessToken,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to lookup order' },
      { status: 500 }
    );
  }
}
