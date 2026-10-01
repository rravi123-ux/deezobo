# Supabase scope

## Implemented by this branch's migration

| Table         | Purpose                                                                                                |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| user_roles    | Server-managed owner/admin assignment by Auth UUID, with active flag                                   |
| products      | Drink metadata, flavor notes, image, category, published/featured flags and display size/price options |
| gallery_items | Image URL, caption, category, display order and publication state                                      |

The `is_deezobo_admin()` function checks the caller's role in a protected table.
Public queries see only published products/gallery images. Admins can read drafts
and create/update rows. There are no client permissions for granting roles.
Price-option JSON is validated in PostgreSQL.

This is a display catalog with an inquiry cart, not a commerce schema. Options are
kept in the product row for simple catalog editing. Future checkout should promote
them into versioned variants and always revalidate money on the server.

## Deferred for online ordering

Profiles, purchasable variants, orders, immutable order items, promotions and
eligibility, inquiries and events remain planned. Supabase Auth owns credentials.
Do not store passwords, trust browser totals, or expose private pickup details.

See [admin setup](admin-setup.md) before applying the migration. No schema change
has been executed against the live Supabase project by this branch.
