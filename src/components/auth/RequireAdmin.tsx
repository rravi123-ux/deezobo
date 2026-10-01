import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RequireAdmin() {
  const { loading, session, isAdmin, error } = useAuth();
  if (loading)
    return (
      <div className="page-shell">
        <p role="status">Verifying access…</p>
      </div>
    );
  if (!session) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/login?access=required" replace />;
  if (error)
    return (
      <div className="page-shell">
        <p role="alert">{error}</p>
      </div>
    );
  return <Outlet />;
}
