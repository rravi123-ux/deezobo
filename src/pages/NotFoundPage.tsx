import { Link } from 'react-router-dom';
import PageHeading from '../components/common/PageHeading';

export default function NotFoundPage() {
  return (
    <>
      <PageHeading title="Page not found" description="This page does not exist." />
      <Link to="/">Return home</Link>
    </>
  );
}
