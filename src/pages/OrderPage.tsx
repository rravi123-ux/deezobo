import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeading from '../components/common/PageHeading';
import ProductFilters from '../components/products/ProductFilters';
import ProductGrid from '../components/products/ProductGrid';
import { useCatalog } from '../context/CatalogContext';
import { filterProducts } from '../lib/catalog';
import type { Category } from '../types/catalog';

export default function OrderPage() {
  const { products, source } = useCatalog();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | 'all'>('all');
  const filtered = filterProducts(products, query, category);
  return (
    <div className="page-shell page-width">
      <PageHeading
        eyebrow="The Dee Zobo menu"
        title="Freshly brewed. Full of character."
        description="Bright botanicals, warming spices, and a little tropical sunshine. Find the pour that speaks to you."
      />
      <ProductFilters
        query={query}
        category={category}
        onQuery={setQuery}
        onCategory={setCategory}
      />
      <div className="results-caption">
        <span aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'drink' : 'drinks'}
        </span>
        <span>
          {source === 'brochure'
            ? '2026 brochure menu · USD'
            : 'Current menu · USD'}
        </span>
      </div>
      <ProductGrid products={filtered} />
      <aside className="inline-callout">
        <div>
          <p className="eyebrow">A bigger gathering?</p>
          <h2>Let’s make it yours.</h2>
          <p>
            Gallon sizes, custom flavors, and a presentation that matches your
            occasion. Bulk orders are quoted individually.
          </p>
        </div>
        <Link className="button" to="/contact?topic=event">
          Request a quote ↗
        </Link>
      </aside>
    </div>
  );
}
