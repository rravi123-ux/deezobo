type Props = { title: string; description: string; eyebrow?: string };
export default function PageHeading({ title, description, eyebrow }: Props) {
  return (
    <header className="page-heading">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}
