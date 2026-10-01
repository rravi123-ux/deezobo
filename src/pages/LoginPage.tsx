import { Navigate, useSearchParams } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../context/AuthContext';
export default function LoginPage() {
  const { isAdmin, loading } = useAuth();
  const [params] = useSearchParams();
  if (!loading && isAdmin) return <Navigate to="/admin" replace />;
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
