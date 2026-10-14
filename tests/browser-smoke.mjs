import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { loadEnv } from 'vite';
import { brochureProducts, brochureGallery } from '../src/data/products.ts';

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:5173';
const env = loadEnv('development', process.cwd(), 'VITE_');
const backend = env.VITE_SUPABASE_URL
  ? new URL(env.VITE_SUPABASE_URL).origin
  : null;
const browser = await chromium.launch({
  headless: true,
  ...(process.env.BROWSER_CHANNEL
    ? { channel: process.env.BROWSER_CHANNEL }
    : {}),
});
const errors = [];
await mkdir('/tmp/deezobo-qa', { recursive: true });
const products = brochureProducts.map((p) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  description: p.description,
  flavor_notes: p.flavorNotes,
  image_url: p.imageUrl,
  image_alt: p.imageAlt,
  options: p.options,
  featured: p.featured,
  active: p.active,
}));
const gallery = brochureGallery.map((i) => ({
  id: i.id,
  image_url: i.imageUrl,
  caption: i.caption,
  category: i.category,
  display_order: i.displayOrder,
  published: i.published,
}));

async function contextWithRole(role = 'guest', liveCatalog = false) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  context.on('page', (page) =>
    page.on('pageerror', (e) => errors.push(e.message)),
  );
  if (backend)
    await context.route(backend + '/**', async (route) => {
      const url = new URL(route.request().url());
      if (url.pathname.endsWith('/rpc/is_deezobo_admin'))
        return route.fulfill({ json: role === 'admin' });
      if (url.pathname.endsWith('/products')) {
        if (!liveCatalog)
          return route.fulfill({
            status: 503,
            json: { message: 'Test: catalog unavailable' },
          });
        if (route.request().method() === 'POST')
          return route.fulfill({ status: 201, json: [] });
        return route.fulfill({ json: products });
      }
      if (url.pathname.endsWith('/gallery_items'))
        return route.fulfill(
          liveCatalog
            ? { json: gallery }
            : { status: 503, json: { message: 'Test: catalog unavailable' } },
        );
      if (url.pathname.endsWith('/logout'))
        return route.fulfill({ status: 204 });
      return route.fulfill({
        status: 400,
        json: { message: 'External authentication is mocked for this test' },
      });
    });
  if (backend && role !== 'guest') {
    const user = {
      id: '11111111-1111-4111-8111-111111111111',
      email: 'test@example.com',
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: { provider: 'google' },
      user_metadata: {},
      created_at: new Date().toISOString(),
    };
    const token =
      'test.' +
      Buffer.from(
        JSON.stringify({
          exp: Math.floor(Date.now() / 1000) + 3600,
          sub: user.id,
        }),
      ).toString('base64url') +
      '.test';
    const session = {
      access_token: token,
      refresh_token: 'test-refresh-token',
      token_type: 'bearer',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      user,
    };
    const key = 'sb-' + new URL(backend).hostname.split('.')[0] + '-auth-token';
    await context.addInitScript(
      ({ key, session, origin }) => {
        if (location.origin === origin)
          localStorage.setItem(key, JSON.stringify(session));
      },
      { key, session, origin: new URL(base).origin },
    );
  }
  return context;
}
async function noOverflow(page) {
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    ),
    false,
    'horizontal overflow',
  );
}
async function capture(page, path) {
  await page.locator('img').evaluateAll((images) =>
    Promise.all(
      images.map((image) => {
        image.loading = 'eager';
        return image.decode().catch(() => null);
      }),
    ),
  );
  await page.screenshot({ path, fullPage: true });
}
try {
  const context = await contextWithRole();
  const page = await context.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.locator('.hero h1').waitFor();
  assert.match(await page.title(), /Dee Zobo/);
  await noOverflow(page);
  await capture(page, '/tmp/deezobo-qa/home-desktop.png');

  await page.goto(base + '/order', { waitUntil: 'networkidle' });
  assert.equal(await page.locator('.product-card').count(), 7);
  await page.getByRole('button', { name: 'Mocktails', exact: true }).click();
  assert.equal(await page.locator('.product-card').count(), 4);
  await page.getByLabel('Search drinks').fill('green apple');
  assert.equal(await page.locator('.product-card').count(), 1);
  await page.getByLabel('Search drinks').fill('no such drink');
  await page.getByRole('heading', { name: 'No drinks found' }).waitFor();
  await page.getByLabel('Search drinks').fill('');
  await page
    .getByRole('button', { name: 'Herbal infusions', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'View Ginger Hibiscus', exact: true })
    .click();
  await page.getByRole('dialog').waitFor();
  await page.getByLabel('Choose your size').selectOption('12oz');
  await page.getByLabel('Quantity', { exact: true }).fill('2');
  await page.getByRole('button', { name: /Add to selection/ }).click();
  await page.getByRole('link', { name: 'Review selection' }).click();
  await page.getByRole('heading', { name: 'Your selection.' }).waitFor();
  assert.match(await page.locator('.subtotal').innerText(), /\$14/);
  await page.reload({ waitUntil: 'networkidle' });
  assert.match(await page.locator('.subtotal').innerText(), /\$14/);
  await page
    .getByLabel('How would you like your drinks?')
    .selectOption('Delivery');
  const mailto = await page
    .getByRole('link', { name: 'Prepare order email' })
    .getAttribute('href');
  assert.match(decodeURIComponent(mailto), /Preferred fulfillment: Delivery/);
  assert.match(decodeURIComponent(mailto), /2 × Ginger Hibiscus/);

  await page.goto(base + '/gallery', { waitUntil: 'networkidle' });
  await page.locator('.gallery-tile').first().click();
  await page.getByRole('dialog').waitFor();
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('dialog').count(), 0);
  assert.equal(
    await page
      .locator('.gallery-tile')
      .first()
      .evaluate((el) => el === document.activeElement),
    true,
  );
  await page.getByRole('button', { name: 'Celebrations', exact: true }).click();
  assert.equal(await page.locator('.gallery-tile').count(), 1);

  await page.goto(base + '/contact?topic=event&drink=Strawberry%20Kiss', {
    waitUntil: 'networkidle',
  });
  assert.equal(
    await page.getByLabel('I’m interested in').inputValue(),
    'Event or bulk order',
  );
  assert.match(
    await page.getByLabel('Your message').inputValue(),
    /Strawberry Kiss/,
  );
  await page.getByLabel('Guest count').fill('200');
  await page.screenshot({
    path: '/tmp/deezobo-qa/contact-desktop.png',
    fullPage: true,
  });
  await page.goto(base + '/newsletter');
  await page.waitForURL('**/about');
  await page.getByRole('heading', { name: /Rooted in tradition/ }).waitFor();

  // A localStorage flag from the reference app must not unlock administration.
  await page.evaluate(() => localStorage.setItem('isAdmin', 'true'));
  await page.goto(base + '/admin');
  await page.waitForURL((url) => url.pathname === '/login');
  assert.equal(
    await page.getByRole('heading', { name: 'Welcome back.' }).count(),
    0,
  );

  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of [
    '/',
    '/order',
    '/gallery',
    '/about',
    '/contact',
    '/cart',
    '/login',
  ]) {
    await page.goto(base + path, { waitUntil: 'networkidle' });
    await noOverflow(page);
    const bad = await page
      .locator('img')
      .evaluateAll((imgs) =>
        imgs
          .filter((i) => i.complete && i.naturalWidth === 0)
          .map((i) => i.src),
      );
    assert.deepEqual(bad, []);
  }
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /Menu/ }).click();
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Gallery', exact: true })
    .click();
  await page.waitForURL('**/gallery');
  assert.equal(
    await page
      .getByRole('button', { name: /Menu/ })
      .getAttribute('aria-expanded'),
    'false',
  );
  await page.goto(base, { waitUntil: 'networkidle' });
  await capture(page, '/tmp/deezobo-qa/home-mobile.png');
  await context.close();

  if (backend) {
    const ordinary = await contextWithRole('customer', true);
    const customer = await ordinary.newPage();
    await customer.goto(base + '/admin', { waitUntil: 'networkidle' });
    await customer.waitForURL(
      (url) =>
        url.pathname === '/login' &&
        url.searchParams.get('access') === 'required' &&
        url.searchParams.get('next') === '/admin',
    );
    await customer
      .getByText('This account does not have administrator access.', {
        exact: false,
      })
      .waitFor();
    await customer.goto(base + '/account', { waitUntil: 'networkidle' });
    await customer
      .getByRole('heading', { name: 'Your Dee Zobo account.' })
      .waitFor();
    await ordinary.close();
    const admin = await contextWithRole('admin', true);
    const manager = await admin.newPage();
    await manager.goto(base + '/admin', { waitUntil: 'networkidle' });
    await manager
      .getByRole('heading', { name: 'Your drinks', exact: true })
      .waitFor();
    assert.equal(await manager.locator('.admin-card').count(), 7);
    await manager.getByRole('button', { name: 'Add drink' }).click();
    await manager.getByLabel('Name', { exact: true }).fill('Test infusion');
    await manager
      .getByLabel('Description', { exact: true })
      .fill('A temporary test drink.');
    await manager
      .getByLabel('Image URL or /images/ path')
      .fill('/images/brochure/bottled-zobo.jpg');
    await manager.getByLabel('Image description').fill('Test bottles');
    await manager
      .getByRole('button', { name: 'Save drink', exact: true })
      .click();
    await manager.getByText('Saved successfully.', { exact: true }).waitFor();
    await manager.getByRole('button', { name: 'Edit drink' }).first().click();
    await manager.getByLabel('Name', { exact: true }).fill('Updated drink');
    await manager
      .getByRole('button', { name: 'Save drink', exact: true })
      .click();
    await manager.getByText('Saved successfully.', { exact: true }).waitFor();
    await manager.getByRole('button', { name: 'Gallery', exact: true }).click();
    assert.equal(await manager.locator('.admin-card').count(), 6);
    await manager.getByRole('button', { name: 'Add image' }).click();
    await manager
      .getByLabel('Image URL or /images/ path')
      .fill('/images/brochure/mocktail-event.png');
    await manager
      .getByLabel('Caption and image description')
      .fill('Test gallery image');
    await manager
      .getByRole('button', { name: 'Save image', exact: true })
      .click();
    await manager.getByText('Saved successfully.', { exact: true }).waitFor();
    await manager.screenshot({
      path: '/tmp/deezobo-qa/admin-desktop.png',
      fullPage: true,
    });
    await admin.close();
  }
  assert.deepEqual(errors, []);
  console.log(
    'PASS: menu search/filter, product selection, basket persistence, order email, gallery keyboard/focus, About redirect, account/admin guards, admin add/edit, mobile navigation, images and overflow.',
  );
} finally {
  await browser.close();
}
