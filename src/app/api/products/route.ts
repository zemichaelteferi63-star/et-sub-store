import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';

    let whereClause = {};
    if (!all) {
      whereClause = { isActive: true };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    const slug = `${nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;

    const product = await prisma.product.create({
      data: {
        slug,
        nameEn,
        nameAm,
        descEn,
        descAm,
        duration,
        durationAm,
        priceETB: Number(priceETB),
        badge: badge || null,
        featuresEn: featuresEn || '[]',
        featuresAm: featuresAm || '[]',
        isActive: isActive !== false,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'PRODUCT_CREATED',
        details: `Created product "${nameEn}" with price ${priceETB} ETB`,
        performedBy: session.email,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
