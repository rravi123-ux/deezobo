# Dee Zobo scope

## Included in this skeleton

- The six requested pages: home, order/menu, cart, contact, login, and about us.
- Product gallery, size/quantity selection, ingredients and nutrition component slots.
- Featured drinks and product-specific promotions, with the base price shown first.
- Single bottles and larger quantities; pickup, delivery, and event fulfillment slots.
- Contact links, general messages, and event inquiries.
- Customer signup, login, password recovery, profile and order-history placeholders.
- Admin slots for orders from all channels, products/prices, promotions, inquiries,
  pop-ups, and business/contact settings.
- A planned Supabase integration and server-only checkout/payment entry points.

Navigation runs; forms, cart state, authentication, admin writes and payments are TODOs.
The admin and account routes show static outlines only and have no private data.
Add authentication guards and server/RLS permissions before connecting them.

## Decisions from the notes

Use the later meeting statement that Dee Zobo does not retail yet. The map component
is reserved for approved public pop-ups; stockists can be added when confirmed.
Home pickup addresses are private. General customer sign-in is requested; whether
checkout requires an account is still a product decision.

Square online payments and in-person tap-to-pay are separate future integrations.
This skeleton does not process either. Event orders may require manual follow-up
for guest counts, presentation, and logistics rather than immediate checkout.

## Still needed from Ruth

- Approved logo, palette, photos, product descriptions, ingredients and nutrition.
- Bottle sizes, prices, currency, available quantities, and preparation lead times.
- Delivery area/fees, pickup rules, private address, and event arrangements.
- International phone/WhatsApp number (the supplied local number lacks a confirmed country code).
- Original Google Form, preferred sign-in method, and guest-checkout preference.
- Square setup, payment/refund policies, and approved public pop-up locations.

Do not copy unverified nutrition, addresses, medical claims, or sample prices into the live site.
