import { Link } from 'react-router-dom';
import { site } from '../../data/site';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main page-width">
        <div>
          <Link className="brand footer-brand" to="/">
            Dee Zobo<span aria-hidden="true">✿</span>
          </Link>
          <p>
            Rooted in tradition.
            <br />
            Bottled for today.
          </p>
        </div>
        <div>
          <p className="eyebrow">Come on in</p>
          <nav aria-label="Footer navigation">
            <Link to="/order">Our drinks</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/about">About us</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>
        <div>
          <p className="eyebrow">Let’s make something memorable</p>
          <a href={'mailto:' + site.email}>{site.email}</a>
          <br />
          <a href={'tel:' + site.phoneE164}>{site.phoneDisplay}</a>
          <br />
          <a href={site.instagramUrl} target="_blank" rel="noreferrer">
            {site.instagramHandle} ↗
          </a>
        </div>
      </div>
      <div className="footer-bottom page-width">
        <span>© {new Date().getFullYear()} Dee Zobo. Made with care.</span>
        <Link to="/login">Admin sign in</Link>
      </div>
    </footer>
  );
}
