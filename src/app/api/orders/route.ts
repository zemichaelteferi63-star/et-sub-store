import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateOrderNumber, generateAccessToken } from '@/lib/utils';
import { getAdminSession } from '@/lib/auth';
import { TelegramService } from '@/lib/telegram/telegramService';
import { getSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  try {
    const body = await request.json();
    const { customerName, customerPhone, customerTelegram, productId, transactionId, language = 'en' } = body;

    console.log(`[${requestId}] [1/6] Registration submission received:`, {
      customerName,
      customerPhone,
      customerTelegram,
      productId,
      transactionId,
    });

    if (!customerName || !customerPhone || !productId) {
      console.warn(`[${requestId}] [VALIDATION_FAILED] Missing required fields`);
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
      console.warn(`[${requestId}] [PRODUCT_NOT_FOUND] Product ID ${productId} unavailable`);
      return NextResponse.json({ error: 'Selected product is unavailable' }, { status: 404 });
    }

    console.log(`[${requestId}] [2/6] Validation completed. Product found: ${product.nameEn} (${product.priceETB} ETB)`);

    const cleanTxId = transactionId ? transactionId.trim().toUpperCase() : null;
    const orderNumber = generateOrderNumber();
    const accessToken = generateAccessToken();
    const paymentStatus = cleanTxId ? 'PAYMENT_PROCESSING' : 'PENDING';

    console.log(`[${requestId}] [3/6] Database write started for Order #${orderNumber}...`);

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
        transactionId: cleanTxId,
        paymentStatus,
        orderStatus: 'PENDING',
      },
      include: {
        product: true,
      },
    });

    if (!order || !order.id) {
      console.error(`[${requestId}] [DB_WRITE_FAILED] Database returned empty record`);
      return NextResponse.json({ error: 'Database write failed. Order could not be created.' }, { status: 500 });
    }

    console.log(`[${requestId}] [4/6] Database write completed successfully. Database Record ID: ${order.id}`);

    // Log creation
    await prisma.auditLog.create({
      data: {
        orderId: order.id,
        action: 'ORDER_CREATED',
        details: `Order #${orderNumber} (ID: ${order.id}) created for ${customerName} (${product.nameEn}, ${product.priceETB} ETB). Telebirr Ref: ${transactionId || 'None'}`,
        performedBy: 'CUSTOMER',
      },
    });

    console.log(`[${requestId}] [5/6] Audit log created.`);

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

    console.log(`[${requestId}] [6/6] Success response sent to client with Database ID ${order.id}`);

    return NextResponse.json({
      success: true,
      id: order.id,
      orderNumber: order.orderNumber,
      accessToken: order.accessToken,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      amountETB: order.amountETB,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt,
      redirectUrl: `/orders/${order.orderNumber}?token=${order.accessToken}`,
    });
  } catch (error: any) {
    console.error(`[${requestId}] [CRITICAL_ERROR] Order creation failed:`, error);
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
