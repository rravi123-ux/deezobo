import PageHeading from '../components/common/PageHeading';
import ProductFilters from '../components/products/ProductFilters';
import ProductGrid from '../components/products/ProductGrid';
import ProductDetails from '../components/products/ProductDetails';

export default function OrderPage() {
  return (
    <>
      <PageHeading
        title="Order your drinks"
        description="Explore the menu, prices, sizes, ingredients, and available options."
      />
      <div className="component-grid">
        <ProductFilters />
        <ProductGrid />
        <ProductDetails />
      </div>
    </>
  );
}
