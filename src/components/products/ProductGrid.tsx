import type { Beverage } from '../../types/catalog';
import ProductCard from './ProductCard';
export default function ProductGrid({ products }: { products: Beverage[] }) {
  return products.length ? (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  ) : (
    <div className="empty-state">
      <h2>No drinks found</h2>
      <p>Try a different flavor or choose another category.</p>
    </div>
  );
}
