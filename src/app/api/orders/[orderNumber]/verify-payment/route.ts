import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { TelegramService } from '@/lib/telegram/telegramService';

export async function POST(
  request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderNumber } = params;

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { product: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updated = await prisma.order.update({
      where: { orderNumber },
      data: {
        paymentStatus: 'PAID',
        orderStatus: order.orderStatus === 'PENDING' ? 'PROCESSING' : order.orderStatus,
      },
      include: { product: true },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        orderId: updated.id,
        action: 'PAYMENT_VERIFIED',
        details: `Payment of ${updated.amountETB} ETB verified by admin (${session.email})`,
        performedBy: session.email,
      },
    });

    // Dispatch Telegram Confirmation if user has Telegram handle
    if (updated.customerTelegram) {
      const origin = request.nextUrl.origin || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const orderUrl = `${origin}/orders/${updated.orderNumber}?token=${updated.accessToken}`;

      await TelegramService.sendPaymentConfirmation(
        updated.customerTelegram,
        {
          orderNumber: updated.orderNumber,
          customerName: updated.customerName,
          productName: updated.product?.nameEn || 'Gemini AI Pro',
          amountETB: updated.amountETB,
          orderUrl,
        },
        'am' // Or send bilingual
      );
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
