import PageHeading from '../components/common/PageHeading';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import PasswordResetForm from '../components/auth/PasswordResetForm';

export default function LoginPage() {
  return (
    <>
      <PageHeading
        title="Welcome back"
        description="Customer sign-in, registration, and account recovery will live here."
      />
      <div className="component-grid">
        <LoginForm />
        <SignupForm />
        <PasswordResetForm />
      </div>
    </>
  );
}
