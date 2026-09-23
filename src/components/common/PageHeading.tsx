type Props = { title: string; description: string };

export default function PageHeading({ title, description }: Props) {
  return <header className="page-heading"><h1>{title}</h1><p>{description}</p></header>;
}
