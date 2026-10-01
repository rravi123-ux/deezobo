import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { isAdminRole } from '../lib/catalog';

type AuthState = {
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  error: string;
};
const AuthContext = createContext<AuthState>({
  session: null,
  loading: true,
  isAdmin: false,
  error: '',
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    session: null,
    loading: true,
    isAdmin: false,
    error: '',
  });
  useEffect(() => {
    const client = supabase;
    if (!client) {
      setState({ session: null, loading: false, isAdmin: false, error: '' });
      return;
    }
    let active = true;
    let revision = 0;
    async function sync(session: Session | null) {
      const current = ++revision;
      setState({ session, loading: !!session, isAdmin: false, error: '' });
      if (!session) return;
      try {
        const { data, error } = await client!.rpc('is_deezobo_admin');
        if (active && current === revision) {
          setState({
            session,
            loading: false,
            isAdmin: !error && isAdminRole(data),
            error: error
              ? 'Admin access could not be verified. Please contact the site owner.'
              : '',
          });
        }
      } catch {
        if (active && current === revision)
          setState({
            session,
            loading: false,
            isAdmin: false,
            error: 'Unable to verify admin access. Please try again.',
          });
      }
    }
    // Defer database work outside the auth event callback to avoid holding its lock.
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      queueMicrotask(() => {
        if (active) void sync(session);
      });
    });
    const initialRevision = revision;
    void client.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active || revision !== initialRevision) return;
        if (error)
          setState({
            session: null,
            loading: false,
            isAdmin: false,
            error: 'Your session could not be restored. Please sign in again.',
          });
        else void sync(data.session);
      })
      .catch(() => {
        if (active && revision === initialRevision)
          setState({
            session: null,
            loading: false,
            isAdmin: false,
            error: 'Sign-in is temporarily unavailable.',
          });
      });
    return () => {
      active = false;
      revision++;
      subscription.unsubscribe();
    };
  }, []);
  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  return useContext(AuthContext);
}
