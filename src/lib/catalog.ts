import type { BasketItem, Beverage, Category } from '../types/catalog.ts';

export function money(minor: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: minor % 100 === 0 ? 0 : 2,
  }).format(minor / 100);
}
export function filterProducts(
  products: Beverage[],
  query: string,
  category: Category | 'all',
) {
  const q = query.trim().toLowerCase();
  return products.filter(
    (p) =>
      p.active &&
      (category === 'all' || p.category === category) &&
      [p.name, p.description, ...p.flavorNotes]
        .join(' ')
        .toLowerCase()
        .includes(q),
  );
}
export function validQuantity(value: number) {
  return Number.isInteger(value) && value > 0 && value <= 999;
}
export function parseBasket(raw: string | null): BasketItem[] {
  try {
    const parsed: unknown = JSON.parse(raw ?? '[]');
    if (!Array.isArray(parsed)) return [];
    const seen = new Set<string>();
    return parsed
      .filter((item): item is BasketItem => {
        if (
          !item ||
          typeof item !== 'object' ||
          typeof item.productId !== 'string' ||
          typeof item.optionId !== 'string' ||
          !validQuantity(item.quantity)
        )
          return false;
        const key = JSON.stringify([item.productId, item.optionId]);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map(({ productId, optionId, quantity }) => ({
        productId,
        optionId,
        quantity,
      }));
  } catch {
    return [];
  }
}
export function emailDraft(email: string, subject: string, body: string) {
  return (
    'mailto:' +
    email +
    '?subject=' +
    encodeURIComponent(subject) +
    '&body=' +
    encodeURIComponent(body)
  );
}
export function isAdminRole(value: unknown): boolean {
  return value === true;
}
export function safeImageUrl(value: string): boolean {
  if (value.startsWith('/images/') && !value.includes('..')) return true;
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}
