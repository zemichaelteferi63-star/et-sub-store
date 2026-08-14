import { getSettings } from '../settings';
import {
  TelegramOrderContext,
  getPaymentConfirmationMessage,
  getOrderProcessingMessage,
  getActivationDeliveredMessage,
  getExpiryReminderMessage,
  getAdminNewOrderAlert,
  getAdminPaymentReceivedAlert,
} from './templates';
import { Language } from '../i18n';

export class TelegramService {
  private static async sendMessage(chatId: string | number, text: string, tokenOverride?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const settings = await getSettings();
      const botToken = tokenOverride || settings.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN;

      if (!botToken || botToken.includes('ExampleBotTokenPlaceholder')) {
        console.log(`[TelegramService Mock] Would send to ${chatId}: \n${text}`);
        return { success: true };
      }

      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'Markdown',
          disable_web_page_preview: false,
        }),
      });

      const data = await response.json();
      if (!data.ok) {
        console.error('[TelegramService Error]', data);
        return { success: false, error: data.description };
      }

      return { success: true };
    } catch (err: any) {
      console.error('[TelegramService Exception]', err);
      return { success: false, error: err.message };
    }
  }

  static async sendPaymentConfirmation(chatIdOrUsername: string, ctx: TelegramOrderContext, lang: Language = 'en') {
    const text = getPaymentConfirmationMessage(ctx, lang);
    return this.sendMessage(chatIdOrUsername, text);
  }

  static async sendOrderProcessing(chatIdOrUsername: string, ctx: TelegramOrderContext, lang: Language = 'en') {
    const text = getOrderProcessingMessage(ctx, lang);
    return this.sendMessage(chatIdOrUsername, text);
  }

  static async sendActivationLink(chatIdOrUsername: string, ctx: TelegramOrderContext, lang: Language = 'en') {
    const text = getActivationDeliveredMessage(ctx, lang);
    return this.sendMessage(chatIdOrUsername, text);
  }

  static async sendExpiryReminder(chatIdOrUsername: string, ctx: TelegramOrderContext, lang: Language = 'en') {
    const text = getExpiryReminderMessage(ctx, lang);
    return this.sendMessage(chatIdOrUsername, text);
  }

  static async notifyAdminNewOrder(ctx: TelegramOrderContext & { phone: string }) {
    const settings = await getSettings();
    const adminChatId = settings.telegramAdminChatId || process.env.TELEGRAM_ADMIN_CHAT_ID;
    if (!adminChatId) return { success: true };
    const text = getAdminNewOrderAlert(ctx);
    return this.sendMessage(adminChatId, text);
  }

  static async notifyAdminPaymentReceived(ctx: TelegramOrderContext & { phone: string }) {
    const settings = await getSettings();
    const adminChatId = settings.telegramAdminChatId || process.env.TELEGRAM_ADMIN_CHAT_ID;
    if (!adminChatId) return { success: true };
    const text = getAdminPaymentReceivedAlert(ctx);
    return this.sendMessage(adminChatId, text);
  }
}
