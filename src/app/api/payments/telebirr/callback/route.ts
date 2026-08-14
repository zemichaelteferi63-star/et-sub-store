import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getPaymentProvider } from '@/lib/payment';
import { TelegramService } from '@/lib/telegram/telegramService';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const provider = getPaymentProvider('TELEBIRR');

    const result = await provider.handleWebhook(payload);

    if (result.success && result.transactionId) {
      // Find order and update
      const order = await prisma.order.findUnique({
        where: { orderNumber: payload.orderNumber },
        include: { product: true },
      });

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: 'PAID',
            transactionId: result.transactionId,
            orderStatus: order.orderStatus === 'PENDING' ? 'PROCESSING' : order.orderStatus,
          },
        });

        await prisma.auditLog.create({
          data: {
            orderId: order.id,
            action: 'TELEBIRR_WEBHOOK_VERIFIED',
            details: `Automated Telebirr payment verified via webhook (Txn: ${result.transactionId})`,
            performedBy: 'TELEBIRR_WEBHOOK',
          },
        });

        if (order.customerTelegram) {
          const origin = request.nextUrl.origin || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
          const orderUrl = `${origin}/orders/${order.orderNumber}?token=${order.accessToken}`;

          await TelegramService.sendPaymentConfirmation(
            order.customerTelegram,
            {
              orderNumber: order.orderNumber,
              customerName: order.customerName,
              productName: order.product?.nameEn || 'Gemini AI Pro',
              amountETB: order.amountETB,
              orderUrl,
            },
            'am'
          );
        }
      }
    }

    return NextResponse.json({ code: 0, message: 'success' });
  } catch (error: any) {
    console.error('Telebirr webhook error:', error);
    return NextResponse.json({ code: 1, message: error.message }, { status: 500 });
  }
}
