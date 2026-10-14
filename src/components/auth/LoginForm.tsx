import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { signInWithGoogle, signOut } from '../../services/auth';
export default function LoginForm() {
  const { session, loading, error: authError } = useAuth();
  const [params] = useSearchParams();
  const next = params.get('next') ?? '/account';
  const adminIntent = next === '/admin';
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function login() {
    setError('');
    setBusy(true);
    try {
      await signInWithGoogle(next);
    } catch {
      setError(
        'Google sign-in could not start. Please try again or contact the site owner.',
      );
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    setBusy(true);
    setError('');
    try {
      await signOut();
    } catch {
      setError('Sign-out failed. Please try again.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="login-card">
      <span className="login-flower" aria-hidden="true">
        ✿
      </span>
      <p className="eyebrow">
        {adminIntent ? 'Behind the scenes' : 'Your Dee Zobo account'}
      </p>
      <h1>{adminIntent ? 'Admin sign in' : 'Sign in'}</h1>
      <p>
        {adminIntent
          ? 'Sign in to manage the Dee Zobo menu and gallery.'
          : 'Sign in securely to access your Dee Zobo account.'}
      </p>
      {(error || authError) && (
        <p role="alert" className="error">
          {error || authError}
        </p>
      )}
      {!supabase && (
        <p role="status">
          Sign-in is not available yet. Please contact Dee Zobo for help.
        </p>
      )}
      {loading ? (
        <p role="status">Checking your session…</p>
      ) : session ? (
        <>
          <p className="notice" role="status">
            You’re signed in as {session.user.email}.
            {adminIntent
              ? ' This account does not have administrator access.'
              : ''}
          </p>
          <button
            className="button full-width"
            onClick={logout}
            disabled={busy}
          >
            Sign out and use another account
          </button>
        </>
      ) : (
        <button
          className="button google-button full-width"
          disabled={busy || !supabase}
          onClick={login}
        >
          <span className="google-letter" aria-hidden="true">
            G
          </span>
          {busy ? 'Opening Google…' : 'Continue with Google'}
        </button>
      )}
      <p className="fine-print">
        {adminIntent
          ? 'Admin access is limited to accounts authorized by Dee Zobo.'
          : 'Google handles your password; Dee Zobo never receives it.'}
      </p>
    </div>
  );
}
