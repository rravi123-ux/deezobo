import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function SiteLayout() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <div className="scaffold-notice">
        Development scaffold — ordering, account access, and payments are not connected.
      </div>
      <main id="main-content" className="container" tabIndex={-1}><Outlet /></main>
      <Footer />
    </>
  );
}
