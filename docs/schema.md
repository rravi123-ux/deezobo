# Minimal Supabase plan

This is a design outline, not an applied migration. It deliberately reduces the
attached enterprise-sized dataset to the website's first-release needs.

| Table | Keep initially |
| --- | --- |
| profiles | Auth user reference, name, contact email, phone |
| user_roles | Auth user reference, owner/admin role; server-managed |
| products | Name, description, image, approved ingredients/nutrition, active flag |
| product_variants | Product reference, size label, price in minor units, currency, active flag |
| orders | Customer reference, contact/fulfillment snapshots, order and payment status, server-calculated totals, timestamps |
| order_items | Order/variant references, purchased name/size/price snapshots, quantity |
| promotions | Code, discount definition, start/end, active flag |
| promotion_products | Promotion/product references defining eligible drinks |
| inquiries | Name, reply channel, message, optional event details, follow-up status |
| events | Public pop-up name, time, approved public location, published flag |

Use IDs and timestamps where appropriate. Keep the cart in browser state/storage;
do not add cart tables at this stage. Expand only when an implemented feature needs it.

Implementation boundaries:

- Supabase Auth owns credentials; no password columns or browser-assigned admin roles.
- Add RLS and explicit grants with the first migration, before exposing customer data.
- Authorize customer reads and admin writes on the server. A React route guard alone
  does not protect data.
- Validate prices, quantities, promotions, fulfillment, and totals on the server.
  Never accept browser-supplied paid status. Preserve order item snapshots.
- Keep home pickup details and internal admin notes out of public queries and maps.
- Leave unknown prices, recipes, nutrition, delivery areas and fees unset until approved.
- Keep Square secrets server-side. Implement signed, idempotent payment processing
  before recording a successful payment.

Defer quote versioning, refunds ledgers, inventory, production reporting, notification
queues and retail stockists until those features are scoped. Refunds/reconciliation
must be designed before real payments go live. No supermarket listings are assumed.
