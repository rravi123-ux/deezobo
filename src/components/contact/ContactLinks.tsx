import { site } from '../../data/site';

export default function ContactLinks() {
  return (
    <section className="placeholder">
      <h2>Contact Dee Zobo</h2>
      <ul>
        <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
        <li><a href={site.instagramUrl} target="_blank" rel="noreferrer">Instagram</a></li>
      </ul>
      {/* TODO: Add WhatsApp and phone links after confirming the international number. */}
    </section>
  );
}
