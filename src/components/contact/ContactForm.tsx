import { useState } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { site } from '../../data/site';
import { emailDraft } from '../../lib/catalog';
export default function ContactForm() {
  const [params] = useSearchParams();
  const [topic, setTopic] = useState(
    params.get('topic') === 'event'
      ? 'Event or bulk order'
      : 'General question',
  );
  const [prepared, setPrepared] = useState('');
  const drink = params.get('drink');
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const lines = [
      'Name: ' + data.get('name'),
      'Reply email: ' + data.get('email'),
      'Phone: ' + (data.get('phone') || 'Not supplied'),
      'Topic: ' + topic,
    ];
    if (topic === 'Event or bulk order')
      lines.push(
        'Event date: ' + (data.get('date') || 'To discuss'),
        'Guest count: ' + (data.get('guests') || 'To discuss'),
        'Occasion / location: ' + (data.get('occasion') || 'To discuss'),
      );
    lines.push('', String(data.get('message')));
    const href = emailDraft(
      site.email,
      'Dee Zobo — ' + topic,
      lines.join('\n'),
    );
    setPrepared(href);
    window.location.href = href;
  }
  return (
    <div className="contact-form-panel">
      <p className="eyebrow">Make it personal</p>
      <h2>What are you dreaming up?</h2>
      <p>
        Tell us a little about it. This form prepares an email for you to review
        and send.
      </p>
      <form onSubmit={submit} onChange={() => setPrepared('')}>
        <div className="form-grid">
          <div>
            <label htmlFor="contact-name">Your name</label>
            <input
              id="contact-name"
              name="name"
              autoComplete="name"
              required
              maxLength={100}
              placeholder="First and last name"
            />
          </div>
          <div>
            <label htmlFor="contact-email">Email address</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              placeholder="you@example.com"
            />
          </div>
        </div>
        <div className="form-grid">
          <div>
            <label htmlFor="contact-phone">
              Phone <span className="optional">(optional)</span>
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              maxLength={30}
              placeholder="Your number"
            />
          </div>
          <div>
            <label htmlFor="contact-topic">I’m interested in</label>
            <select
              id="contact-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            >
              {[
                'General question',
                'Bottles or delivery',
                'Event or bulk order',
                'Partnership',
              ].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>
        {topic === 'Event or bulk order' && (
          <fieldset>
            <legend>
              A few event details <span className="optional">(optional)</span>
            </legend>
            <div className="form-grid">
              <div>
                <label htmlFor="event-date">Event date</label>
                <input id="event-date" name="date" type="date" />
              </div>
              <div>
                <label htmlFor="event-guests">Guest count</label>
                <input
                  id="event-guests"
                  name="guests"
                  type="number"
                  min="1"
                  step="1"
                />
              </div>
            </div>
            <label htmlFor="event-occasion">Occasion and location</label>
            <input
              id="event-occasion"
              name="occasion"
              maxLength={200}
              placeholder="A birthday, a wedding, a team gathering…"
            />
          </fieldset>
        )}
        <label htmlFor="contact-message">Your message</label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          maxLength={3000}
          defaultValue={
            drink ? 'I’d love to know more about ' + drink + '.' : ''
          }
          placeholder="Flavors you love, a date you have in mind, or a question for Ruth…"
        />
        <button className="button" type="submit">
          Prepare email ↗
        </button>
        <p className="fine-print">
          Opens your email app. Your request is sent only when you press send
          there.
        </p>
        {prepared && (
          <p role="status" className="success">
            Your email draft is ready. <a href={prepared}>Open it again</a>, or
            email {site.email} directly. Nothing has been submitted through this
            website.
          </p>
        )}
      </form>
    </div>
  );
}
