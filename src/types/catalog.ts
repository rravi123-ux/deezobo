export type Category = 'infusions' | 'mocktails';
export interface SizeOption {
  id: string;
  label: string;
  priceMinor: number;
}
export interface Beverage {
  id: string;
  name: string;
  category: Category;
  description: string;
  flavorNotes: string[];
  imageUrl: string;
  imageAlt: string;
  options: SizeOption[];
  featured: boolean;
  active: boolean;
}
export interface GalleryImage {
  id: string;
  imageUrl: string;
  caption: string;
  category: Category | 'moments';
  displayOrder: number;
  published: boolean;
}
export interface BasketItem {
  productId: string;
  optionId: string;
  quantity: number;
}

export type OrderStatus =
  | 'pending_checkout'
  | 'pending_payment'
  | 'paid'
  | 'payment_failed'
  | 'expired'
  | 'refunded';
export interface OrderItem {
  id: number;
  productName: string;
  optionLabel: string;
  unitPriceMinor: number;
  quantity: number;
  lineTotalMinor: number;
}
export interface Order {
  id: string;
  customerEmail: string;
  fulfillmentMethod: 'pickup' | 'delivery' | 'event';
  status: OrderStatus;
  currency: 'usd';
  itemSubtotalMinor: number;
  amountTotalMinor: number | null;
  createdAt: string;
  paidAt: string | null;
  items: OrderItem[];
}
