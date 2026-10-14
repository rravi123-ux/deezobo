import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RequireAuth() {
  const { loading, session } = useAuth();
  const location = useLocation();
  if (loading)
    return (
      <div className="page-shell page-width">
        <p role="status">Checking your account…</p>
      </div>
    );
  if (!session) {
    const next = location.pathname + location.search;
    return <Navigate to={'/login?next=' + encodeURIComponent(next)} replace />;
  }
  return <Outlet />;
}
