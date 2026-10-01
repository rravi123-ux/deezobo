import { useState } from 'react';
import type { Beverage } from '../../types/catalog';
import { money } from '../../lib/catalog';
import ProductDetails from './ProductDetails';

export default function ProductCard({ product }: { product: Beverage }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <article className="product-card">
        <button
          className="product-image"
          onClick={() => setOpen(true)}
          aria-label={'View ' + product.name}
        >
          <img src={product.imageUrl} alt={product.imageAlt} loading="lazy" />
          <span className="product-tag">
            {product.category === 'infusions'
              ? 'Herbal infusion'
              : 'Zero-proof mocktail'}
          </span>
          <span className="image-arrow" aria-hidden="true">
            ↗
          </span>
        </button>
        <div className="product-card-heading">
          <h3>{product.name}</h3>
          <span className="product-price">
            {product.options.length
              ? 'From ' +
                money(Math.min(...product.options.map((o) => o.priceMinor)))
              : 'By request'}
          </span>
        </div>
        <p>{product.description}</p>
        <button className="text-link" onClick={() => setOpen(true)}>
          Explore this drink →
        </button>
      </article>
      {open && (
        <ProductDetails product={product} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
