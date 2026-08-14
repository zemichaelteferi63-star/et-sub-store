const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial EthioGemini store data...');

  // 1. Create Default Admin
  const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@ethiogemini.com';
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@EthioGemini2026!';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      name: 'EthioGemini Admin',
      passwordHash,
      role: 'SUPER_ADMIN',
    },
  });
  console.log(`✓ Admin user created/verified: ${admin.email}`);

  // 2. Create Initial Subscription Products
  const products = [
    {
      slug: 'gemini-pro-1-month',
      nameEn: 'Gemini AI Pro',
      nameAm: 'Gemini AI Pro',
      descEn: 'Official Google AI Pro 1-Month activation for personal and professional AI workflows.',
      descAm: 'የ 1 ወር ይፋዊ የ Google AI Pro አክቲቬሽን ለስራ እና ለፈጠራ አገልግሎት።',
      duration: '1 Month',
      durationAm: '1 ወር',
      priceETB: 300,
      badge: null,
      featuresEn: JSON.stringify([
        'Gemini AI access',
        'Activation link delivery',
        'Telegram delivery',
        'Customer support',
        'Simple ETB payment',
      ]),
      featuresAm: JSON.stringify([
        'የ Gemini AI ሙሉ አጠቃቀም',
        'የአክቲቬሽን ሊንክ ማድረሻ',
        'የቴሌግራም ፈጣን ማድረሻ',
        'የደንበኞች ድጋፍ',
        'ቀላል የኢትዮጵያ ብር ክፍያ',
      ]),
      isActive: true,
      sortOrder: 1,
    },
    {
      slug: 'gemini-pro-3-months',
      nameEn: 'Gemini AI Pro — Quarterly',
      nameAm: 'Gemini AI Pro — የ 3 ወር',
      descEn: '3-Month Gemini AI Pro access with priority processing and uninterrupted AI capabilities.',
      descAm: 'የ 3 ወር የ Gemini AI Pro አገልግሎት ያለማቋረጥ ለተጠቃሚዎች።',
      duration: '3 Months',
      durationAm: '3 ወር',
      priceETB: 850,
      badge: 'Popular',
      featuresEn: JSON.stringify([
        '3 Months uninterrupted Gemini AI access',
        'Immediate activation link delivery',
        'Dedicated Telegram support',
        '2M Token context window & coding features',
        'Telebirr payment in ETB',
      ]),
      featuresAm: JSON.stringify([
        'የ 3 ወር ያልተቋረጠ የ Gemini AI አገልግሎት',
        'ፈጣን የአክቲቬሽን ሊንክ ማድረሻ',
        'የተዘጋጀ የቴሌግራም ድጋፍ',
        '2 ሚሊዮን ቶከን ኮንቴክስት እና ኮዲንግ',
        'በቴሌብር የብር ክፍያ',
      ]),
      isActive: true,
      sortOrder: 2,
    },
    {
      slug: 'gemini-pro-1-year',
      nameEn: 'Gemini AI Pro — Annual',
      nameAm: 'Gemini AI Pro — የ 1 ዓመት',
      descEn: 'Full 1-Year Gemini AI Pro plan with maximum savings for developers and businesses.',
      descAm: 'የ 1 ዓመት ሙሉ የ Gemini AI Pro እቅድ ከፍተኛ ቅናሽ ያለው ለዴቨሎፐሮች እና ድርጅቶች።',
      duration: '1 Year',
      durationAm: '1 ዓመት',
      priceETB: 3200,
      badge: 'Best Value',
      featuresEn: JSON.stringify([
        'Full 1 Year Gemini 1.5 Pro access',
        'Max savings (Save over 400 ETB)',
        'Priority supplier link fulfillment',
        '24/7 Ethiopian VIP support',
        'Instant Telebirr receipt',
      ]),
      featuresAm: JSON.stringify([
        'የ 1 ሙሉ ዓመት የ Gemini 1.5 Pro አጠቃቀም',
        'ከፍተኛ ቅናሽ (ከ 400 ብር በላይ ቁጠባ)',
        'ቅድሚያ የሚሰጠው የአክቲቬሽን ማድረሻ',
        '24/7 የኢትዮጵያ VIP ድጋፍ',
        'ፈጣን የቴሌብር ደረሰኝ',
      ]),
      isActive: true,
      sortOrder: 3,
    },
  ];

  for (const prod of products) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: prod,
      create: prod,
    });
  }
  console.log(`✓ Products seeded (${products.length} subscriptions created)`);

  // 3. Create Default Settings
  const settings = [
    { key: 'storeName', value: 'EthioGemini' },
    { key: 'supportPhone', value: '+251 91 123 4567' },
    { key: 'supportTelegram', value: 'EthioGeminiSupport' },
    { key: 'currency', value: 'ETB' },
    { key: 'telebirrReceiverName', value: 'EthioGemini AI Services' },
    { key: 'telebirrReceiverPhone', value: '+251 91 123 4567' },
    { key: 'telebirrShortCode', value: '999888' },
    { key: 'telebirrUssdCode', value: '*127*1*999888*AMOUNT*PIN#' },
    { key: 'telebirrDevMode', value: 'true' },
    { key: 'customRequestTitleEn', value: 'Looking for another subscription?' },
    { key: 'customRequestTitleAm', value: 'ሌላ ሳብስክሪፕሽን ይፈልጋሉ?' },
    { key: 'customRequestDescEn', value: "Don't see what you're looking for? Send us a message on Telegram and tell us which subscription you need (ChatGPT Plus, Claude Pro, Midjourney, Cursor, Canva, etc.)." },
    { key: 'customRequestDescAm', value: 'የሚፈልጉትን ሳብስክሪፕሽን አላገኙም? በቴሌግራም መልእክት ይላኩልን እና የሚፈልጉትን ሳብስክሪፕሽን ይንገሩን (ChatGPT Plus, Claude Pro, Midjourney, Cursor, Canva, ወዘተ)።' },
    { key: 'customRequestButtonEn', value: 'Message Us on Telegram' },
    { key: 'customRequestButtonAm', value: 'በቴሌግራም ያናግሩን' },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }
  console.log(`✓ Store & Telebirr settings initialized`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
