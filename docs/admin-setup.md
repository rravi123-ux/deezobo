# Admin sign-in and catalog setup

This branch adds Supabase Google sign-in, an admin route guard, catalog/gallery
editors and database-enforced permissions. No production database migration or
provider configuration has been applied by this change.

1. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local`
   (the existing ignored `.env` also works). Use the project's public publishable
   key, never a secret/service-role key.
2. Inspect the project's existing schema. On a fresh project, apply
   `supabase/migrations/202610010001_catalog_admin.sql`, followed by
   `202610010002_brochure_catalog.sql` in order using the Supabase SQL editor.
   If `products`, `gallery_items`, or `user_roles` already exist, reconcile them
   with this migration rather than dropping existing data.
3. Enable Google under Supabase Authentication > Providers. Configure the Google
   client with Supabase's callback URL. Add `http://127.0.0.1:5173/login` and your
   final site's `/login` URL to Supabase's redirect allowlist. The client uses PKCE.
4. Have the owner sign in once, then copy their UUID from Authentication > Users.
   A trusted project administrator can grant the role in the SQL editor:

```sql
insert into public.user_roles (auth_user_id, role)
values ('REPLACE_WITH_AUTH_USER_UUID', 'owner');
```

5. Visit `/login` again. An authorized account reaches `/admin`, where it can
   create/edit drinks, sizes, display prices, featured status, gallery captions,
   publication state and display order. Images use existing `/images/` paths or
   HTTPS URLs; this branch does not implement file uploads.
6. Test an ordinary signed-in account as well: it must not see draft content or
   be able to write to either catalog table. Removing/deactivating its role
   immediately blocks writes through RLS even with a stale browser session.

Sign-out goes through Supabase. Admin state is never granted through localStorage
flags, email matching or user-editable metadata. Google authentication alone
does not confer admin access. There is no public admin registration or default
password.

The public pages fall back to the bundled brochure catalog if the database is
unavailable and label it as the 2026 brochure menu. A successful live query with
zero products stays empty. Saved admin changes refresh the current public catalog.
Images can be unpublished and products made inactive instead of deleting them.

The cart is an **inquiry selection**, stored locally by stable product/size IDs.
Prices shown come from the current loaded catalog; no order or payment is created.
Contact and order forms prepare email drafts. They never claim a message was sent.

Setup references: [Google sign-in](https://supabase.com/docs/guides/auth/social-login/auth-google)
and [row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security).
