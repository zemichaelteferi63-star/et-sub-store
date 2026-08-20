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
  console.log('🚀 RUNNING ET-SUB STORE SECURITY & CUSTOMER FLOW TEST SUITE');
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

  // Test 2: Products Catalog
  console.log('\n2. Testing Products API & Configured Pricing...');
  const prodRes = await request(`${BASE_URL}/api/products`);
  if (prodRes.status !== 200 || !prodRes.json?.products) {
    throw new Error(`Products API failed with status ${prodRes.status}`);
  }
  const products = prodRes.json.products;
  console.log(`✓ Products API OK: Found ${products.length} subscriptions in catalog`);

  const gemini18m = products.find((p) => p.slug.includes('18m') || (p.nameEn.includes('Gemini') && p.priceETB === 350));
  if (!gemini18m) {
    throw new Error('Gemini AI Pro (18 Months — 350 ETB) not found in catalog!');
  }

  // Test 3: Customer Checkout with Telegram Username
  console.log('\n3. Testing Customer Checkout WITH Telegram Username...');
  const orderPayloadWithTG = {
    customerName: 'Abebe Kebede',
    customerPhone: '+251988788834',
    customerTelegram: '@AbebeAI',
    productId: gemini18m.id,
    transactionId: 'TB77889911',
    language: 'am',
  };

  const createOrderRes1 = await request(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: orderPayloadWithTG,
  });

  if (createOrderRes1.status !== 200 || !createOrderRes1.json?.success) {
    throw new Error(`Order creation failed: ${JSON.stringify(createOrderRes1.json)}`);
  }
  const orderNumber1 = createOrderRes1.json.orderNumber;
  const accessToken1 = createOrderRes1.json.accessToken;
  console.log(`✓ Order 1 Created (With Telegram @AbebeAI): ${orderNumber1}`);

  // Test 4: Customer Checkout WITHOUT Telegram Username (OPTIONAL TELEGRAM REQUIREMENT)
  console.log('\n4. Testing Customer Checkout WITHOUT Telegram Username (OPTIONAL TELEGRAM)...');
  const orderPayloadNoTG = {
    customerName: 'Tigist Alemu',
    customerPhone: '+251911998877',
    customerTelegram: '', // empty / optional
    productId: gemini18m.id,
    transactionId: 'TB55443322',
    language: 'en',
  };

  const createOrderRes2 = await request(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: orderPayloadNoTG,
  });

  if (createOrderRes2.status !== 200 || !createOrderRes2.json?.success) {
    throw new Error(`Order creation without Telegram failed: ${JSON.stringify(createOrderRes2.json)}`);
  }
  const orderNumber2 = createOrderRes2.json.orderNumber;
  const accessToken2 = createOrderRes2.json.accessToken;
  console.log(`✓ Order 2 Created Successfully WITHOUT Telegram: ${orderNumber2}`);

  // Test 5: Verify Order Lookup & Order Status Details
  console.log('\n5. Testing Order Status Details for Order Without Telegram...');
  const orderTrackRes2 = await request(`${BASE_URL}/api/orders/${orderNumber2}?token=${accessToken2}`);
  const order2 = orderTrackRes2.json.order;
  if (order2.customerTelegram === null || order2.customerTelegram === '') {
    console.log(`✓ Confirmed: Customer Telegram is null/empty as expected for Order #${orderNumber2}`);
  } else {
    throw new Error(`Expected customerTelegram null, got ${order2.customerTelegram}`);
  }

  // Test 6: Unauthenticated Admin Route Protection (SECURE AUTH REQUIREMENT)
  console.log('\n6. Testing Unauthenticated Admin Protection...');
  const unauthApiRes = await request(`${BASE_URL}/api/orders`);
  if (unauthApiRes.status === 401) {
    console.log(`✓ Protected API Endpoint: /api/orders blocked unauthenticated request (401 Unauthorized)`);
  } else {
    throw new Error(`Expected 401 for unauthenticated /api/orders, got ${unauthApiRes.status}`);
  }

  // Test 7: Admin Login
  console.log('\n7. Testing Admin Authentication...');
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

  // Test 8: Admin Release Activation for Order Without Telegram
  console.log('\n8. Testing Admin Release Activation for Order Without Telegram...');
  const supplierActivationUrl = 'https://one.google.com/invitation/gemini-18m-ethiopia-redeem-key-9922';
  const deliverRes = await request(`${BASE_URL}/api/orders/${orderNumber2}/deliver`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: sessionCookie,
    },
    body: {
      activationLink: supplierActivationUrl,
      adminNotes: 'Released activation link for customer without Telegram handle.',
    },
  });

  if (deliverRes.status !== 200 || !deliverRes.json?.success) {
    throw new Error(`Activation release failed: ${JSON.stringify(deliverRes.json)}`);
  }
  console.log(`✓ Activation Released for Order #${orderNumber2}:`);
  console.log(`   • Status: ${deliverRes.json.order.orderStatus}`);
  console.log(`   • Delivered Link: ${deliverRes.json.order.activationLink}`);

  // Test 9: Customer Order Verification of Released Activation
  console.log('\n9. Testing Customer Tracking of Released Activation...');
  const finalCustomerOrderRes2 = await request(`${BASE_URL}/api/orders/${orderNumber2}?token=${accessToken2}`);
  const finalOrder2 = finalCustomerOrderRes2.json.order;
  if (finalOrder2.orderStatus === 'DELIVERED' && finalOrder2.activationLink === supplierActivationUrl) {
    console.log(`✓ Customer Delivery Confirmed: Activation link is accessible on order tracker without Telegram!`);
  } else {
    throw new Error(`Customer cannot see released activation link!`);
  }

  console.log('\n====================================================');
  console.log('🎉 ALL SECURITY & CUSTOMER FLOW TESTS PASSED!');
  console.log('====================================================\n');
}

runTests().catch((err) => {
  console.error('\n❌ Test Suite Failed:', err);
  process.exit(1);
});
