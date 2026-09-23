import PageHeading from '../components/common/PageHeading';
import OrderManager from '../components/admin/OrderManager';
import ProductManager from '../components/admin/ProductManager';
import PromotionManager from '../components/admin/PromotionManager';
import InquiryManager from '../components/admin/InquiryManager';
import EventManager from '../components/admin/EventManager';
import BusinessSettings from '../components/admin/BusinessSettings';

export default function AdminPage() {
  return (
    <>
      <PageHeading
        title="Dee Zobo admin"
        description="Admin scaffold — role checks and business data must be connected before use."
      />
      <div className="component-grid">
        <OrderManager />
        <ProductManager />
        <PromotionManager />
        <InquiryManager />
        <EventManager />
        <BusinessSettings />
      </div>
    </>
  );
}
