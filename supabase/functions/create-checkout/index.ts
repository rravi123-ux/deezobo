import Stripe from 'npm:stripe@22.0.0';
import {
  corsHeaders,
  isAllowedOrigin,
  json,
  publicError,
  requestOrigin,
} from '../_shared/http.ts';
import { optionalUserId, serviceClient } from '../_shared/supabase.ts';

type RequestedItem = {
  productId: string;
  optionId: string;
  quantity: number;
};
type ProductOption = { id: string; label: string; priceMinor: number };
type ProductRow = {
  id: string;
  name: string;
  description: string;
  active: boolean;
  options: ProductOption[];
};
type CheckoutBody = {
  email?: unknown;
  fulfillmentMethod?: unknown;
  items?: unknown;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const fulfillmentMethods = new Set(['pickup', 'delivery', 'event']);

function validItem(value: unknown): value is RequestedItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.productId === 'string' &&
    item.productId.length > 0 &&
    item.productId.length <= 200 &&
    typeof item.optionId === 'string' &&
    item.optionId.length > 0 &&
    item.optionId.length <= 200 &&
    Number.isInteger(item.quantity) &&
    Number(item.quantity) >= 1 &&
    Number(item.quantity) <= 999
  );
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS')
    return new Response(null, { status: 204, headers: corsHeaders(request) });
  if (request.method !== 'POST')
    return json(request, { error: 'Method not allowed.' }, 405);
  if (!isAllowedOrigin(request))
    return json(request, { error: 'Origin is not allowed.' }, 403);

  try {
    const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecret) throw new Error('STRIPE_SECRET_KEY is not configured.');
    const body = (await request.json()) as CheckoutBody;
    const email =
      typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const fulfillmentMethod =
      typeof body.fulfillmentMethod === 'string' ? body.fulfillmentMethod : '';
    const items = Array.isArray(body.items) ? body.items : [];
    if (!emailPattern.test(email) || email.length > 320)
      return json(
        request,
        { error: 'Enter a valid receipt email address.' },
        400,
      );
    if (!fulfillmentMethods.has(fulfillmentMethod))
      return json(
        request,
        { error: 'Choose a valid fulfillment method.' },
        400,
      );
    if (!items.length || items.length > 20 || !items.every(validItem))
      return json(request, { error: 'Your cart contains invalid items.' }, 400);

    const uniqueKeys = new Set(
      items.map((item) => `${item.productId}\u0000${item.optionId}`),
    );
    if (uniqueKeys.size !== items.length)
      return json(
        request,
        { error: 'Your cart contains duplicate items.' },
        400,
      );

    const db = serviceClient();
    const productIds = [...new Set(items.map((item) => item.productId))];
    const { data, error } = await db
      .from('products')
      .select('id,name,description,active,options')
      .in('id', productIds)
      .eq('active', true);
    if (error) throw error;
    const products = new Map(
      ((data ?? []) as ProductRow[]).map((product) => [product.id, product]),
    );

    const lines = items.map((item) => {
      const product = products.get(item.productId);
      const option = product?.options.find(
        (candidate) => candidate.id === item.optionId,
      );
      if (
        !product ||
        !option ||
        !Number.isInteger(option.priceMinor) ||
        option.priceMinor < 50
      )
        throw new Error('A selected product or size is no longer available.');
      return { item, product, option };
    });
    const subtotal = lines.reduce(
      (sum, line) => sum + line.option.priceMinor * line.item.quantity,
      0,
    );
    if (
      !Number.isSafeInteger(subtotal) ||
      subtotal < 50 ||
      subtotal > 100_000_000
    )
      return json(
        request,
        { error: 'The cart total is outside the supported range.' },
        400,
      );

    const userId = await optionalUserId(request);
    const { data: order, error: orderError } = await db
      .from('orders')
      .insert({
        auth_user_id: userId,
        customer_email: email,
        fulfillment_method: fulfillmentMethod,
        status: 'pending_checkout',
        currency: 'usd',
        item_subtotal_minor: subtotal,
      })
      .select('id')
      .single();
    if (orderError || !order)
      throw orderError ?? new Error('Order was not created.');

    const orderItems = lines.map(({ item, product, option }) => ({
      order_id: order.id,
      product_id: product.id,
      option_id: option.id,
      product_name: product.name,
      option_label: option.label,
      unit_price_minor: option.priceMinor,
      quantity: item.quantity,
      line_total_minor: option.priceMinor * item.quantity,
    }));
    const { error: itemError } = await db
      .from('order_items')
      .insert(orderItems);
    if (itemError) {
      await db.from('orders').delete().eq('id', order.id);
      throw itemError;
    }

    const stripe = new Stripe(stripeSecret);
    const origin = requestOrigin(request);
    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.create(
        {
          mode: 'payment',
          payment_method_types: ['card'],
          customer_email: email,
          client_reference_id: order.id,
          metadata: {
            order_id: order.id,
            fulfillment_method: fulfillmentMethod,
          },
          payment_intent_data: {
            receipt_email: email,
            metadata: { order_id: order.id },
          },
          line_items: lines.map(({ item, product, option }) => ({
            quantity: item.quantity,
            price_data: {
              currency: 'usd',
              unit_amount: option.priceMinor,
              product_data: {
                name: `${product.name} — ${option.label}`,
                description: product.description.slice(0, 500),
                metadata: {
                  product_id: product.id,
                  option_id: option.id,
                },
              },
            },
          })),
          billing_address_collection: 'auto',
          phone_number_collection: { enabled: true },
          ...(fulfillmentMethod === 'delivery'
            ? {
                shipping_address_collection: {
                  allowed_countries: ['US'],
                },
              }
            : {}),
          success_url: `${origin}/cart?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/cart?checkout=canceled`,
          submit_type: 'pay',
        },
        { idempotencyKey: order.id },
      );
    } catch (reason) {
      await db
        .from('orders')
        .update({
          status: 'payment_failed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', order.id);
      throw reason;
    }
    if (!session.url) throw new Error('Stripe did not return a checkout URL.');
    const { error: updateError } = await db
      .from('orders')
      .update({
        stripe_checkout_session_id: session.id,
        status: 'pending_payment',
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id);
    if (updateError) throw updateError;
    return json(request, { url: session.url });
  } catch (reason) {
    const message =
      reason instanceof Error && reason.message.includes('no longer available')
        ? reason.message
        : publicError(reason);
    return json(request, { error: message }, 500);
  }
});
