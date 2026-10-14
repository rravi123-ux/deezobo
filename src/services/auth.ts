import { supabase } from '../lib/supabase';

export async function signInWithGoogle(next = '/account') {
  if (!supabase)
    throw new Error('Sign-in is not configured yet. Please contact Dee Zobo.');
  const safeNext =
    next.startsWith('/') && !next.startsWith('//') ? next : '/account';
  const callback = new URL('/login', window.location.origin);
  callback.searchParams.set('next', safeNext);
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: callback.toString() },
  });
  if (error) throw error;
}
export async function signOut() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
