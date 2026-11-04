import { createClient } from 'npm:@supabase/supabase-js@2.117.2';

export function serviceClient() {
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key)
    throw new Error('Supabase service credentials are unavailable.');
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function optionalUserId(request: Request) {
  const authorization = request.headers.get('authorization') ?? '';
  if (!authorization.toLowerCase().startsWith('bearer ')) return null;
  const token = authorization.slice(7).trim();
  if (!token || token.startsWith('sb_')) return null;
  const { data, error } = await serviceClient().auth.getUser(token);
  return error ? null : (data.user?.id ?? null);
}
