# Supabase

The connected storefront includes five migrations, in order:

1. `202610010001_catalog_admin.sql`: roles, products, gallery, and RLS.
2. `202610010002_brochure_catalog.sql`: initial menu/gallery from the 2026 brochure.
3. `202610140001_catalog_deletion.sql`: admin-only delete policies.
4. `202610140002_catalog_storage.sql`: the public `catalog-media` bucket with
   admin-only writes.
5. `202611030001_stripe_orders.sql`: server-written orders, immutable line-item
   snapshots, payment state, and customer/admin read policies.

Review your existing project before applying migrations. These have not been
applied to any live database. See [admin setup](../docs/admin-setup.md) for Google
OAuth and role provisioning. Privileged credentials stay server-side. Online
Stripe checkout setup is documented in [Stripe setup](../docs/stripe-setup.md).
