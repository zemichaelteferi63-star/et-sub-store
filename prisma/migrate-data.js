const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'dev-data.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// 1. Update Settings
db.settings = [
  { key: 'storeName', value: 'ET-Sub Store', updatedAt: new Date() },
  { key: 'supportPhone', value: '+251988788834', updatedAt: new Date() },
  { key: 'supportTelegram', value: 'Et_substore_support', updatedAt: new Date() },
  { key: 'currency', value: 'ETB', updatedAt: new Date() },
  { key: 'telebirrReceiverName', value: 'ET-Sub Store AI Services', updatedAt: new Date() },
  { key: 'telebirrReceiverPhone', value: '+251988788834', updatedAt: new Date() },
  { key: 'telebirrDevMode', value: 'true', updatedAt: new Date() },
  { key: 'customRequestTitleEn', value: 'Looking for another subscription?', updatedAt: new Date() },
  { key: 'customRequestTitleAm', value: 'ሌላ ሳብስክሪፕሽን ይፈልጋሉ?', updatedAt: new Date() },
  { key: 'customRequestDescEn', value: "Don't see what you're looking for? Send us a message on Telegram and tell us which subscription you need.", updatedAt: new Date() },
  { key: 'customRequestDescAm', value: 'የሚፈልጉትን ሳብስክሪፕሽን አላገኙም? በቴሌግራም መልእክት ይላኩልን እና የሚፈልጉትን ሳብስክሪፕሽን ይንገሩን።', updatedAt: new Date() },
  { key: 'customRequestButtonEn', value: 'Message Us on Telegram', updatedAt: new Date() },
  { key: 'customRequestButtonAm', value: 'በቴሌግራም ያናግሩን', updatedAt: new Date() }
];

// 2. Set up ET-Sub Store Products (Primary Gemini 18M 350 ETB + 6 More From Us Products)
db.products = [
  {
    id: 'prod-gemini-18m',
    slug: 'gemini-ai-pro-18m',
    nameEn: 'Gemini AI Pro',
    nameAm: 'Gemini AI Pro',
    descEn: 'Official Google AI Pro 18-Month activation. Access Gemini 1.5 Pro, 2M token context & Workspace AI.',
    descAm: 'የ 18 ወራት ይፋዊ የ Google AI Pro አክቲቬሽን። የ Gemini 1.5 Pro እና 2M ቶከን አጠቃቀም።',
    duration: '18 Months',
    durationAm: '18 ወር',
    priceETB: 350,
    badge: 'BEST DEAL',
    featuresEn: JSON.stringify([
      'Full 18 Months Gemini 1.5 Pro access',
      '2,000,000 Token context window',
      'Official redeem link delivery',
      'Dedicated Telegram customer support',
      'Convenient Telebirr payment in ETB'
    ]),
    featuresAm: JSON.stringify([
      'የ 18 ወራት ሙሉ የ Gemini 1.5 Pro አጠቃቀም',
      '2 ሚሊዮን ቶከን ኮንቴክስት እና ኮዲንግ',
      'ይፋዊ የአክቲቬሽን ሊንክ ማድረሻ',
      'ቀጥተኛ የቴሌግራም ደንበኞች ድጋፍ',
      'በቴሌብር ቀላል የብር ክፍያ'
    ]),
    imageUrl: null,
    isActive: true,
    isPrimary: true,
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-telegram-stars',
    slug: 'telegram-stars-50',
    nameEn: 'Telegram Stars',
    nameAm: 'Telegram Stars',
    descEn: '50 Telegram Stars for bot subscriptions, premium reactions, and digital goods on Telegram.',
    descAm: '50 የቴሌግራም ስታርስ ለቦቶች፣ ቻናሎች እና ዲጂታል ግብይቶች።',
    duration: '50 Stars',
    durationAm: '50 Stars',
    priceETB: 200,
    badge: 'Instant',
    featuresEn: JSON.stringify([
      '50 Official Telegram Stars',
      'Instant top-up to your Telegram username',
      'Use for Telegram Mini Apps & Gifts',
      'Fast processing with Telebirr'
    ]),
    featuresAm: JSON.stringify([
      '50 ይፋዊ የቴሌግራም ስታርስ',
      'በቴሌግራም ዩዘርኔም ፈጣን ክፍያ',
      'ለቦቶች እና ዲጂታል ግብይቶች',
      'በቴሌብር ፈጣን ክፍያ'
    ]),
    imageUrl: null,
    isActive: true,
    isPrimary: false,
    sortOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-google-ai-pro-1y',
    slug: 'google-ai-pro-1y',
    nameEn: 'Google AI Pro',
    nameAm: 'Google AI Pro',
    descEn: 'Full 1-Year Google AI Pro subscription activation for developers, researchers, and creators.',
    descAm: 'የ 1 ዓመት ሙሉ የ Google AI Pro ሳብስክሪፕሽን አክቲቬሽን።',
    duration: '1 Year',
    durationAm: '1 ዓመት',
    priceETB: 3000,
    badge: 'Annual Pro',
    featuresEn: JSON.stringify([
      'Full 1 Year Google AI Pro access',
      'Priority server-side fulfillment',
      'Advanced code generation and reasoning',
      'Dedicated support via Telegram'
    ]),
    featuresAm: JSON.stringify([
      'የ 1 ሙሉ ዓመት የ Google AI Pro አጠቃቀም',
      'ቅድሚያ የሚሰጠው የአክቲቬሽን ማድረሻ',
      'የላቀ የኮዲንግ እና ጥናት እገዛ',
      'የቴሌግራም ድጋፍ'
    ]),
    imageUrl: null,
    isActive: true,
    isPrimary: false,
    sortOrder: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-cursor-pro-1y',
    slug: 'cursor-pro-1y',
    nameEn: 'Cursor Pro',
    nameAm: 'Cursor Pro',
    descEn: '1-Year Cursor Pro AI Code Editor subscription with unlimited fast premium completions & Claude 3.5 Sonnet.',
    descAm: 'የ 1 ዓመት Cursor Pro AI ኮድ ኤዲተር ያልተገደበ አጠቃቀም።',
    duration: '1 Year',
    durationAm: '1 ዓመት',
    priceETB: 13000,
    badge: 'For Developers',
    featuresEn: JSON.stringify([
      'Full 1-Year Cursor Pro access',
      'Unlimited fast Claude 3.5 Sonnet & GPT-4o completions',
      'Cursor Tab multi-line AI autocomplete',
      'Priority developer support'
    ]),
    featuresAm: JSON.stringify([
      'የ 1 ዓመት ሙሉ Cursor Pro አጠቃቀም',
      'ያልተገደበ ፈጣን Claude 3.5 Sonnet & GPT-4o',
      'Cursor Tab ፈጣን አውቶኮምፕሊት',
      'የዴቨሎፐር ድጋፍ'
    ]),
    imageUrl: null,
    isActive: true,
    isPrimary: false,
    sortOrder: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-supabase-pro-1y',
    slug: 'supabase-pro-1y',
    nameEn: 'Supabase Pro',
    nameAm: 'Supabase Pro',
    descEn: '1-Year Supabase Pro plan for scalable Postgres databases, auth, storage, and serverless edge functions.',
    descAm: 'የ 1 ዓመት Supabase Pro እቅድ ለዳታቤዝ እና አፕሊኬሽኖች።',
    duration: '1 Year',
    durationAm: '1 ዓመት',
    priceETB: 7000,
    badge: 'Database Pro',
    featuresEn: JSON.stringify([
      'Full 1 Year Supabase Pro tier',
      '100,000 monthly active users',
      '8GB database space & 100GB storage',
      'No project pausing guarantee'
    ]),
    featuresAm: JSON.stringify([
      'የ 1 ዓመት Supabase Pro እቅድ',
      '100,000 ወርሃዊ ተጠቃሚዎች',
      '8GB ዳታቤዝ እና 100GB ስቶሬጅ',
      'ያለማቋረጥ የሚሰራ'
    ]),
    imageUrl: null,
    isActive: true,
    isPrimary: false,
    sortOrder: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-claude-1m',
    slug: 'claude-1m',
    nameEn: 'Claude',
    nameAm: 'Claude',
    descEn: '1-Month Claude Pro subscription access with Anthropic Claude 3.5 Sonnet & Opus models.',
    descAm: 'የ 1 ወር የ Claude Pro ሳብስክሪፕሽን አጠቃቀም (Claude 3.5 Sonnet)።',
    duration: '1 Month',
    durationAm: '1 ወር',
    priceETB: 650,
    badge: 'Popular AI',
    featuresEn: JSON.stringify([
      '1 Month Claude Pro access',
      '5x more usage on Claude 3.5 Sonnet',
      'Artifacts and Projects features',
      'Direct activation delivery'
    ]),
    featuresAm: JSON.stringify([
      'የ 1 ወር የ Claude Pro አጠቃቀም',
      '5 እጥፍ የ Claude 3.5 Sonnet አጠቃቀም',
      'Artifacts እና Projects',
      'ፈጣን አክቲቬሽን'
    ]),
    imageUrl: null,
    isActive: true,
    isPrimary: false,
    sortOrder: 6,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-capcut-1m',
    slug: 'capcut-1m',
    nameEn: 'CapCut',
    nameAm: 'CapCut',
    descEn: '1-Month CapCut Pro subscription with premium effects, AI cutout, cloud storage, and 4K exports.',
    descAm: 'የ 1 ወር CapCut Pro ሳብስክሪፕሽን ለቪዲዮ ኤዲቲንግ።',
    duration: '1 Month',
    durationAm: '1 ወር',
    priceETB: 500,
    badge: 'Creator Tool',
    featuresEn: JSON.stringify([
      '1 Month CapCut Pro membership',
      'Unlock all VIP transitions & effects',
      'AI background cutout & smart tools',
      'No watermarks + 4K 60fps export'
    ]),
    featuresAm: JSON.stringify([
      'የ 1 ወር የ CapCut Pro አባልነት',
      'ሁሉንም VIP ኢፌክቶች መጠቀም',
      'AI ባክግራውንድ ማስወገጃ',
      'ያለ ዋተርማርክ በ 4K ማውጣት'
    ]),
    imageUrl: null,
    isActive: true,
    isPrimary: false,
    sortOrder: 7,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
console.log('✓ Successfully migrated dev-data.json: Settings updated & ' + db.products.length + ' products loaded. Preserved ' + db.orders.length + ' historical orders.');
