import { Language } from '../i18n';

export interface TelegramOrderContext {
  orderNumber: string;
  customerName: string;
  productName: string;
  amountETB: number;
  activationLink?: string;
  orderUrl: string;
  transactionId?: string;
}

export function getPaymentConfirmationMessage(ctx: TelegramOrderContext, lang: Language = 'en'): string {
  if (lang === 'am') {
    return `✨ *የትዕዛዝ ክፍያ ተረጋግጧል* ✨\n\n` +
      `ሰላም *${ctx.customerName}*፣ ለትዕዛዝ ቁጥር *#${ctx.orderNumber}* ክፍያዎ በቴሌብር በተሳካ ሁኔታ ተረጋግጧል!\n\n` +
      `📦 *ምርት:* ${ctx.productName}\n` +
      `💰 *መጠን:* ${ctx.amountETB} ETB\n\n` +
      `የቴክኒክ ቡድናችን የደንበኝነት አክቲቬሽን ሊንክዎን በማዘጋጀት ላይ ነው። እንደተዘጋጀ ወዲያውኑ መልእክት ይደርስዎታል!\n\n` +
      `🔗 [የትዕዛዝ ገጽዎን ይመልከቱ](${ctx.orderUrl})\n\n` +
      `እርዳታ ይፈልጋሉ? @Et_substore_support`;
  }

  return `✨ *Payment Verified!* ✨\n\n` +
    `Hello *${ctx.customerName}*, your payment for order *#${ctx.orderNumber}* has been verified!\n\n` +
    `📦 *Product:* ${ctx.productName}\n` +
    `💰 *Amount:* ${ctx.amountETB} ETB\n\n` +
    `Your activation link is being prepared. You will receive it shortly!\n\n` +
    `🔗 [View Your Order](${ctx.orderUrl})\n\n` +
    `Need help? @Et_substore_support`;
}

export function getOrderProcessingMessage(ctx: TelegramOrderContext, lang: Language = 'en'): string {
  if (lang === 'am') {
    return `⚙️ *ትዕዛዝዎ በዝግጅት ላይ ነው*\n\n` +
      `የትዕዛዝ ቁጥር: *#${ctx.orderNumber}*\n` +
      `አክቲቬሽንዎን እያዘጋጀን ነው። በጥቂት ደቂቃዎች ውስጥ ይደርስዎታል።\n\n` +
      `🔗 [የትዕዛዝ ገጽ](${ctx.orderUrl})\n\n` +
      `ድጋፍ: @Et_substore_support`;
  }

  return `⚙️ *Your Order is Processing*\n\n` +
    `Order Number: *#${ctx.orderNumber}*\n` +
    `Your subscription activation is currently being prepared. You will receive the direct activation link in a few minutes.\n\n` +
    `🔗 [Track Order](${ctx.orderUrl})\n\n` +
    `Support: @Et_substore_support`;
}

export function getActivationDeliveredMessage(ctx: TelegramOrderContext, lang: Language = 'en'): string {
  const link = ctx.activationLink || ctx.orderUrl;
  if (lang === 'am') {
    return `🎉 *የ ET-Sub Store ትዕዛዝዎ ዝግጁ ነው!* 🎉\n\n` +
      `📦 *ምርት:* ${ctx.productName}\n` +
      `🧾 *ትዕዛዝ ቁጥር:* #${ctx.orderNumber}\n\n` +
      `🔗 *የአክቲቬሽን ሊንክ:*\n${link}\n\n` +
      `ℹ️ *ማሳሰቢያ: የአክቲቬሽን ሊንኩ ከተላከ በ 4 ሰዓታት ውስጥ ጥቅም ላይ መዋል አለበት። ካልሆነ ጊዜው ሊያልፍበት ይችላል።*\n\n` +
      `🔗 [የትዕዛዝ ገጽዎን ይክፈቱ](${ctx.orderUrl})\n\n` +
      `እርዳታ ይፈልጋሉ?\n@Et_substore_support`;
  }

  return `🎉 *Your ET-Sub Store order is ready!* 🎉\n\n` +
    `📦 *Product:* ${ctx.productName}\n` +
    `🧾 *Order:* #${ctx.orderNumber}\n\n` +
    `🔗 *Your activation link:*\n${link}\n\n` +
    `ℹ️ *Important: Please use the redeem link within 4 hours of receiving it.*\n\n` +
    `🔗 [Open Secure Order Page](${ctx.orderUrl})\n\n` +
    `Need help?\n@Et_substore_support`;
}

export function getExpiryReminderMessage(ctx: TelegramOrderContext, lang: Language = 'en'): string {
  if (lang === 'am') {
    return `⏰ *የሳብስክሪፕሽን ማስታወሻ*\n\n` +
      `ሰላም *${ctx.customerName}*፣ የትዕዛዝ ቁጥር *#${ctx.orderNumber}* (${ctx.productName}) ሳብስክሪፕሽንዎ ሊያበቃ ጥቂት ቀናት ቀርተውታል።\n\n` +
      `ያለማቋረጥ አገልግሎት ለማግኘት ዛሬውኑ ያድሱ!\n\n` +
      `🔗 [ሳብስክሪፕሽን ለማደስ እዚህ ይጫኑ](${ctx.orderUrl})\n\n` +
      `ድጋፍ: @Et_substore_support`;
  }

  return `⏰ *Subscription Expiry Reminder*\n\n` +
    `Hello *${ctx.customerName}*, your subscription for order *#${ctx.orderNumber}* (${ctx.productName}) is approaching its expiry date.\n\n` +
    `Renew now to continue enjoying uninterrupted access!\n\n` +
    `🔗 [Renew Subscription](${ctx.orderUrl})\n\n` +
    `Support: @Et_substore_support`;
}

export function getAdminNewOrderAlert(ctx: TelegramOrderContext & { phone: string }): string {
  return `🚨 *NEW ORDER CREATED — ET-Sub Store* 🚨\n\n` +
    `🧾 *Order:* #${ctx.orderNumber}\n` +
    `👤 *Customer:* ${ctx.customerName}\n` +
    `📞 *Phone:* ${ctx.phone}\n` +
    `📦 *Product:* ${ctx.productName}\n` +
    `💰 *Amount:* ${ctx.amountETB} ETB\n` +
    `🔢 *Telebirr Ref:* ${ctx.transactionId || 'Pending'}\n\n` +
    `👉 [Open Admin Dashboard to Fulfill](${ctx.orderUrl})`;
}

export function getAdminPaymentReceivedAlert(ctx: TelegramOrderContext & { phone: string }): string {
  return `💰 *PAYMENT REFERENCE SUBMITTED* 💰\n\n` +
    `🧾 *Order:* #${ctx.orderNumber}\n` +
    `👤 *Customer:* ${ctx.customerName} (${ctx.phone})\n` +
    `💵 *Amount:* ${ctx.amountETB} ETB\n` +
    `🔖 *Telebirr Txn ID:* \`${ctx.transactionId || 'N/A'}\`\n\n` +
    `👉 [Verify Payment in Dashboard](${ctx.orderUrl})`;
}
