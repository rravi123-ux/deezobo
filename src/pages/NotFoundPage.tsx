import { Link } from 'react-router-dom';
import PageHeading from '../components/common/PageHeading';
export default function NotFoundPage() {
  return (
    <div className="page-shell page-width">
      <PageHeading
        eyebrow="404"
        title="A little off the menu."
        description="We couldn’t find that page. Let’s get you back to something refreshing."
      />
      <Link className="button" to="/">
        Back to welcome →
      </Link>
    </div>
  );
}
