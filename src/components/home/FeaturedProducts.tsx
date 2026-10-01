import { Link } from 'react-router-dom';
import { useCatalog } from '../../context/CatalogContext';
import ProductCard from '../products/ProductCard';
export default function FeaturedProducts() {
  const { products } = useCatalog();
  const featured = products.filter((p) => p.active && p.featured).slice(0, 3);
  return (
    <section className="section page-width">
      <div className="section-heading">
        <div>
          <p className="eyebrow">The house favorites</p>
          <h2>
            Find your kind of <em>refreshing.</em>
          </h2>
        </div>
        <Link className="text-link" to="/order">
          Explore the menu ↗
        </Link>
      </div>
      <div className="product-grid">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {!featured.length && <p>Explore our menu to see what’s brewing.</p>}
    </section>
  );
}
