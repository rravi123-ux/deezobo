import PageHeading from '../components/common/PageHeading';
import ContactLinks from '../components/contact/ContactLinks';
import ContactForm from '../components/contact/ContactForm';
export default function ContactPage() {
  return (
    <div className="page-shell page-width">
      <PageHeading
        eyebrow="We’d love to hear from you"
        title="Let’s pour something special."
        description="A bottle for yourself, a gathering to remember, or an idea all your own. Tell us what you have in mind."
      />
      <div className="contact-grid">
        <ContactLinks />
        <ContactForm />
      </div>
    </div>
  );
}
