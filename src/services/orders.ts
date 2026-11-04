import { supabase } from '../lib/supabase';
import type { Order, OrderItem, OrderStatus } from '../types/catalog';

type OrderItemRow = {
  id: number;
  product_name: string;
  option_label: string;
  unit_price_minor: number;
  quantity: number;
  line_total_minor: number;
};
type OrderRow = {
  id: string;
  customer_email: string;
  fulfillment_method: Order['fulfillmentMethod'];
  status: OrderStatus;
  currency: 'usd';
  item_subtotal_minor: number;
  amount_total_minor: number | null;
  created_at: string;
  paid_at: string | null;
  order_items: OrderItemRow[];
};

function itemFromRow(row: OrderItemRow): OrderItem {
  return {
    id: row.id,
    productName: row.product_name,
    optionLabel: row.option_label,
    unitPriceMinor: row.unit_price_minor,
    quantity: row.quantity,
    lineTotalMinor: row.line_total_minor,
  };
}

function orderFromRow(row: OrderRow): Order {
  return {
    id: row.id,
    customerEmail: row.customer_email,
    fulfillmentMethod: row.fulfillment_method,
    status: row.status,
    currency: row.currency,
    itemSubtotalMinor: row.item_subtotal_minor,
    amountTotalMinor: row.amount_total_minor,
    createdAt: row.created_at,
    paidAt: row.paid_at,
    items: row.order_items.map(itemFromRow),
  };
}

export async function fetchOrders() {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase
    .from('orders')
    .select(
      'id,customer_email,fulfillment_method,status,currency,item_subtotal_minor,amount_total_minor,created_at,paid_at,order_items(id,product_name,option_label,unit_price_minor,quantity,line_total_minor)',
    )
    .order('created_at', { ascending: false });
  if (error)
    throw new Error(
      'Orders could not be loaded. Check the Stripe order migration.',
    );
  return (data as OrderRow[]).map(orderFromRow);
}
// Intentionally unimplemented; do not return fake successful results.
export {};
