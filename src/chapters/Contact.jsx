import ChapterHead from '../components/ChapterHead.jsx';
import ContactForm from '../components/ContactForm.jsx';
import Icon from '../components/Icon.jsx';
import { Shamsa } from '../components/Ornament.jsx';
import { profile } from '../data/profile.js';

const ELSEWHERE = [
  { key: 'linkedin', label: 'LinkedIn', note: 'Experience and references', icon: 'external' },
  { key: 'github', label: 'GitHub', note: 'Source for everything above', icon: 'repo' },
  { key: 'cv', label: 'Curriculum vitae', note: 'One page, PDF', icon: 'download' },
];

/**
 * The close.
 *
 * The one place on the site where madder stops being a mark and becomes the
 * ground. A carpet ends where the weaver cuts it off the loom, and the page
 * should end as deliberately — not trail off into a row of small grey icons.
 * Everything inside takes its ink from the `.on-field` scope, so nothing in
 * here had to be recoloured by hand for the crimson.
 */
export function Contact() {
  return (
    <section className="chapter chapter--fit contact on-field" id="contact" aria-labelledby="contact-heading">
      <div className="chapter__inner">
        <ChapterHead id="contact" figure={profile.location} />

        <div className="contact__grid">
          <div className="contact__side">
            <p className="contact__lead reveal" style={{ '--i': 1 }}>
              This goes straight to my inbox, and I answer everything.
            </p>

            <ul className="contact__elsewhere">
              {ELSEWHERE.map((entry, index) => (
                <li key={entry.key} className="reveal" style={{ '--i': index + 2 }}>
                  <a
                    className="outlink"
                    href={profile.links[entry.key]}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="outlink__text">
                      <span className="outlink__label">{entry.label}</span>
                      <span className="outlink__note">{entry.note}</span>
                    </span>
                    <span className="outlink__icon" aria-hidden="true">
                      <Icon name={entry.icon} />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="contact__form reveal" style={{ '--i': 2 }}>
            <ContactForm />
          </div>
        </div>

        {/* The colophon, set as one line across the foot of the frame — the
            name in Persian first, struck beside the same shamsa that closes
            every other chapter. */}
        <footer className="colophon">
          <Shamsa className="colophon__mark" />
          <p className="colophon__name" lang="fa" dir="rtl" translate="no">
            {profile.namePersian}
          </p>
          <p className="colophon__line">
            <span>{profile.name}</span>
            <span aria-hidden="true">·</span>
            <span>{profile.location}</span>
            <span aria-hidden="true">·</span>
            <span>Built with React and Vite. No analytics, no trackers.</span>
          </p>
        </footer>
      </div>
    </section>
  );
}

export default Contact;
