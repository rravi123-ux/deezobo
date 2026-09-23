type Props = { title: string; description: string };

// Development-only building block. Replace each caller with its actual UI.
export default function Placeholder({ title, description }: Props) {
  return (
    <section className="placeholder">
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  );
}
