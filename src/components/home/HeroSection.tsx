import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="hero">
      <p>Rooted in culture. Brewed for your occasion.</p>
      <Link to="/order">Explore the drinks</Link>
    </section>
  );
}
