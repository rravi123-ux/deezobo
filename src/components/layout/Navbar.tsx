import { Link, NavLink } from 'react-router-dom';
import { site } from '../../data/site';

const links = [
  ['/', 'Home'], ['/order', 'Order'], ['/cart', 'Cart'],
  ['/contact', 'Contact'], ['/login', 'Login'], ['/about', 'About us'],
] as const;

export default function Navbar() {
  return (
    <header className="site-header">
      <Link className="brand" to="/">{site.name}</Link>
      <nav aria-label="Main navigation">
        {links.map(([to, label]) => <NavLink key={to} to={to} end>{label}</NavLink>)}
      </nav>
    </header>
  );
}
