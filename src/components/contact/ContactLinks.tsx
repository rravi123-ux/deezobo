import { Link } from 'react-router-dom';
import { site } from '../../data/site';
export default function ContactLinks() {
  return (
    <aside className="contact-details">
      <p className="eyebrow">Let’s talk</p>
      <h2>
        A good conversation
        <br />
        starts with a <em>sip.</em>
      </h2>
      <dl>
        <div>
          <dt>Email us</dt>
          <dd>
            <a href={'mailto:' + site.email}>{site.email} ↗</a>
          </dd>
        </div>
        <div>
          <dt>Give us a call</dt>
          <dd>
            <a href={'tel:' + site.phoneE164}>{site.phoneDisplay}</a>
          </dd>
        </div>
        <div>
          <dt>Find us on Instagram</dt>
          <dd>
            <a href={site.instagramUrl} target="_blank" rel="noreferrer">
              {site.instagramHandle} ↗
            </a>
          </dd>
        </div>
      </dl>
      <p>
        Ask about single bottles, larger quantities, catering, custom mocktails,
        or a partnership.
      </p>
      <p className="fine-print">
        Pickup and delivery are arranged directly. We’ll share pickup details
        when your order is confirmed.
      </p>
      <Link className="text-link admin-link" to="/login">
        Admin sign in →
      </Link>
    </aside>
  );
}
