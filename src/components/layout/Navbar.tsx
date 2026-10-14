import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const links = [
  ['/', 'Welcome'],
  ['/order', 'Our drinks'],
  ['/gallery', 'Gallery'],
  ['/about', 'About us'],
  ['/contact', 'Contact'],
] as const;
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const { session, isAdmin } = useAuth();
  return (
    <header className="site-header">
      <div className="nav-inner">
        <Link
          to="/"
          className="brand"
          onClick={() => setOpen(false)}
          aria-label="Dee Zobo home"
        >
          <span>
            Dee Zobo
            <span className="brand-flower" aria-hidden="true">
              ✿
            </span>
          </span>
          <small>AFRICAN HERBAL INFUSIONS</small>
        </Link>
        <button
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? 'Close' : 'Menu'}{' '}
          <span aria-hidden="true">{open ? '×' : '☰'}</span>
        </button>
        <nav
          id="main-nav"
          aria-label="Main navigation"
          className={open ? 'main-nav is-open' : 'main-nav'}
        >
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end onClick={() => setOpen(false)}>
              {label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/admin" onClick={() => setOpen(false)}>
              Manage
            </NavLink>
          )}
          <NavLink
            to={session ? '/account' : '/login'}
            onClick={() => setOpen(false)}
          >
            {session ? 'Account' : 'Sign in'}
          </NavLink>
          <NavLink
            className="nav-basket"
            to="/cart"
            onClick={() => setOpen(false)}
          >
            Your selection <span>{count}</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
