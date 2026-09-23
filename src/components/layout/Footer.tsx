import { Link } from 'react-router-dom';
import { site } from '../../data/site';

export default function Footer() {
  return (
    <footer className="site-footer">
      <span>{site.name} · Made-to-order hibiscus beverages</span>
      <nav aria-label="Scaffold pages">
        <Link to="/account">Account scaffold</Link>
        <Link to="/admin">Admin scaffold</Link>
      </nav>
    </footer>
  );
}
