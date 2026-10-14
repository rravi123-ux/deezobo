import { Link } from 'react-router-dom';
export default function FulfillmentOptions() {
  return (
    <section className="occasion-section">
      <div className="page-width">
        <p className="eyebrow">Good company. Great drinks.</p>
        <h2>
          For the everyday.
          <br />
          And the <em>extra special.</em>
        </h2>
        <div className="occasion-grid">
          <article>
            <span className="step-number">01</span>
            <h3>A bottle for you</h3>
            <p>
              Choose an 8 oz or 12 oz bottle of your favorite infusion. Arrange
              pickup or ask us about delivery.
            </p>
          </article>
          <article>
            <span className="step-number">02</span>
            <h3>Something to share</h3>
            <p>
              Our gallon sizes bring everyone to the table. Freshly brewed for
              gatherings, meetings, and celebrations.
            </p>
          </article>
          <article>
            <span className="step-number">03</span>
            <h3>Your occasion, your pour</h3>
            <p>
              From birthdays to weddings and pop-ups, let’s create a flavor and
              presentation that feel like you.
            </p>
          </article>
        </div>
        <Link className="button button-light" to="/contact?topic=event">
          Plan something special ↗
        </Link>
      </div>
    </section>
  );
}
