import { NextRequest, NextResponse } from 'next/server';
import { getSettings, updateSetting } from '@/lib/settings';
import { getAdminSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json({ settings });
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
    const allowedKeys = [
      'storeName',
      'supportPhone',
      'supportTelegram',
      'currency',
      'telebirrReceiverName',
      'telebirrReceiverPhone',
      'telebirrShortCode',
      'telebirrUssdCode',
      'telebirrDevMode',
      'telebirrQrUrl',
      'customRequestTitleEn',
      'customRequestTitleAm',
      'customRequestDescEn',
      'customRequestDescAm',
      'customRequestButtonEn',
      'customRequestButtonAm',
      'telegramBotToken',
      'telegramAdminChatId',
    ];

    for (const key of allowedKeys) {
      if (body[key] !== undefined) {
        await updateSetting(key, String(body[key]));
      }
    }

    await prisma.auditLog.create({
      data: {
        action: 'SETTINGS_UPDATED',
        details: 'Store settings updated by admin',
        performedBy: session.email,
      },
    });

    const updatedSettings = await getSettings();
    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
