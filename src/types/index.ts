// Minimal shared domain types. Expand alongside the implemented schema.
export type FulfillmentMethod = 'pickup' | 'delivery' | 'event';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'pending' | 'paid' | 'failed' | 'refunded';

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  ingredients: string | null;
  nutrition: string | null; // Owner-approved information only; null means unknown.
  active: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sizeLabel: string;
  priceMinor: number; // Integer minor units; display using the approved currency.
  currency: string;
  active: boolean;
}

export interface CartItem {
  variantId: string;
  quantity: number; // Positive integer, including one bottle.
}

export interface OrderSummary {
  id: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentMethod: FulfillmentMethod;
  totalMinor: number;
  currency: string;
}
