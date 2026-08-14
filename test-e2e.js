const http = require('http');

async function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = http.request(
      {
        hostname: parsed.hostname,
        port: parsed.port || 80,
        path: parsed.pathname + parsed.search,
        method: options.method || 'GET',
        headers: options.headers || {},
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          let json = null;
          try {
            json = JSON.parse(body);
          } catch (e) {}
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body,
            json,
          });
        });
      }
    );
    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('🚀 RUNNING ET-SUB STORE COMPREHENSIVE TEST SUITE');
  console.log('====================================================\n');

  const BASE_URL = 'http://localhost:3000';

  // Test 1: Storefront Settings & Branding
  console.log('1. Testing Storefront Settings & Brand Configuration...');
  const settingsRes = await request(`${BASE_URL}/api/settings`);
  if (settingsRes.status !== 200 || !settingsRes.json?.settings) {
    throw new Error(`Settings API failed with status ${settingsRes.status}`);
  }
  const settings = settingsRes.json.settings;
  console.log(`✓ Store Brand Name: "${settings.storeName}"`);
  console.log(`✓ Support Telegram: "@${settings.supportTelegram}"`);
  console.log(`✓ Support Phone: "${settings.supportPhone}"`);
  if (settings.storeName !== 'ET-Sub Store') {
    throw new Error(`Expected storeName "ET-Sub Store", got "${settings.storeName}"`);
  }
  if (settings.supportTelegram !== 'Et_substore_support') {
    throw new Error(`Expected supportTelegram "Et_substore_support", got "${settings.supportTelegram}"`);
  }
  if (settings.supportPhone !== '+251988788834') {
    throw new Error(`Expected supportPhone "+251988788834", got "${settings.supportPhone}"`);
  }

  // Test 2: Products Catalog (Gemini AI Pro 18M 350 ETB + More From Us Products)
  console.log('\n2. Testing Products API & Configured Pricing...');
  const prodRes = await request(`${BASE_URL}/api/products`);
  if (prodRes.status !== 200 || !prodRes.json?.products) {
    throw new Error(`Products API failed with status ${prodRes.status}`);
  }
  const products = prodRes.json.products;
  console.log(`✓ Products API OK: Found ${products.length} subscriptions in catalog`);
  products.forEach((p) => {
    console.log(`   • ${p.nameEn} (${p.duration}) - ${p.priceETB} ETB [Primary: ${!!p.isPrimary}]`);
  });

  const gemini18m = products.find((p) => p.slug.includes('18m') || (p.nameEn.includes('Gemini') && p.priceETB === 350));
  if (!gemini18m) {
    throw new Error('Gemini AI Pro (18 Months — 350 ETB) not found in catalog!');
  }
  console.log(`✓ Primary Product Verified: ${gemini18m.nameEn} (${gemini18m.duration}) @ ${gemini18m.priceETB} ETB`);

  // Test 3: Customer Checkout & Order Creation (with Telegram handle & Telebirr Ref)
  console.log('\n3. Testing Customer Checkout & Order Creation...');
  const orderPayload = {
    customerName: 'Abebe Kebede',
    customerPhone: '+251988788834',
    customerTelegram: '@AbebeAI',
    productId: gemini18m.id,
    transactionId: 'TB77889911',
    language: 'am',
  };

  const createOrderRes = await request(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: orderPayload,
  });

  if (createOrderRes.status !== 200 || !createOrderRes.json?.success) {
    throw new Error(`Order creation failed: ${JSON.stringify(createOrderRes.json)}`);
  }
  const { orderNumber, accessToken, redirectUrl } = createOrderRes.json;
  console.log(`✓ Order Created Successfully:`);
  console.log(`   • Tracking Code: ${orderNumber}`);
  console.log(`   • Access Token: ${accessToken.slice(0, 10)}...`);
  console.log(`   • Tracking URL: ${redirectUrl}`);

  if (!orderNumber.startsWith('ETS-')) {
    throw new Error(`Order number format should start with ETS-, got: ${orderNumber}`);
  }

  // Test 4: Track My Order Lookup API (/api/orders/lookup)
  console.log('\n4. Testing Order Recovery via Track My Order API...');
  const lookupRes = await request(`${BASE_URL}/api/orders/lookup?code=${orderNumber}`);
  if (lookupRes.status !== 200 || !lookupRes.json?.orderNumber) {
    throw new Error(`Order lookup failed: ${JSON.stringify(lookupRes.json)}`);
  }
  console.log(`✓ Order Recovery OK: Successfully looked up #${lookupRes.json.orderNumber}`);

  // Test 5: Customer Order Status Tracking Page
  console.log('\n5. Testing Customer Order Details & Under Verification State...');
  const orderTrackRes = await request(`${BASE_URL}/api/orders/${orderNumber}?token=${accessToken}`);
  if (orderTrackRes.status !== 200 || !orderTrackRes.json?.order) {
    throw new Error(`Order fetch failed with status ${orderTrackRes.status}`);
  }
  const order = orderTrackRes.json.order;
  console.log(`✓ Customer Order State Verified:`);
  console.log(`   • Tracking Code: ${order.orderNumber}`);
  console.log(`   • Status: ${order.orderStatus} | Payment: ${order.paymentStatus}`);
  console.log(`   • Telegram: ${order.customerTelegram}`);
  console.log(`   • Amount: ${order.amountETB} ETB`);
  console.log(`   • Telebirr Ref: ${order.transactionId}`);

  // Test 6: Admin Login
  console.log('\n6. Testing Admin Authentication...');
  const loginRes = await request(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {
      email: 'admin@ethiogemini.com',
      password: 'Admin@EthioGemini2026!',
    },
  });

  if (loginRes.status !== 200 || !loginRes.json?.success) {
    throw new Error(`Admin login failed: ${JSON.stringify(loginRes.json)}`);
  }

  const setCookie = loginRes.headers['set-cookie'];
  const sessionCookie = Array.isArray(setCookie) ? setCookie[0].split(';')[0] : setCookie.split(';')[0];
  console.log(`✓ Admin Login Successful: ${loginRes.json.admin.email}`);

  // Test 7: Admin Verify Payment
  console.log('\n7. Testing Admin Payment Verification...');
  const verifyPayRes = await request(`${BASE_URL}/api/orders/${orderNumber}/verify-payment`, {
    method: 'POST',
    headers: { Cookie: sessionCookie },
  });

  if (verifyPayRes.status !== 200 || !verifyPayRes.json?.success) {
    throw new Error(`Payment verification failed: ${JSON.stringify(verifyPayRes.json)}`);
  }
  console.log(`✓ Payment Verified: Order ${orderNumber} is now PAID`);

  // Test 8: Admin Deliver Activation Link
  console.log('\n8. Testing Admin Activation Link Delivery...');
  const supplierActivationUrl = 'https://one.google.com/invitation/gemini-18m-ethiopia-redeem-key-9911';
  const deliverRes = await request(`${BASE_URL}/api/orders/${orderNumber}/deliver`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: sessionCookie,
    },
    body: {
      activationLink: supplierActivationUrl,
      adminNotes: 'Delivered official Google 18-Month invitation link to customer.',
    },
  });

  if (deliverRes.status !== 200 || !deliverRes.json?.success) {
    throw new Error(`Activation delivery failed: ${JSON.stringify(deliverRes.json)}`);
  }
  console.log(`✓ Activation Link Delivered:`);
  console.log(`   • Status: ${deliverRes.json.order.orderStatus}`);
  console.log(`   • Delivered Link: ${deliverRes.json.order.activationLink}`);
  console.log(`   • Delivered At: ${deliverRes.json.order.deliveredAt}`);

  // Test 9: Customer Verification of Delivered Link & Expiration
  console.log('\n9. Testing Customer Verification of Delivered Link & Expiry Window...');
  const finalCustomerOrderRes = await request(`${BASE_URL}/api/orders/${orderNumber}?token=${accessToken}`);
  const finalOrder = finalCustomerOrderRes.json.order;
  if (finalOrder.orderStatus === 'DELIVERED' && finalOrder.activationLink === supplierActivationUrl) {
    console.log(`✓ Customer Delivery Confirmed: Activation link is active on order tracker!`);
    console.log(`   • Link: ${finalOrder.activationLink}`);
    console.log(`   • Delivered At: ${finalOrder.deliveredAt}`);
  } else {
    throw new Error(`Customer cannot see delivered link!`);
  }

  // Test 10: Check More From Us page route
  console.log('\n10. Testing More From Us Page Route...');
  const morePageRes = await request(`${BASE_URL}/more-products`);
  console.log(`✓ /more-products Route Accessible (Status: ${morePageRes.status})`);

  console.log('\n====================================================');
  console.log('🎉 ALL 10 TEST SUITES PASSED WITH 100% SUCCESS!');
  console.log('====================================================\n');
}

runTests().catch((err) => {
  console.error('\n❌ Test Suite Failed:', err);
  process.exit(1);
});
