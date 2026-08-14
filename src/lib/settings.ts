import prisma from './prisma';

export interface StoreSettings {
  storeName: string;
  supportPhone: string;
  supportTelegram: string;
  currency: string;
  telebirrReceiverName: string;
  telebirrReceiverPhone: string;
  telebirrDevMode: boolean;
  telebirrQrUrl?: string;
  customRequestTitleEn: string;
  customRequestTitleAm: string;
  customRequestDescEn: string;
  customRequestDescAm: string;
  customRequestButtonEn: string;
  customRequestButtonAm: string;
  telegramBotToken?: string;
  telegramAdminChatId?: string;
}

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'ET-Sub Store',
  supportPhone: '+251988788834',
  supportTelegram: 'Et_substore_support',
  currency: 'ETB',
  telebirrReceiverName: 'ET-Sub Store AI Services',
  telebirrReceiverPhone: '+251988788834',
  telebirrDevMode: true,
  telebirrQrUrl: '',
  customRequestTitleEn: 'Looking for another subscription?',
  customRequestTitleAm: 'ሌላ ሳብስክሪፕሽን ይፈልጋሉ?',
  customRequestDescEn: "Don't see what you're looking for? Send us a message on Telegram and tell us which subscription you need.",
  customRequestDescAm: 'የሚፈልጉትን ሳብስክሪፕሽን አላገኙም? በቴሌግራም መልእክት ይላኩልን እና የሚፈልጉትን ሳብስክሪፕሽን ይንገሩን።',
  customRequestButtonEn: 'Message Us on Telegram',
  customRequestButtonAm: 'በቴሌግራም ያናግሩን',
};

export async function getSettings(): Promise<StoreSettings> {
  try {
    const settingsList = await prisma.setting.findMany();
    const settingsMap: Record<string, string> = {};
    for (const item of settingsList) {
      settingsMap[item.key] = item.value;
    }

    return {
      storeName: settingsMap['storeName'] || process.env.NEXT_PUBLIC_STORE_NAME || DEFAULT_SETTINGS.storeName,
      supportPhone: settingsMap['supportPhone'] || process.env.NEXT_PUBLIC_SUPPORT_PHONE || DEFAULT_SETTINGS.supportPhone,
      supportTelegram: settingsMap['supportTelegram'] || process.env.NEXT_PUBLIC_SUPPORT_TELEGRAM || DEFAULT_SETTINGS.supportTelegram,
      currency: settingsMap['currency'] || DEFAULT_SETTINGS.currency,
      telebirrReceiverName: settingsMap['telebirrReceiverName'] || process.env.TELEBIRR_RECEIVER_NAME || DEFAULT_SETTINGS.telebirrReceiverName,
      telebirrReceiverPhone: settingsMap['telebirrReceiverPhone'] || process.env.TELEBIRR_RECEIVER_PHONE || DEFAULT_SETTINGS.telebirrReceiverPhone,
      telebirrDevMode: settingsMap['telebirrDevMode'] !== undefined ? settingsMap['telebirrDevMode'] === 'true' : process.env.TELEBIRR_DEV_MODE === 'true',
      telebirrQrUrl: settingsMap['telebirrQrUrl'] || '',
      customRequestTitleEn: settingsMap['customRequestTitleEn'] || DEFAULT_SETTINGS.customRequestTitleEn,
      customRequestTitleAm: settingsMap['customRequestTitleAm'] || DEFAULT_SETTINGS.customRequestTitleAm,
      customRequestDescEn: settingsMap['customRequestDescEn'] || DEFAULT_SETTINGS.customRequestDescEn,
      customRequestDescAm: settingsMap['customRequestDescAm'] || DEFAULT_SETTINGS.customRequestDescAm,
      customRequestButtonEn: settingsMap['customRequestButtonEn'] || DEFAULT_SETTINGS.customRequestButtonEn,
      customRequestButtonAm: settingsMap['customRequestButtonAm'] || DEFAULT_SETTINGS.customRequestButtonAm,
      telegramBotToken: settingsMap['telegramBotToken'] || process.env.TELEGRAM_BOT_TOKEN,
      telegramAdminChatId: settingsMap['telegramAdminChatId'] || process.env.TELEGRAM_ADMIN_CHAT_ID,
    };
  } catch (error) {
    return DEFAULT_SETTINGS;
  }
}

export async function updateSetting(key: string, value: string): Promise<void> {
  await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}
