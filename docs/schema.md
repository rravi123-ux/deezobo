# Supabase scope

## Implemented by this branch's migrations

| Table         | Purpose                                                                                                |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| user_roles    | Server-managed owner/admin assignment by Auth UUID, with active flag                                   |
| products      | Drink metadata, flavor notes, image, category, published/featured flags and display size/price options |
| gallery_items | Image URL, caption, category, display order and publication state                                      |

The `is_deezobo_admin()` function checks the caller's role in a protected table.
Public queries see only published products/gallery images. Admins can read drafts
and create/update rows. There are no client permissions for granting roles.
Price-option JSON is validated in PostgreSQL.

Options remain in the product row for simple catalog editing. The cart uses those
stable product and option IDs locally, then prepares an email request. It does not
create database orders or collect payment.

## Deferred commerce extensions

Versioned product variants, orders, immutable order items, online checkout,
promotions and eligibility, delivery fees, taxes, inquiries, and events remain
planned. Supabase Auth owns credentials. Do not store passwords, trust browser
totals, or expose private pickup details.

See [admin setup](admin-setup.md) before applying the migration. No schema change
has been executed against the live Supabase project by this branch.
