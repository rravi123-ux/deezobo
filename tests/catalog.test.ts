import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterProducts,
  parseBasket,
  money,
  emailDraft,
  validQuantity,
  isAdminRole,
  safeImageUrl,
} from '../src/lib/catalog.ts';
import { brochureProducts } from '../src/data/products.ts';

test('search includes flavor notes, categories, and only published products', () => {
  assert.equal(
    filterProducts(brochureProducts, ' GINGER ', 'infusions').length,
    3,
  );
  assert.equal(
    filterProducts(brochureProducts, 'tropical', 'mocktails')[0].id,
    'tropical-sunset-mocktail',
  );
  assert.deepEqual(
    filterProducts([{ ...brochureProducts[0], active: false }], '', 'all'),
    [],
  );
  assert.deepEqual(filterProducts(brochureProducts, 'not-a-flavor', 'all'), []);
});
test('brochure bottle and gallon prices are preserved without inventing mocktail prices', () => {
  assert.deepEqual(
    brochureProducts[0].options.map((o) => o.priceMinor),
    [500, 700, 4000, 5500, 6000],
  );
  assert.ok(
    brochureProducts
      .filter((p) => p.category === 'mocktails')
      .every((p) => p.options.length === 0),
  );
  assert.equal(money(500), '$5');
  assert.equal(money(725), '$7.25');
});
test('malformed, duplicate and unsafe quantities cannot enter a restored basket', () => {
  assert.deepEqual(parseBasket('bad json'), []);
  assert.deepEqual(parseBasket('{}'), []);
  const item = { productId: 'p', optionId: '8oz', quantity: 2 };
  assert.deepEqual(
    parseBasket(
      JSON.stringify([
        item,
        item,
        { ...item, quantity: -1 },
        { ...item, quantity: 1.5 },
        null,
      ]),
    ),
    [item],
  );
  assert.equal(validQuantity(1000), false);
  assert.equal(validQuantity(1), true);
  assert.equal(validQuantity(Infinity), false);
});
test('email drafts preserve special characters without injecting mail headers', () => {
  const url = new URL(
    emailDraft('info.deezobo@gmail.com', 'Tea & <fruit>', 'Name: A&B\nHello?'),
  );
  assert.equal(url.protocol, 'mailto:');
  assert.equal(url.searchParams.get('subject'), 'Tea & <fruit>');
  assert.equal(url.searchParams.get('body'), 'Name: A&B\nHello?');
});
test('admin check accepts only the boolean result of the protected RPC', () => {
  for (const v of [
    null,
    undefined,
    'true',
    'admin',
    1,
    { role: 'admin' },
    false,
  ])
    assert.equal(isAdminRole(v), false);
  assert.equal(isAdminRole(true), true);
});
test('image fields reject active or insecure URLs', () => {
  assert.ok(safeImageUrl('/images/brochure/brand-cover.png'));
  assert.ok(safeImageUrl('https://example.com/image.jpg'));
  for (const v of [
    'javascript:alert(1)',
    'data:text/html,x',
    'http://example.com/x',
    '//example.com/x',
    '/images/../.env',
  ])
    assert.equal(safeImageUrl(v), false);
});
