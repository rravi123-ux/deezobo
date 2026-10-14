import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function SiteLayout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const titles: Record<string, string> = {
      '/': 'African herbal infusions',
      '/order': 'Our drinks',
      '/gallery': 'Gallery',
      '/about': 'Our story',
      '/contact': 'Contact us',
      '/login': 'Admin sign in',
      '/admin': 'Manage Dee Zobo',
      '/cart': 'Your selection',
    };
    document.title = (titles[pathname] ?? 'Dee Zobo') + ' | Dee Zobo';
    document.getElementById('main-content')?.focus({ preventScroll: true });
  }, [pathname]);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="announcement">
        African roots. Fresh perspectives. A sip worth sharing.
      </div>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
