import Stripe from 'npm:stripe@22.0.0';
import {
  corsHeaders,
  isAllowedOrigin,
  json,
  publicError,
} from '../_shared/http.ts';
import { serviceClient } from '../_shared/supabase.ts';

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS')
    return new Response(null, { status: 204, headers: corsHeaders(request) });
  if (request.method !== 'POST')
    return json(request, { error: 'Method not allowed.' }, 405);
  if (!isAllowedOrigin(request))
    return json(request, { error: 'Origin is not allowed.' }, 403);
  try {
    const secret = Deno.env.get('STRIPE_SECRET_KEY');
    if (!secret) throw new Error('STRIPE_SECRET_KEY is not configured.');
    const body = (await request.json()) as { sessionId?: unknown };
    const sessionId = typeof body.sessionId === 'string' ? body.sessionId : '';
    if (!/^cs_(test_|live_)?[A-Za-z0-9_]+$/.test(sessionId))
      return json(request, { error: 'Invalid checkout session.' }, 400);
    const session = await new Stripe(secret).checkout.sessions.retrieve(
      sessionId,
    );
    const orderId = session.metadata?.order_id;
    if (orderId && session.payment_status === 'paid') {
      const customerEmail =
        session.customer_details?.email ?? session.customer_email;
      const { error } = await serviceClient()
        .from('orders')
        .update({
          status: 'paid',
          stripe_payment_intent_id:
            typeof session.payment_intent === 'string'
              ? session.payment_intent
              : null,
          ...(customerEmail ? { customer_email: customerEmail } : {}),
          amount_total_minor: session.amount_total,
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);
      if (error) throw error;
    }
    const state =
      session.payment_status === 'paid'
        ? 'paid'
        : session.status === 'expired'
          ? 'expired'
          : session.status === 'complete'
            ? 'processing'
            : 'open';
    return json(request, { state });
  } catch (reason) {
    return json(request, { error: publicError(reason) }, 500);
  }
});
