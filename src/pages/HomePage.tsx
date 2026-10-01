import { Link } from 'react-router-dom';
import HeroSection from '../components/home/HeroSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import FulfillmentOptions from '../components/home/FulfillmentOptions';
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <div className="values-strip">
        <span>Small-batch brewed</span>
        <span aria-hidden="true">✦</span>
        <span>Rooted in African tradition</span>
        <span aria-hidden="true">✦</span>
        <span>Made for your moments</span>
      </div>
      <FeaturedProducts />
      <section className="story-teaser page-width section">
        <img
          src="/images/brochure/infusion-pouches.png"
          alt="Dee Zobo infusion pouches ready for a gathering"
          loading="lazy"
        />
        <div>
          <p className="eyebrow">More than a drink</p>
          <h2>
            One flower.
            <br />
            So many <em>stories.</em>
          </h2>
          <p>
            Known as zobo, sorrel, and hibiscus tea, this vibrant infusion
            connects cultures and generations. At Dee Zobo, we bring that
            heritage to your table with a little modern creativity.
          </p>
          <Link className="text-link" to="/about">
            Our story →
          </Link>
        </div>
      </section>
      <FulfillmentOptions />
    </>
  );
}
