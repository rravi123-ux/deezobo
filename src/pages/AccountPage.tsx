import PageHeading from '../components/common/PageHeading';
import ProfileForm from '../components/account/ProfileForm';
import OrderHistory from '../components/account/OrderHistory';

export default function AccountPage() {
  return (
    <>
      <PageHeading
        title="Your account"
        description="Account scaffold — authentication and order data are not connected."
      />
      <div className="component-grid">
        <ProfileForm />
        <OrderHistory />
      </div>
    </>
  );
}
