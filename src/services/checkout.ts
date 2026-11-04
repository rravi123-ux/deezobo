import { supabase } from '../lib/supabase';
import { isStripeCheckoutUrl } from '../lib/catalog';
import type { BasketItem } from '../types/catalog';

export type FulfillmentMethod = 'pickup' | 'delivery' | 'event';
export type CheckoutState = 'paid' | 'processing' | 'expired' | 'open';

type CheckoutResponse = { url?: unknown; error?: unknown };
type StatusResponse = { state?: unknown; error?: unknown };

export const checkoutConfigured = Boolean(supabase);

function responseMessage(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

export async function createCheckout(input: {
  items: BasketItem[];
  email: string;
  fulfillmentMethod: FulfillmentMethod;
}) {
  if (!supabase)
    throw new Error('Online checkout has not been configured yet.');
  const { data, error } = await supabase.functions.invoke<CheckoutResponse>(
    'create-checkout',
    { body: input },
  );
  if (error)
    throw new Error(
      responseMessage(data?.error, 'Stripe Checkout could not be started.'),
    );
  if (!isStripeCheckoutUrl(data?.url))
    throw new Error('Stripe Checkout returned an invalid payment link.');
  return data.url;
}

export async function getCheckoutState(sessionId: string) {
  if (!supabase)
    throw new Error('Online checkout has not been configured yet.');
  const { data, error } = await supabase.functions.invoke<StatusResponse>(
    'checkout-status',
    { body: { sessionId } },
  );
  if (error)
    throw new Error(
      responseMessage(data?.error, 'Payment status could not be verified.'),
    );
  if (!['paid', 'processing', 'expired', 'open'].includes(String(data?.state)))
    throw new Error('Payment status could not be verified.');
  return data!.state as CheckoutState;
}
