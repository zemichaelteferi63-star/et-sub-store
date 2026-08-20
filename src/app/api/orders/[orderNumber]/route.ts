import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const cleanOrderNumber = params.orderNumber?.trim().toUpperCase();
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    const session = await getAdminSession();

    const order = await prisma.order.findUnique({
      where: { orderNumber: cleanOrderNumber },
      include: {
        product: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerTelegram: order.customerTelegram,
        amountETB: order.amountETB,
        currency: order.currency,
        paymentMethod: order.paymentMethod,
        transactionId: order.transactionId,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        activationLink: order.orderStatus === 'DELIVERED' ? order.activationLink : null,
        deliveredAt: order.deliveredAt,
        createdAt: order.createdAt,
        product: order.product,
        adminNotes: session ? order.adminNotes : undefined,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
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
    const { adminNotes, orderStatus, paymentStatus, transactionId } = body;

    const dataToUpdate: any = {};
    if (adminNotes !== undefined) dataToUpdate.adminNotes = adminNotes;
    if (orderStatus !== undefined) dataToUpdate.orderStatus = orderStatus;
    if (paymentStatus !== undefined) dataToUpdate.paymentStatus = paymentStatus;
    if (transactionId !== undefined) dataToUpdate.transactionId = transactionId;

    const updated = await prisma.order.update({
      where: { orderNumber },
      data: dataToUpdate,
      include: { product: true },
    });

    await prisma.auditLog.create({
      data: {
        orderId: updated.id,
        action: 'ORDER_UPDATED',
        details: `Order updated by admin: ${JSON.stringify(dataToUpdate)}`,
        performedBy: session.email,
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
