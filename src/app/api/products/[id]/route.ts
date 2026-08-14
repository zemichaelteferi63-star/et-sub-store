import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const {
      nameEn,
      nameAm,
      descEn,
      descAm,
      duration,
      durationAm,
      priceETB,
      badge,
      featuresEn,
      featuresAm,
      isActive,
    } = body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        nameEn,
        nameAm,
        descEn,
        descAm,
        duration,
        durationAm,
        priceETB: Number(priceETB),
        badge: badge || null,
        featuresEn: typeof featuresEn === 'string' ? featuresEn : JSON.stringify(featuresEn),
        featuresAm: typeof featuresAm === 'string' ? featuresAm : JSON.stringify(featuresAm),
        isActive: isActive !== false,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'PRODUCT_UPDATED',
        details: `Updated product "${nameEn}" (Price: ${priceETB} ETB, Active: ${isActive})`,
        performedBy: session.email,
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    await prisma.product.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        action: 'PRODUCT_DELETED',
        details: `Deleted product ID ${id}`,
        performedBy: session.email,
      },
    });

    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
