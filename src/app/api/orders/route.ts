import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateOrderNumber, generateAccessToken } from '@/lib/utils';
import { getAdminSession } from '@/lib/auth';
import { TelegramService } from '@/lib/telegram/telegramService';
import { getSettings } from '@/lib/settings';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, customerTelegram, productId, transactionId, language = 'en' } = body;

    if (!customerName || !customerPhone || !productId) {
      return NextResponse.json(
        { error: 'Customer name, phone number, and selected product are required' },
        { status: 400 }
      );
    }

    // Lookup product in database to ensure price integrity
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isActive) {
      return NextResponse.json({ error: 'Selected product is unavailable' }, { status: 404 });
    }

    const orderNumber = generateOrderNumber();
    const accessToken = generateAccessToken();

    const paymentStatus = transactionId && transactionId.trim().length > 4 ? 'PAYMENT_PROCESSING' : 'PENDING';

    const order = await prisma.order.create({
      data: {
        orderNumber,
        accessToken,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerTelegram: customerTelegram ? customerTelegram.trim() : null,
        productId: product.id,
        amountETB: product.priceETB,
        currency: 'ETB',
        paymentMethod: 'TELEBIRR',
        transactionId: transactionId ? transactionId.trim().toUpperCase() : null,
        paymentStatus,
        orderStatus: 'PENDING',
      },
      include: {
        product: true,
      },
    });

    // Log creation
    await prisma.auditLog.create({
      data: {
        orderId: order.id,
        action: 'ORDER_CREATED',
        details: `Order #${orderNumber} created for ${customerName} (${product.nameEn}, ${product.priceETB} ETB). Telebirr Ref: ${transactionId || 'None'}`,
        performedBy: 'CUSTOMER',
      },
    });

    // Send Telegram Notification to Admin
    const origin = request.nextUrl.origin || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const adminOrderUrl = `${origin}/admin/orders?search=${orderNumber}`;

    await TelegramService.notifyAdminNewOrder({
      orderNumber,
      customerName: order.customerName,
      phone: order.customerPhone,
      productName: product.nameEn,
      amountETB: order.amountETB,
      transactionId: order.transactionId || undefined,
      orderUrl: adminOrderUrl,
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      accessToken: order.accessToken,
      paymentStatus: order.paymentStatus,
      redirectUrl: `/orders/${order.orderNumber}?token=${order.accessToken}`,
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim() || '';
    const status = searchParams.get('status')?.trim() || 'ALL';

    // Get all orders first to calculate category counts reliably
    const allOrders = await prisma.order.findMany({
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });

    const counts = {
      all: allOrders.length,
      pending: allOrders.filter((o) => o.orderStatus === 'PENDING').length,
      verified: allOrders.filter((o) => ['VERIFIED', 'PROCESSING'].includes(o.orderStatus)).length,
      sending: allOrders.filter((o) => o.orderStatus === 'SENDING').length,
      sent: allOrders.filter((o) => ['SENT', 'DELIVERED'].includes(o.orderStatus)).length,
    };

    let filtered = [...allOrders];

    // Status filtering
    if (status && status !== 'ALL') {
      if (status === 'PENDING') {
        filtered = filtered.filter((o) => o.orderStatus === 'PENDING');
      } else if (status === 'VERIFIED') {
        filtered = filtered.filter((o) => ['VERIFIED', 'PROCESSING'].includes(o.orderStatus));
      } else if (status === 'SENDING') {
        filtered = filtered.filter((o) => o.orderStatus === 'SENDING');
      } else if (status === 'SENT') {
        filtered = filtered.filter((o) => ['SENT', 'DELIVERED'].includes(o.orderStatus));
      } else {
        filtered = filtered.filter((o) => o.orderStatus === status);
      }
    }

    // Search term filtering
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(s) ||
          o.customerName.toLowerCase().includes(s) ||
          o.customerPhone.includes(s) ||
          (o.customerTelegram && o.customerTelegram.toLowerCase().includes(s)) ||
          (o.transactionId && o.transactionId.toLowerCase().includes(s))
      );
    }

    return NextResponse.json({ orders: filtered, counts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
