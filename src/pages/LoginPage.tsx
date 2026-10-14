import { Navigate, useSearchParams } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../context/AuthContext';
export default function LoginPage() {
  const { session, isAdmin, loading } = useAuth();
  const [params] = useSearchParams();
  const requested = params.get('next');
  const next =
    requested?.startsWith('/') && !requested.startsWith('//')
      ? requested
      : '/account';
  if (!loading && session && (next !== '/admin' || isAdmin))
    return <Navigate to={next} replace />;
  return (
    <div className="login-page page-width">
      {params.has('error') && (
        <p className="error" role="alert">
          Sign-in was not completed. Please try again.
        </p>
      )}
      <LoginForm />
    </div>
  );
}
