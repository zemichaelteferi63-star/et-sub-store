import fs from 'fs';
import path from 'path';

export interface AdminModel {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductModel {
  id: string;
  slug: string;
  nameEn: string;
  nameAm: string;
  descEn: string;
  descAm: string;
  duration: string;
  durationAm: string;
  priceETB: number;
  badge?: string | null;
  featuresEn: string;
  featuresAm: string;
  imageUrl?: string | null;
  isActive: boolean;
  isPrimary?: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderModel {
  id: string;
  orderNumber: string;
  accessToken: string;
  customerName: string;
  customerPhone: string;
  customerTelegram?: string | null;
  productId: string;
  product?: ProductModel | null;
  amountETB: number;
  currency: string;
  paymentMethod: string;
  transactionId?: string | null;
  paymentStatus: string;
  orderStatus: string;
  activationLink?: string | null;
  deliveredAt?: Date | null;
  deliveredBy?: string | null;
  adminNotes?: string | null;
  expiryDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SettingModel {
  key: string;
  value: string;
  updatedAt: Date;
}

export interface AuditLogModel {
  id: string;
  orderId?: string | null;
  action: string;
  details?: string | null;
  performedBy: string;
  createdAt: Date;
}

interface DatabaseData {
  admins: AdminModel[];
  products: ProductModel[];
  orders: OrderModel[];
  settings: SettingModel[];
  auditLogs: AuditLogModel[];
}

const DB_FILE = path.join(process.cwd(), 'prisma', 'dev-data.json');

declare global {
  var _etSubStoreDataCache: DatabaseData | undefined;
}

function ensureDataFile(): DatabaseData {
  const tmpFile = path.join(process.env.TMPDIR || process.env.TEMP || '/tmp', 'ethio-gemini-dev-data.json');
  let dataFromTmp: DatabaseData | null = null;
  let dataFromDbFile: DatabaseData | null = null;

  if (fs.existsSync(tmpFile)) {
    try {
      const content = fs.readFileSync(tmpFile, 'utf-8');
      dataFromTmp = JSON.parse(content);
    } catch (e) {}
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      dataFromDbFile = JSON.parse(content);
    } catch (e) {}
  }

  // Merge orders from both files to ensure NO order is ever lost
  let chosen: DatabaseData | null = null;
  if (dataFromTmp || dataFromDbFile) {
    const base = dataFromDbFile || dataFromTmp!;
    const ordersMap = new Map<string, OrderModel>();

    if (dataFromDbFile?.orders) {
      for (const o of dataFromDbFile.orders) {
        ordersMap.set((o.orderNumber || o.id).toUpperCase(), o);
      }
    }
    if (dataFromTmp?.orders) {
      for (const o of dataFromTmp.orders) {
        const key = (o.orderNumber || o.id).toUpperCase();
        if (!ordersMap.has(key)) {
          ordersMap.set(key, o);
        } else {
          // Keep newer updated order status
          const existing = ordersMap.get(key)!;
          if (new Date(o.updatedAt).getTime() > new Date(existing.updatedAt).getTime()) {
            ordersMap.set(key, o);
          }
        }
      }
    }

    base.orders = Array.from(ordersMap.values());
    chosen = base;
  }

  if (chosen) {
    // Ensure settings fallbacks match current configuration
    if (chosen.settings) {
      for (const s of chosen.settings) {
        if (s.key === 'supportPhone' && s.value === '0988798834') s.value = '0996976737';
        if (s.key === 'telebirrReceiverPhone' && s.value === '0988798834') s.value = '0996976737';
        if (s.key === 'telebirrReceiverName' && s.value === 'ET-Sub Store AI Services') s.value = 'Ze Michael';
      }
    }
    globalThis._etSubStoreDataCache = chosen;
    return chosen;
  }

  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {}
  }

  const initialData: DatabaseData = {
    admins: [
      {
        id: 'admin-1',
        email: 'admin@ethiogemini.com',
        name: 'ET-Sub Store Admin',
        passwordHash: '$2a$12$J2IcHtJuLVbYnC8IDvw3wOD1OocD.8nc219uOqU0o.qxpQXvV9Fve', // Admin@EthioGemini2026!
        role: 'SUPER_ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    products: [
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
          'Convenient Telebirr payment in ETB',
        ]),
        featuresAm: JSON.stringify([
          'የ 18 ወራት ሙሉ የ Gemini 1.5 Pro አጠቃቀም',
          '2 ሚሊዮን ቶከን ኮንቴክስት እና ኮዲንግ',
          'ይፋዊ የአክቲቬሽን ሊንክ ማድረሻ',
          'ቀጥተኛ የቴሌግራም ደንበኞች ድጋፍ',
          'በቴሌብር ቀላል የብር ክፍያ',
        ]),
        imageUrl: null,
        isActive: true,
        isPrimary: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
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
          'Fast processing with Telebirr',
        ]),
        featuresAm: JSON.stringify([
          '50 ይፋዊ የቴሌግራም ስታርስ',
          'በቴሌግራም ዩዘርኔም ፈጣን ክፍያ',
          'ለቦቶች እና ዲጂታል ግብይቶች',
          'በቴሌብር ፈጣን ክፍያ',
        ]),
        imageUrl: null,
        isActive: true,
        isPrimary: false,
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
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
          'Dedicated support via Telegram',
        ]),
        featuresAm: JSON.stringify([
          'የ 1 ሙሉ ዓመት የ Google AI Pro አጠቃቀም',
          'ቅድሚያ የሚሰጠው የአክቲቬሽን ማድረሻ',
          'የላቀ የኮዲንግ እና ጥናት እገዛ',
          'የቴሌግራም ድጋፍ',
        ]),
        imageUrl: null,
        isActive: true,
        isPrimary: false,
        sortOrder: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
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
          'Priority developer support',
        ]),
        featuresAm: JSON.stringify([
          'የ 1 ዓመት ሙሉ Cursor Pro አጠቃቀም',
          'ያልተገደበ ፈጣን Claude 3.5 Sonnet & GPT-4o',
          'Cursor Tab ፈጣን አውቶኮምፕሊት',
          'የዴቨሎፐር ድጋፍ',
        ]),
        imageUrl: null,
        isActive: true,
        isPrimary: false,
        sortOrder: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
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
          'No project pausing guarantee',
        ]),
        featuresAm: JSON.stringify([
          'የ 1 ዓመት Supabase Pro እቅድ',
          '100,000 ወርሃዊ ተጠቃሚዎች',
          '8GB ዳታቤዝ እና 100GB ስቶሬጅ',
          'ያለማቋረጥ የሚሰራ',
        ]),
        imageUrl: null,
        isActive: true,
        isPrimary: false,
        sortOrder: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
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
          'Direct activation delivery',
        ]),
        featuresAm: JSON.stringify([
          'የ 1 ወር የ Claude Pro አጠቃቀም',
          '5 እጥፍ የ Claude 3.5 Sonnet አጠቃቀም',
          'Artifacts እና Projects',
          'ፈጣን አክቲቬሽን',
        ]),
        imageUrl: null,
        isActive: true,
        isPrimary: false,
        sortOrder: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
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
          'No watermarks + 4K 60fps export',
        ]),
        featuresAm: JSON.stringify([
          'የ 1 ወር የ CapCut Pro አባልነት',
          'ሁሉንም VIP ኢፌክቶች መጠቀም',
          'AI ባክግራውንድ ማስወገጃ',
          'ያለ ዋተርማርክ በ 4K ማውጣት',
        ]),
        imageUrl: null,
        isActive: true,
        isPrimary: false,
        sortOrder: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    orders: [],
    settings: [
      { key: 'storeName', value: 'ET-Sub Store', updatedAt: new Date() },
      { key: 'supportPhone', value: '0996976737', updatedAt: new Date() },
      { key: 'supportTelegram', value: 'Et_substore_support', updatedAt: new Date() },
      { key: 'currency', value: 'ETB', updatedAt: new Date() },
      { key: 'telebirrReceiverName', value: 'Ze Michael', updatedAt: new Date() },
      { key: 'telebirrReceiverPhone', value: '0996976737', updatedAt: new Date() },
      { key: 'telebirrDevMode', value: 'true', updatedAt: new Date() },
      { key: 'customRequestTitleEn', value: 'Looking for another subscription?', updatedAt: new Date() },
      { key: 'customRequestTitleAm', value: 'ሌላ ሳብስክሪፕሽን ይፈልጋሉ?', updatedAt: new Date() },
      { key: 'customRequestDescEn', value: "Don't see what you're looking for? Send us a message on Telegram and tell us which subscription you need.", updatedAt: new Date() },
      { key: 'customRequestDescAm', value: 'የሚፈልጉትን ሳብስክሪፕሽን አላገኙም? በቴሌግራም መልእክት ይላኩልን እና የሚፈልጉትን ሳብስክሪፕሽን ይንገሩን።', updatedAt: new Date() },
      { key: 'customRequestButtonEn', value: 'Message Us on Telegram', updatedAt: new Date() },
      { key: 'customRequestButtonAm', value: 'በቴሌግራም ያናግሩን', updatedAt: new Date() },
    ],
    auditLogs: [],
  };

  globalThis._etSubStoreDataCache = initialData;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  } catch (e) {}
  return initialData;
}

function saveData(data: DatabaseData): void {
  globalThis._etSubStoreDataCache = data;
  const tmpFile = path.join(process.env.TMPDIR || process.env.TEMP || '/tmp', 'ethio-gemini-dev-data.json');
  try {
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {}
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {}
}

export const prisma = {
  admin: {
    findUnique: async ({ where }: { where: { email?: string; id?: string } }) => {
      const data = ensureDataFile();
      return (
        data.admins.find(
          (a) =>
            (where.email && a.email.toLowerCase() === where.email.toLowerCase()) ||
            (where.id && a.id === where.id)
        ) || null
      );
    },
    upsert: async ({ where, update, create }: any) => {
      const data = ensureDataFile();
      const idx = data.admins.findIndex(
        (a) => where.email && a.email.toLowerCase() === where.email.toLowerCase()
      );
      if (idx >= 0) {
        data.admins[idx] = {
          ...data.admins[idx],
          ...update,
          updatedAt: new Date(),
        };
        saveData(data);
        return data.admins[idx];
      } else {
        const newAdmin: AdminModel = {
          id: `admin-${Date.now()}`,
          ...create,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        data.admins.push(newAdmin);
        saveData(data);
        return newAdmin;
      }
    },
  },
  product: {
    findMany: async (args?: { where?: any; orderBy?: any }) => {
      const data = ensureDataFile();
      let results = [...data.products];
      if (args?.where?.isActive !== undefined) {
        results = results.filter((p) => p.isActive === args.where.isActive);
      }
      results.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      return results;
    },
    findUnique: async ({ where }: { where: { id?: string; slug?: string } }) => {
      const data = ensureDataFile();
      return (
        data.products.find(
          (p) =>
            (where.id && p.id === where.id) ||
            (where.slug && p.slug === where.slug)
        ) || null
      );
    },
    create: async ({ data: payload }: { data: any }) => {
      const data = ensureDataFile();
      const newProduct: ProductModel = {
        id: `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        ...payload,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      data.products.push(newProduct);
      saveData(data);
      return newProduct;
    },
    update: async ({ where, data: payload }: { where: { id: string }; data: any }) => {
      const data = ensureDataFile();
      const idx = data.products.findIndex((p) => p.id === where.id);
      if (idx === -1) throw new Error('Product not found');
      data.products[idx] = {
        ...data.products[idx],
        ...payload,
        updatedAt: new Date(),
      };
      saveData(data);
      return data.products[idx];
    },
    delete: async ({ where }: { where: { id: string } }) => {
      const data = ensureDataFile();
      data.products = data.products.filter((p) => p.id !== where.id);
      saveData(data);
      return { success: true };
    },
    count: async (args?: { where?: any }) => {
      const data = ensureDataFile();
      if (args?.where?.isActive !== undefined) {
        return data.products.filter((p) => p.isActive === args.where.isActive).length;
      }
      return data.products.length;
    },
    upsert: async ({ where, update, create }: any) => {
      const data = ensureDataFile();
      const idx = data.products.findIndex((p) => p.slug === where.slug);
      if (idx >= 0) {
        data.products[idx] = {
          ...data.products[idx],
          ...update,
          updatedAt: new Date(),
        };
        saveData(data);
        return data.products[idx];
      } else {
        const newProduct: ProductModel = {
          id: `prod-${Date.now()}`,
          ...create,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        data.products.push(newProduct);
        saveData(data);
        return newProduct;
      }
    },
  },
  order: {
    findMany: async (args?: { where?: any; include?: any; orderBy?: any; take?: number }) => {
      const data = ensureDataFile();
      let results = [...data.orders];

      if (args?.where) {
        if (args.where.orderStatus) {
          if (typeof args.where.orderStatus === 'object' && args.where.orderStatus.in) {
            results = results.filter((o) => args.where.orderStatus.in.includes(o.orderStatus));
          } else {
            results = results.filter((o) => o.orderStatus === args.where.orderStatus);
          }
        }
        if (args.where.paymentStatus) {
          results = results.filter((o) => o.paymentStatus === args.where.paymentStatus);
        }
        if (args.where.transactionId) {
          const targetTx = typeof args.where.transactionId === 'string' ? args.where.transactionId.trim().toUpperCase() : null;
          if (targetTx) {
            results = results.filter((o) => o.transactionId?.trim().toUpperCase() === targetTx);
          }
        }
        if (args.where.OR) {
          results = results.filter((o) => {
            return args.where.OR.some((cond: any) => {
              if (cond.orderNumber?.contains) {
                return o.orderNumber.toLowerCase().includes(cond.orderNumber.contains.toLowerCase());
              }
              if (cond.customerName?.contains) {
                return o.customerName.toLowerCase().includes(cond.customerName.contains.toLowerCase());
              }
              if (cond.customerPhone?.contains) {
                return o.customerPhone.includes(cond.customerPhone.contains);
              }
              if (cond.customerTelegram?.contains) {
                return o.customerTelegram?.toLowerCase().includes(cond.customerTelegram.contains.toLowerCase());
              }
              if (cond.transactionId?.contains) {
                return o.transactionId?.toLowerCase().includes(cond.transactionId.contains.toLowerCase());
              }
              return false;
            });
          });
        }
      }

      // Deduplicate orders by orderNumber or id to prevent any duplicated entries
      const seen = new Set<string>();
      const deduplicated: OrderModel[] = [];
      for (const o of results) {
        const key = (o.orderNumber || o.id).toUpperCase();
        if (!seen.has(key)) {
          seen.add(key);
          deduplicated.push(o);
        }
      }
      results = deduplicated;

      // Sort
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      if (args?.take) {
        results = results.slice(0, args.take);
      }

      // Attach product if requested
      if (args?.include?.product) {
        return results.map((o) => ({
          ...o,
          product: data.products.find((p) => p.id === o.productId) || null,
        }));
      }

      return results;
    },
    findFirst: async (args?: { where?: any; include?: any }) => {
      const data = ensureDataFile();
      const results = await prisma.order.findMany({ where: args?.where, include: args?.include, take: 1 });
      return results[0] || null;
    },
    findUnique: async ({ where, include }: { where: { orderNumber?: string; id?: string }; include?: any }) => {
      const data = ensureDataFile();
      const targetOrderNum = where.orderNumber ? where.orderNumber.trim().toUpperCase() : null;
      const targetId = where.id ? where.id.trim() : null;

      const order = data.orders.find(
        (o) =>
          (targetOrderNum && o.orderNumber.trim().toUpperCase() === targetOrderNum) ||
          (targetId && o.id === targetId)
      );
      if (!order) return null;

      if (include?.product) {
        return {
          ...order,
          product: data.products.find((p) => p.id === order.productId) || null,
        };
      }
      return order;
    },
    create: async ({ data: payload, include }: { data: any; include?: any }) => {
      const data = ensureDataFile();
      const newOrder: OrderModel = {
        id: `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        ...payload,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      data.orders.unshift(newOrder);
      saveData(data);

      if (include?.product) {
        return {
          ...newOrder,
          product: data.products.find((p) => p.id === newOrder.productId) || null,
        };
      }
      return newOrder;
    },
    update: async ({ where, data: payload, include }: { where: { orderNumber?: string; id?: string }; data: any; include?: any }) => {
      const data = ensureDataFile();
      const targetOrderNum = where.orderNumber ? where.orderNumber.trim().toUpperCase() : null;
      const targetId = where.id ? where.id.trim() : null;

      const idx = data.orders.findIndex(
        (o) =>
          (targetOrderNum && o.orderNumber.trim().toUpperCase() === targetOrderNum) ||
          (targetId && o.id === targetId)
      );
      if (idx === -1) throw new Error('Order not found');
      data.orders[idx] = {
        ...data.orders[idx],
        ...payload,
        updatedAt: new Date(),
      };
      saveData(data);

      if (include?.product) {
        return {
          ...data.orders[idx],
          product: data.products.find((p) => p.id === data.orders[idx].productId) || null,
        };
      }
      return data.orders[idx];
    },
    count: async (args?: { where?: any }) => {
      const data = ensureDataFile();
      let list = data.orders;
      if (args?.where?.orderStatus) {
        if (typeof args.where.orderStatus === 'object' && args.where.orderStatus.in) {
          list = list.filter((o) => args.where.orderStatus.in.includes(o.orderStatus));
        } else {
          list = list.filter((o) => o.orderStatus === args.where.orderStatus);
        }
      }
      if (args?.where?.paymentStatus) {
        list = list.filter((o) => o.paymentStatus === args.where.paymentStatus);
      }
      return list.length;
    },
    aggregate: async ({ _sum, where }: { _sum: { amountETB: boolean }; where?: any }) => {
      const data = ensureDataFile();
      let list = data.orders;
      if (where?.paymentStatus) {
        list = list.filter((o) => o.paymentStatus === where.paymentStatus);
      }
      const sum = list.reduce((acc, curr) => acc + (curr.amountETB || 0), 0);
      return { _sum: { amountETB: sum } };
    },
  },
  setting: {
    findMany: async () => {
      const data = ensureDataFile();
      return data.settings;
    },
    upsert: async ({ where, update, create }: any) => {
      const data = ensureDataFile();
      const idx = data.settings.findIndex((s) => s.key === where.key);
      if (idx >= 0) {
        data.settings[idx] = {
          ...data.settings[idx],
          ...update,
          updatedAt: new Date(),
        };
        saveData(data);
        return data.settings[idx];
      } else {
        const newSetting: SettingModel = {
          key: where.key,
          value: create.value,
          updatedAt: new Date(),
        };
        data.settings.push(newSetting);
        saveData(data);
        return newSetting;
      }
    },
  },
  auditLog: {
    create: async ({ data: payload }: { data: any }) => {
      const data = ensureDataFile();
      const newLog: AuditLogModel = {
        id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        ...payload,
        createdAt: new Date(),
      };
      data.auditLogs.unshift(newLog);
      saveData(data);
      return newLog;
    },
    findMany: async (args?: { take?: number; orderBy?: any; include?: any }) => {
      const data = ensureDataFile();
      let list = [...data.auditLogs];
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (args?.take) {
        list = list.slice(0, args.take);
      }
      if (args?.include?.order) {
        return list.map((l) => {
          const ord = data.orders.find((o) => o.id === l.orderId);
          return {
            ...l,
            order: ord ? { orderNumber: ord.orderNumber, customerName: ord.customerName } : null,
          };
        });
      }
      return list;
    },
  },
  $disconnect: async () => {},
};

export default prisma;
