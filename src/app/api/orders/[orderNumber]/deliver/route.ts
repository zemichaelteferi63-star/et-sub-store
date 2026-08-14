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
    const body = await request.json();
    const { activationLink, adminNotes } = body;

    if (!activationLink || !activationLink.trim()) {
      return NextResponse.json({ error: 'Activation link is required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { product: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Business rule: Check payment verification
    if (order.paymentStatus !== 'PAID') {
      // Auto mark as paid if admin is delivering directly
      await prisma.order.update({
        where: { orderNumber },
        data: { paymentStatus: 'PAID' },
      });
    }

    const updated = await prisma.order.update({
      where: { orderNumber },
      data: {
        activationLink: activationLink.trim(),
        orderStatus: 'DELIVERED',
        deliveredAt: new Date(),
        deliveredBy: session.email,
        adminNotes: adminNotes !== undefined ? adminNotes : order.adminNotes,
      },
      include: { product: true },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        orderId: updated.id,
        action: 'ACTIVATION_DELIVERED',
        details: `Activation link delivered to customer by admin (${session.email})`,
        performedBy: session.email,
      },
    });

    // Dispatch Telegram message if customer provided Telegram username
    if (updated.customerTelegram) {
      const origin = request.nextUrl.origin || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const orderUrl = `${origin}/orders/${updated.orderNumber}?token=${updated.accessToken}`;

      await TelegramService.sendActivationLink(
        updated.customerTelegram,
        {
          orderNumber: updated.orderNumber,
          customerName: updated.customerName,
          productName: updated.product?.nameEn || 'Gemini AI Pro',
          amountETB: updated.amountETB,
          activationLink: updated.activationLink || undefined,
          orderUrl,
        },
        'am'
      );
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
