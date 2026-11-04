import Stripe from 'npm:stripe@22.0.0';
import { serviceClient } from '../_shared/supabase.ts';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY');
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET');
if (!stripeSecret || !webhookSecret)
  throw new Error('Stripe webhook secrets are not configured.');

const stripe = new Stripe(stripeSecret);
const cryptoProvider = Stripe.createSubtleCryptoProvider();

async function updateSession(session: Stripe.Checkout.Session, status: string) {
  const orderId = session.metadata?.order_id;
  if (!orderId)
    throw new Error(`Checkout Session ${session.id} has no order_id.`);
  const paid = status === 'paid';
  const customerEmail =
    session.customer_details?.email ?? session.customer_email;
  const { error } = await serviceClient()
    .from('orders')
    .update({
      status,
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id:
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : null,
      ...(customerEmail ? { customer_email: customerEmail } : {}),
      amount_total_minor: session.amount_total,
      paid_at: paid ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);
  if (error) throw error;
}

Deno.serve(async (request) => {
  if (request.method !== 'POST')
    return new Response('Method not allowed.', { status: 405 });
  const signature = request.headers.get('stripe-signature');
  if (!signature)
    return new Response('Missing Stripe signature.', { status: 400 });
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      await request.text(),
      signature,
      webhookSecret,
      undefined,
      cryptoProvider,
    );
  } catch (reason) {
    console.error('Stripe signature verification failed.', reason);
    return new Response('Invalid Stripe signature.', { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      await updateSession(
        session,
        session.payment_status === 'paid' ? 'paid' : 'pending_payment',
      );
    } else if (event.type === 'checkout.session.async_payment_succeeded') {
      await updateSession(event.data.object as Stripe.Checkout.Session, 'paid');
    } else if (event.type === 'checkout.session.async_payment_failed') {
      await updateSession(
        event.data.object as Stripe.Checkout.Session,
        'payment_failed',
      );
    } else if (event.type === 'checkout.session.expired') {
      await updateSession(
        event.data.object as Stripe.Checkout.Session,
        'expired',
      );
    } else if (event.type === 'charge.refunded') {
      const charge = event.data.object as Stripe.Charge;
      if (charge.refunded && typeof charge.payment_intent === 'string') {
        const { error } = await serviceClient()
          .from('orders')
          .update({
            status: 'refunded',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_payment_intent_id', charge.payment_intent);
        if (error) throw error;
      }
    }
    return Response.json({ received: true });
  } catch (reason) {
    console.error(`Stripe event ${event.id} failed.`, reason);
    return new Response('Webhook processing failed.', { status: 500 });
  }
});
