import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageHeading from '../components/common/PageHeading';
import { useCart } from '../context/CartContext';
import { useCatalog } from '../context/CatalogContext';
import { useAuth } from '../context/AuthContext';
import { money } from '../lib/catalog';
import {
  checkoutConfigured,
  createCheckout,
  getCheckoutState,
} from '../services/checkout';
import type { FulfillmentMethod } from '../services/checkout';

export default function CartPage() {
  const { items, update, remove, clear } = useCart();
  const { products } = useCatalog();
  const { session } = useAuth();
  const [searchParams] = useSearchParams();
  const checkoutParam = searchParams.get('checkout');
  const checkoutSessionId = searchParams.get('session_id');
  const [method, setMethod] = useState<FulfillmentMethod>('pickup');
  const [email, setEmail] = useState(session?.user.email ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [checkoutMessage, setCheckoutMessage] = useState(() =>
    checkoutParam === 'canceled'
      ? 'Payment was canceled. Your selection is still here.'
      : '',
  );
  const rows = items.map((item) => {
    const product = products.find((p) => p.id === item.productId && p.active);
    return {
      item,
      product,
      option: product?.options.find((o) => o.id === item.optionId),
    };
  });
  const total = rows.reduce(
    (n, { item, option }) => n + (option?.priceMinor ?? 0) * item.quantity,
    0,
  );
  const unavailable = rows.some((r) => !r.product || !r.option);
  useEffect(() => {
    if (!email && session?.user.email) setEmail(session.user.email);
  }, [email, session?.user.email]);

  useEffect(() => {
    if (checkoutParam !== 'success' || !checkoutSessionId) return;
    let active = true;
    setCheckoutMessage('Verifying your payment with Stripe…');
    void getCheckoutState(checkoutSessionId)
      .then((state) => {
        if (!active) return;
        if (state === 'paid') {
          clear();
          setCheckoutMessage(
            'Payment received. Stripe has sent a receipt to your checkout email.',
          );
        } else if (state === 'processing') {
          setCheckoutMessage(
            'Your payment is processing. Stripe will email your receipt after it succeeds.',
          );
        } else {
          setCheckoutMessage(
            'Payment is not complete. Your selection has been preserved.',
          );
        }
      })
      .catch((reason: unknown) => {
        if (active)
          setError(
            reason instanceof Error
              ? reason.message
              : 'Payment status could not be verified.',
          );
      });
    return () => {
      active = false;
    };
  }, [checkoutParam, checkoutSessionId, clear]);

  async function pay(event: FormEvent) {
    event.preventDefault();
    setError('');
    setCheckoutMessage('');
    setBusy(true);
    try {
      const url = await createCheckout({
        items,
        email,
        fulfillmentMethod: method,
      });
      window.location.assign(url);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Stripe Checkout could not be started.',
      );
      setBusy(false);
    }
  }
  return (
    <div className="page-shell page-width">
      <PageHeading
        eyebrow="A taste of what’s to come"
        title="Your selection."
        description="Review your drinks, choose fulfillment, and pay securely through Stripe."
      />
      {checkoutMessage && (
        <p className="success" role="status">
          {checkoutMessage}
        </p>
      )}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {!items.length ? (
        <div className="empty-state">
          <h2>Something delicious belongs here.</h2>
          <p>Start with a drink that catches your eye.</p>
          <Link className="button" to="/order">
            Explore the menu ↗
          </Link>
        </div>
      ) : (
        <div className="basket-layout">
          <div>
            {rows.map(({ item, product, option }) => (
              <article
                className="basket-row"
                key={item.productId + ':' + item.optionId}
              >
                {product && (
                  <img src={product.imageUrl} alt={product.imageAlt} />
                )}
                <div className="basket-description">
                  <h2>{product?.name ?? 'Unavailable drink'}</h2>
                  <p>
                    {option?.label ??
                      'This option is no longer available. Remove it before continuing.'}
                  </p>
                  {option && <span>{money(option.priceMinor)} each</span>}
                  <button
                    className="text-link"
                    onClick={() => {
                      remove(item.productId, item.optionId);
                      setCheckoutMessage('');
                    }}
                  >
                    Remove
                  </button>
                </div>
                <div>
                  <label
                    htmlFor={'qty-' + item.productId + '-' + item.optionId}
                  >
                    Quantity
                  </label>
                  <input
                    id={'qty-' + item.productId + '-' + item.optionId}
                    type="number"
                    min="1"
                    max="999"
                    step="1"
                    value={item.quantity}
                    onChange={(e) => {
                      update(
                        item.productId,
                        item.optionId,
                        e.target.valueAsNumber,
                      );
                      setCheckoutMessage('');
                    }}
                  />
                  <strong>
                    {option
                      ? money(option.priceMinor * item.quantity)
                      : 'Unavailable'}
                  </strong>
                </div>
              </article>
            ))}
            <Link className="text-link" to="/order">
              ← Keep exploring
            </Link>
          </div>
          <form
            className="basket-summary"
            onSubmit={(event) => void pay(event)}
          >
            <p className="eyebrow">The details</p>
            <h2>Make it yours</h2>
            <div className="subtotal">
              <span>Item subtotal</span>
              <strong>{money(total)}</strong>
            </div>
            <p className="fine-print">
              Checkout charges the listed item subtotal in USD. Any separately
              arranged delivery or event fee is not included here.
            </p>
            <label htmlFor="receipt-email">Receipt email</label>
            <input
              id="receipt-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
            <label htmlFor="fulfillment">How would you like your drinks?</label>
            <select
              id="fulfillment"
              value={method}
              onChange={(event) => {
                setMethod(event.target.value as FulfillmentMethod);
                setCheckoutMessage('');
              }}
            >
              <option value="pickup">Pickup</option>
              <option value="delivery">Delivery</option>
              <option value="event">At an event</option>
            </select>
            {unavailable ? (
              <p role="alert" className="error">
                Remove unavailable items before preparing your request.
              </p>
            ) : (
              <button
                type="submit"
                className="button full-width"
                disabled={busy || !checkoutConfigured}
              >
                {busy
                  ? 'Opening secure checkout…'
                  : 'Pay securely with Stripe ↗'}
              </button>
            )}
            <p className="fine-print">
              Stripe handles your card details. Dee Zobo does not receive your
              full card number. A receipt is emailed after a successful live
              payment.
            </p>
            {!checkoutConfigured && (
              <p role="alert" className="notice">
                Online checkout is waiting for the Supabase project connection.
              </p>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
