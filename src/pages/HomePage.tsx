import PageHeading from '../components/common/PageHeading';
import HeroSection from '../components/home/HeroSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import FulfillmentOptions from '../components/home/FulfillmentOptions';

export default function HomePage() {
  return (
    <>
      <PageHeading
        title="Dee Zobo"
        description="Made-to-order hibiscus beverages, rooted in zobo and sorrel traditions."
      />
      <div className="component-grid">
        <HeroSection />
        <FeaturedProducts />
        <FulfillmentOptions />
      </div>
    </>
  );
}
