import { supabase } from '../lib/supabase';

export async function signInWithGoogle() {
  if (!supabase)
    throw new Error('Sign-in is not configured yet. Please contact Dee Zobo.');
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + '/login' },
  });
  if (error) throw error;
}
export async function signOut() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
