# Current scope and remaining decisions

Implemented: welcome, drinks menu, product details, image gallery, About us,
contact/email drafts, local cart, Stripe-hosted checkout and receipts,
customer/admin Google sign-in, protected catalog/gallery editors, image uploads,
and customer/admin order views.
See [adaptation notes](fwwill-adaptation.md) for the source
mapping and content decisions.

The later meeting note says Dee Zobo is not yet in supermarkets. No stockist map
is published. Pickup addresses stay private and fulfillment is arranged directly.
The confirmed public email is info.deezobo@gmail.com; the brochure supplies the
US phone and updated @dee_zobo Instagram handle.

Before accepting production orders, confirm:

- Bottle availability, preparation lead times, delivery eligibility/fees and pickup windows.
- Complete ingredients, allergens, storage/shelf life and verified numeric nutrition.
- Google customer sign-in copy and the support process for account access.
- Refund, tax, delivery-charge, terms, and cancellation policies before live mode.
- Promotion rules, custom event quantities/presentation, and contact data retention.
- Domain and hosting ownership, final logo usage and public launch approval.

Google provider setup, redirect URLs, migrations, and administrator role
provisioning are described in admin-setup.md. Stripe deployment and account-owner
steps are described in stripe-setup.md. The contact form still prepares an email
draft; completed checkout orders are stored in Supabase.
