import { Link } from 'react-router-dom';
import PageHeading from '../components/common/PageHeading';
import { useAuth } from '../context/AuthContext';
import { signOut } from '../services/auth';

export default function AccountPage() {
  const { session, isAdmin } = useAuth();
  return (
    <div className="page-shell page-width">
      <PageHeading
        eyebrow={session?.user.email ?? undefined}
        title="Your Dee Zobo account."
        description="Browse the menu, build a selection, or contact Dee Zobo about an existing request."
      />
      <div className="button-row">
        <Link className="button" to="/order">
          Shop drinks ↗
        </Link>
        <Link className="button button-outline" to="/contact">
          Contact Dee Zobo
        </Link>
        {isAdmin && (
          <Link className="button button-outline" to="/admin">
            Open admin
          </Link>
        )}
        <button
          className="button button-outline"
          onClick={() => void signOut()}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
