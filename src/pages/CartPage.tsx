import PageHeading from '../components/common/PageHeading';
import CartItems from '../components/cart/CartItems';
import PromoCodeForm from '../components/cart/PromoCodeForm';
import CartSummary from '../components/cart/CartSummary';
import FulfillmentForm from '../components/checkout/FulfillmentForm';
import PaymentSection from '../components/checkout/PaymentSection';

export default function CartPage() {
  return (
    <>
      <PageHeading
        title="Your cart"
        description="Review your drinks, apply an eligible offer, and choose how to receive your order."
      />
      <div className="component-grid">
        <CartItems />
        <PromoCodeForm />
        <CartSummary />
        <FulfillmentForm />
        <PaymentSection />
      </div>
    </>
  );
}
