# Stripe Checkout and receipts

The code uses Stripe-hosted Checkout through Supabase Edge Functions. Product
IDs and quantities come from the browser, but active products and prices are
read again from Supabase before Stripe is called. Card details never pass
through the Dee Zobo website or database.

## 1. Owner account and payouts

Ruth must create the Stripe account at <https://dashboard.stripe.com/register>
and complete Stripe's business verification. Use Dee Zobo's business contact
details and a payout bank account owned or authorized by the business. The
developers should not enter, retain, or share the owner's identity, tax, bank,
or debit-card information.

In Stripe, complete the public business name, support email/phone, statement
descriptor, and receipt branding. Under **Settings > Business > Customer
emails**, enable **Successful payments** and **Refunds**. The integration also
sets `payment_intent_data.receipt_email`, so Stripe sends the successful-payment
receipt to the email entered in the cart in live mode. Stripe does not send
automatic receipts for test-mode payments.

## 2. Database and Edge Functions

Apply `supabase/migrations/202611030001_stripe_orders.sql` after the four catalog
migrations. It creates protected `orders` and `order_items` tables. Browser
clients have read-only access to their own signed-in orders; service-role Edge
Functions perform all writes, and Dee Zobo admins can read every order.

Link the Supabase CLI to project `eyyawlxrechtsukvgpjo`, then set test-mode
secrets. Never add these values to `.env.local`, a `VITE_` variable, Git, or the
browser bundle.

```sh
supabase login
supabase link --project-ref eyyawlxrechtsukvgpjo
supabase db push
supabase secrets set STRIPE_SECRET_KEY=sk_test_REPLACE_ME
supabase secrets set CHECKOUT_ALLOWED_ORIGINS=http://127.0.0.1:5173
```

## 3. Stripe webhook

In Stripe test mode, open **Workbench > Webhooks**, create a snapshot event
destination for **Your account**, and use this endpoint:

```text
https://eyyawlxrechtsukvgpjo.supabase.co/functions/v1/stripe-webhook
```

Subscribe to:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`
- `checkout.session.expired`
- `charge.refunded`

Reveal the endpoint signing secret, then save it in Supabase:

```sh
supabase secrets set STRIPE_WEBHOOK_SIGNING_SECRET=whsec_REPLACE_ME
```

Deploy all three functions:

```sh
supabase functions deploy create-checkout
supabase functions deploy checkout-status
supabase functions deploy stripe-webhook
```

`supabase/config.toml` makes the browser checkout functions available to guests
and the webhook available to Stripe. The checkout functions enforce an origin
allowlist. Stripe authenticates its webhook with the signature over the raw
request body.

## 4. Test and activate live mode

Run the site, add an available priced item, enter an email, and complete Stripe
test checkout with card `4242 4242 4242 4242`, any future expiry date, and any
CVC. Confirm:

1. Stripe shows the successful test payment.
2. The Supabase `orders` row changes to `paid` and has a Stripe PaymentIntent ID.
3. The signed-in customer sees only their own order under `/account`.
4. The Dee Zobo owner sees the order under **Admin > Orders**.
5. A canceled checkout preserves the cart.

Test mode does not automatically email receipts; use Stripe's **Send test
receipt** action to inspect one. Before accepting real payments, confirm product
availability, refund/cancellation terms, tax handling, and any delivery or event
fees. The current Checkout Session charges the catalog item subtotal only.

After Stripe activates the business account, repeat the webhook setup in live
mode, replace `STRIPE_SECRET_KEY` with the live secret, replace
`STRIPE_WEBHOOK_SIGNING_SECRET` with the live endpoint's secret, and add the
final website origin to `CHECKOUT_ALLOWED_ORIGINS`. Test one small real payment
and refund before launch.

References: [Stripe Checkout](https://docs.stripe.com/payments/checkout),
[automatic receipts](https://docs.stripe.com/receipts#automatic),
[Stripe webhooks](https://docs.stripe.com/webhooks), and
[Supabase Edge Function secrets](https://supabase.com/docs/guides/functions/secrets).
