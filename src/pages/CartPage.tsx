import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeading from '../components/common/PageHeading';
import { useCart } from '../context/CartContext';
import { useCatalog } from '../context/CatalogContext';
import { emailDraft, money } from '../lib/catalog';
import { site } from '../data/site';

export default function CartPage() {
  const { items, update, remove } = useCart();
  const { products } = useCatalog();
  const [method, setMethod] = useState('Pickup');
  const [prepared, setPrepared] = useState(false);
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
  const body = [
    'Hello Dee Zobo, I would like to request:',
    '',
    ...rows
      .filter((r) => r.product && r.option)
      .map(
        ({ item, product, option }) =>
          item.quantity +
          ' × ' +
          product!.name +
          ' — ' +
          option!.label +
          ' (' +
          money(option!.priceMinor * item.quantity) +
          ')',
      ),
    '',
    'Listed item subtotal: ' + money(total),
    'Preferred fulfillment: ' + method,
    'Preferred date: ',
    '',
    'Please confirm availability, delivery/pickup arrangements, and final pricing.',
  ].join('\n');
  const draft = emailDraft(site.email, 'My Dee Zobo selection', body);
  return (
    <div className="page-shell page-width">
      <PageHeading
        eyebrow="A taste of what’s to come"
        title="Your selection."
        description="Collect your favorites, then send Ruth an order request. Availability, fulfillment, and final pricing are confirmed directly."
      />
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
                      setPrepared(false);
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
                      setPrepared(false);
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
          <aside className="basket-summary">
            <p className="eyebrow">The details</p>
            <h2>Make it yours</h2>
            <div className="subtotal">
              <span>Item subtotal</span>
              <strong>{money(total)}</strong>
            </div>
            <p className="fine-print">
              Listed menu prices in USD. Delivery, tax, custom requests, and any
              applicable offers will be confirmed in your quote.
            </p>
            <label htmlFor="fulfillment">How would you like your drinks?</label>
            <select
              id="fulfillment"
              value={method}
              onChange={(e) => {
                setMethod(e.target.value);
                setPrepared(false);
              }}
            >
              <option>Pickup</option>
              <option>Delivery</option>
              <option>At an event</option>
            </select>
            {unavailable ? (
              <p role="alert" className="error">
                Remove unavailable items before preparing your request.
              </p>
            ) : (
              <a
                href={draft}
                className="button full-width"
                onClick={() => setPrepared(true)}
              >
                Prepare order email ↗
              </a>
            )}
            <p className="fine-print">
              This opens your email app. Send the draft there to request your
              order. No payment is collected on this website.
            </p>
            {prepared && (
              <p role="status" className="success">
                Your draft is ready to send in your email app. This is not an
                order confirmation.
              </p>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
