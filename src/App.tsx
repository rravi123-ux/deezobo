import { Navigate, Route, Routes } from 'react-router-dom';
import SiteLayout from './components/layout/SiteLayout';
import RequireAdmin from './components/auth/RequireAdmin';
import RequireAuth from './components/auth/RequireAuth';
import HomePage from './pages/HomePage';
import OrderPage from './pages/OrderPage';
import CartPage from './pages/CartPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import AccountPage from './pages/AccountPage';
import AdminPage from './pages/AdminPage';
import GalleryPage from './pages/GalleryPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="order" element={<OrderPage />} />
        <Route path="products" element={<Navigate to="/order" replace />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="contacts" element={<Navigate to="/contact" replace />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signin" element={<Navigate to="/login" replace />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="newsletter" element={<Navigate to="/about" replace />} />
        <Route element={<RequireAuth />}>
          <Route path="account" element={<AccountPage />} />
        </Route>
        <Route element={<RequireAdmin />}>
          <Route path="admin" element={<AdminPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
