# Backend scaffold

No Supabase project, tables, policies, or functions have been deployed.

- `migrations/`: add reviewed SQL and RLS policies using `docs/schema.md` as a starting point.
- `functions/create-checkout/`: future server-authoritative checkout.
- `functions/square-webhook/`: future verified payment status updates.

Function files are TODO modules, not deployable request handlers. Add Supabase CLI
configuration and dependencies when implementing the backend. Keep privileged
Supabase keys and Square tokens/webhook secrets in server-side secret storage.
