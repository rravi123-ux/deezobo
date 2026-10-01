import { Link } from 'react-router-dom';
import PageHeading from '../components/common/PageHeading';
export default function AccountPage() {
  return (
    <div className="page-shell page-width">
      <PageHeading
        title="Here to help with your order."
        description="Customer order history is coming later. For now, contact Ruth directly for order updates or to place another request."
      />
      <Link className="button" to="/contact">
        Contact Dee Zobo ↗
      </Link>
    </div>
  );
}
