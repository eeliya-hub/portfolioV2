import Announce from '../components/Announce.jsx';
import ContactForm from '../components/ContactForm.jsx';
import Icon from '../components/Icon.jsx';
import { Shamsa } from '../components/Ornament.jsx';
import { profile } from '../data/profile.js';
import { fieldUrl } from '../lib/girih.js';
import { picture } from '../lib/media.js';

// `logo` is a stem into src/media/logos, drawn as a mask in the band's own
// ink rather than in the brand's colours: a blue square and a black cat on
// madder would be the two loudest things in the closing band. The CV has no
// brand, so it carries the drawn glyph for a document.
const ELSEWHERE = [
  { key: 'linkedin', label: 'LinkedIn', note: 'Experience and references', icon: 'external', logo: 'linkedin' },
  { key: 'github', label: 'GitHub', note: 'Source for everything above', icon: 'external', logo: 'github' },
  { key: 'cv', label: 'Curriculum vitae', note: 'One page, PDF', icon: 'download', glyph: 'doc' },
];

/** The mark at the head of a row: the brand's own shape, or a drawn glyph. */
function Mark({ entry }) {
  if (entry.logo) {
    const image = picture(`logos/${entry.logo}`);
    if (image) {
      return (
        <span
          className="outlink__mark"
          aria-hidden="true"
          style={{ '--logo': `url(${image.src})` }}
        />
      );
    }
  }
  return (
    <span className="outlink__mark outlink__mark--drawn" aria-hidden="true">
      <Icon name={entry.glyph ?? 'doc'} />
    </span>
  );
}

/**
 * 05 — the field, and the end of the cloth.
 *
 * The one band where madder stops being a mark and becomes the ground.
 * Everything inside takes its ink from the `.on-field` scope, so nothing
 * here is recoloured by hand. The page ends the way a carpet ends: the
 * colophon signs it, and below that the warp is cut — a fringe of bare
 * threads where the weave stops.
 */
export function Contact() {
  // The band's own ground: the girih field the page is laid on, struck in
  // a deeper madder over the madder — the texture the hero stands on, in
  // this band's colour. One small data URI, coloured by the stylesheet.
  const tile = fieldUrl(132, 1);

  return (
    <section
      className="chapter on-field contact"
      id="contact"
      aria-labelledby="contact-heading"
      style={{ '--tile': tile }}
    >
      <div className="chapter__inner">
        <Announce id="contact" figure={profile.location} />

        <div className="contact__grid">
          <div className="contact__side">
            {/* Both halves are named. The band used to open with one
                sentence over the links and nothing at all over the form,
                so the reader met two columns and had to work out from the
                shapes which was which — and the sentence that belonged to
                the form ("this goes straight to my inbox") was sitting
                over the links, where it was about the wrong thing. */}
            <h3 className="contact__head label">Elsewhere</h3>

            <ul className="contact__elsewhere">
              {ELSEWHERE.map((entry, index) => (
                <li key={entry.key} className="reveal" style={{ '--i': index + 2 }}>
                  <a
                    className="outlink"
                    href={profile.links[entry.key]}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Mark entry={entry} />
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
            <h3 className="contact__head label">Send a message</h3>
            <ContactForm />
          </div>
        </div>

        {/* The colophon: the name in Persian first, struck beside the same
            rosette the site opens with. */}
        <footer className="colophon">
          <Shamsa className="colophon__mark" />
          <p className="colophon__name" lang="fa" dir="rtl" translate="no">
            {profile.namePersian}
          </p>
          <p className="colophon__line">
            <span>{profile.name}</span>
            <span aria-hidden="true">·</span>
            <span>{profile.location}</span>
            <span className="colophon__sep" aria-hidden="true">
              ·
            </span>
            <span className="colophon__note">Built with React and Vite. No analytics, no trackers.</span>
          </p>
        </footer>
      </div>

      {/* The warp, cut. */}
      <div className="fringe" aria-hidden="true" />
    </section>
  );
}

export default Contact;
