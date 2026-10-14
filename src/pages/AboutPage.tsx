import { Link } from 'react-router-dom';
export default function AboutPage() {
  return (
    <>
      <section className="about-hero page-width">
        <div>
          <p className="eyebrow">The story behind the sip</p>
          <h1>
            Rooted in tradition.
            <br />
            Brewed with <em>heart.</em>
          </h1>
          <p>
            At Dee Zobo, drinks tell stories. Of heritage, of gatherings, and of
            joy shared across tables and generations.
          </p>
        </div>
        <img
          src="/images/brochure/bottled-zobo.jpg"
          alt="Fresh Dee Zobo being poured into bottles"
        />
      </section>
      <section className="story-body page-width section">
        <p className="eyebrow">Meet Ruth</p>
        <div>
          <h2>
            A familiar flavor.
            <br />A fresh <em>beginning.</em>
          </h2>
          <p>
            Dee Zobo began with a drink Ruth grew up with. A UMD alum with a
            love for experimenting with flavors, she started brewing as part of
            her own wellness journey in 2024 and officially launched the brand
            in March 2026.
          </p>
          <p>
            What started with a personal connection to zobo and sorrel grew into
            a way to bring people together. Today, she creates made-to-order
            hibiscus beverages, herbal infusions, and mocktails, with
            presentation tailored to the occasion.
          </p>
          <p>
            From bold tropical notes to warm spiced blends, each pour is crafted
            to match your palate and your moment.
          </p>
        </div>
      </section>
      <section className="mission-section">
        <div className="page-width">
          <p className="eyebrow">Our mission</p>
          <h2>
            One flower. Many cultures.
            <br />
            <em>One refreshing experience.</em>
          </h2>
          <p>
            We bring African tradition and modern creativity together through
            vibrant botanicals, aromatic spices, and fresh fruits. Whether it’s
            an intimate gathering, a wedding, a community event, or a business
            occasion, we want every pour to leave a lasting impression.
          </p>
        </div>
      </section>
      <section className="section page-width">
        <div className="about-values">
          <article>
            <span className="step-number">01</span>
            <h3>Culture at the center</h3>
            <p>
              The flavors of zobo and sorrel are part of a shared heritage. We
              celebrate those roots in every blend.
            </p>
          </article>
          <article>
            <span className="step-number">02</span>
            <h3>Thoughtfully made</h3>
            <p>
              Small batches, made to order, with a personal approach to flavor
              and presentation.
            </p>
          </article>
          <article>
            <span className="step-number">03</span>
            <h3>Your moment matters</h3>
            <p>
              Flexible sizing, bottled options, and personalized flavor profiles
              for individuals and businesses.
            </p>
          </article>
        </div>
        <div className="center-cta">
          <Link className="button" to="/order">
            Find your favorite ↗
          </Link>
        </div>
      </section>
    </>
  );
}
