import PageHeading from '../components/common/PageHeading';
import ContactLinks from '../components/contact/ContactLinks';
import ContactForm from '../components/contact/ContactForm';
import EventInquiryForm from '../components/contact/EventInquiryForm';
import LocationsMap from '../components/contact/LocationsMap';

export default function ContactPage() {
  return (
    <>
      <PageHeading
        title="Get in touch"
        description="Reach Ruth, ask about an order, or plan drinks for an event."
      />
      <div className="component-grid">
        <ContactLinks />
        <ContactForm />
        <EventInquiryForm />
        <LocationsMap />
      </div>
    </>
  );
}
