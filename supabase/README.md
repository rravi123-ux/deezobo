# Supabase

The catalog/admin implementation includes two migrations, in order:

1. `202610010001_catalog_admin.sql`: roles, products, gallery, and RLS.
2. `202610010002_brochure_catalog.sql`: initial menu/gallery from the 2026 brochure.

Review your existing project before applying migrations. These have not been
applied to any live database. See [admin setup](../docs/admin-setup.md) for Google
OAuth and role provisioning. Privileged credentials stay server-side.

The functions in `functions/` remain TODO modules for later checkout and payment
work; they are not request handlers and must not be deployed as-is.
