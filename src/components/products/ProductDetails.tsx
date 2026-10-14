import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Beverage } from '../../types/catalog';
import { money, validQuantity } from '../../lib/catalog';
import { useCart } from '../../context/CartContext';
import Modal from '../common/Modal';

export default function ProductDetails({
  product,
  onClose,
}: {
  product: Beverage;
  onClose: () => void;
}) {
  const [optionId, setOptionId] = useState(product.options[0]?.id ?? '');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const option = product.options.find((o) => o.id === optionId);
  return (
    <Modal title={product.name} onClose={onClose}>
      <div className="product-detail">
        <img
          className="detail-image"
          src={product.imageUrl}
          alt={product.imageAlt}
        />
        <div>
          <p className="eyebrow">
            {product.category === 'infusions'
              ? 'Herbal infusion'
              : 'Mocktail collection'}
          </p>
          <p>{product.description}</p>
          <h3>Flavor notes</h3>
          <div className="flavor-tags">
            {product.flavorNotes.map((note) => (
              <span key={note}>{note}</span>
            ))}
          </div>
          <p className="fine-print">
            Flavor notes are not a complete ingredient or allergen list. Ask us
            about ingredients, dietary needs, and nutritional information before
            ordering.
          </p>
          {option ? (
            <>
              <label htmlFor="drink-size">Choose your size</label>
              <select
                id="drink-size"
                value={optionId}
                onChange={(e) => {
                  setOptionId(e.target.value);
                  setAdded(false);
                }}
              >
                {product.options.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label} — {money(o.priceMinor)}
                  </option>
                ))}
              </select>
              <label htmlFor="drink-quantity">Quantity</label>
              <input
                id="drink-quantity"
                type="number"
                min="1"
                max="999"
                step="1"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.valueAsNumber || 0);
                  setAdded(false);
                }}
              />
              <button
                className="button full-width"
                disabled={!validQuantity(quantity)}
                onClick={() => {
                  add({ productId: product.id, optionId, quantity });
                  setAdded(true);
                }}
              >
                Add to selection · {money(option.priceMinor * quantity)}
              </button>
              <p className="fine-print">
                We’ll confirm availability, fulfillment, and final pricing with
                you. Bulk orders require a quote.
              </p>
              {added && (
                <p className="success" role="status">
                  Added to your selection.{' '}
                  <Link to="/cart" onClick={onClose}>
                    Review selection →
                  </Link>
                </p>
              )}
            </>
          ) : (
            <>
              <p>
                Created for your occasion. Contact us for sizes, presentation,
                and a tailored quote.
              </p>
              <Link
                className="button"
                to={
                  '/contact?drink=' +
                  encodeURIComponent(product.name) +
                  '&topic=event'
                }
                onClick={onClose}
              >
                Ask about this mocktail ↗
              </Link>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
