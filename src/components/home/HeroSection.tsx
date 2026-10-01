import { Link } from 'react-router-dom';
export default function HeroSection() {
  return (
    <section className="hero page-width">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="tiny-flower" aria-hidden="true">
            ✿
          </span>{' '}
          A taste of tradition
        </p>
        <h1>
          A little culture.
          <br />
          In every <em>pour.</em>
        </h1>
        <p className="hero-description">
          Handcrafted hibiscus infusions and vibrant mocktails. Rooted in
          African tradition, brewed fresh, and made for the moments we share.
        </p>
        <div className="button-row">
          <Link className="button" to="/order">
            Find your flavor <span aria-hidden="true">↗</span>
          </Link>
          <Link className="text-link" to="/about">
            Meet Dee Zobo <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="hero-footnote">
          <span aria-hidden="true">✳</span>
          <p>
            From a bottle just for you
            <br />
            to a table full of your favorite people.
          </p>
        </div>
      </div>
      <div className="hero-image">
        <img
          src="/images/brochure/brand-cover.png"
          alt="Dee Zobo hibiscus beverages surrounded by tropical fruit, spices and hibiscus flowers"
          fetchPriority="high"
        />
        <span className="image-stamp">
          SIP THE
          <br />
          <em>spirit</em>
          <br />
          OF AFRICA
        </span>
      </div>
    </section>
  );
}
