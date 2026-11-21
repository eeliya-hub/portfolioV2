import { useCallback, useEffect, useRef, useState } from 'react';

import Announce from '../components/Announce.jsx';
import Icon from '../components/Icon.jsx';
import { Khatam, Shamsa } from '../components/Ornament.jsx';
import { photographs, profile } from '../data/profile.js';
import { khatamFrame } from '../lib/girih.js';
import { picture } from '../lib/media.js';

/**
 * 01 — the plates and the register.
 *
 * Two columns. The left one reads: the sentence under the rosette, and
 * beneath it the three photographs in their khatam frames, standing on one
 * line. The right one is the register of record — four matters, read down,
 * each marked in the margin and divided from the next by the page's own
 * knot run.
 *
 * THE BAND OF THREE. The frames are ornate, so the arrangement has to do
 * the work rather than the crowding: the three stand side by side on one
 * baseline, the upright photograph in the middle drawn 1.3 times the height
 * of the two flanking it, and the two flanks drawn to exactly the same
 * height as each other. That is the medallion a carpet is composed around,
 * and it is **solved, not chosen** — see SPANS below. None of the three is
 * cropped to match another: each frame carries its own photograph's ratio,
 * and the widths are what the ratios make them.
 *
 * THE REGISTER. Four entries of equal share, stretched to end level with
 * the plates, each centred in its own share. Equal shares do three things
 * at once: the last entry ends with the band of three, the entries keep an
 * even measure, and the knot run between two of them falls at the same
 * interval every time — which is what lets it be an ornament rather than a
 * hairline landing wherever the copy leaves it.
 */

/**
 * The three spans, in twelfths of the band after its two gaps are taken
 * out. Solved from the ratios, not picked:
 *
 *   flank height h, centre height 1.3h
 *   square   (1.0000)  w = h          -> 3.486 twelfths
 *   portrait (0.8084)  w = 1.0509h    -> 3.664
 *   wide     (1.3913)  w = 1.3913h    -> 4.850
 *                                        ------
 *                                        12.000
 *
 * Change one and the other two have to be re-solved, or the band stops
 * standing level. They are declared here beside the photographs rather than
 * as nth-child rules in the stylesheet: they are a composition, not a
 * style, and have to be read next to what they are composing.
 */
const PLATES = [
  { photo: photographs.room, span: 3.486 },
  { photo: photographs.graduation, span: 3.664 },
  { photo: photographs.stage, span: 4.85 },
];

/**
 * The register. The credentials as written, and where he is — a matter of
 * record like the rest, and not written twice. The mark is the glyph for
 * what the row is about; it is not in profile.js because it is a drawing
 * decision about this band, not a fact about Eeliya.
 */
const RECORD = [
  { ...profile.credentials[0], mark: 'cap' },
  { ...profile.credentials[1], mark: 'columns' },
  { ...profile.credentials[2], mark: 'door' },
  { label: 'Based in', value: profile.location, detail: profile.relocation, mark: 'marker' },
];

/**
 * Rubrication: the opening words struck in madder, the way a scribe marks
 * where the text begins. Taken off the front of profile.blurb rather than
 * written here, so there is one copy of the sentence.
 */
const RUBRIC = 2;

function opening(text) {
  const words = text.split(' ');
  return [words.slice(0, RUBRIC).join(' '), ` ${words.slice(RUBRIC).join(' ')}`];
}

/* --- The gloss --------------------------------------------------------------
   A gloss is the long note written beside a short line, and that is exactly
   the relation here. The blurb is one sentence, which is all a reader
   passing through owes themselves; a reader who stops is owed the whole
   account, and the whole account cannot live in the band. This band is
   composed around three plates standing on one baseline against a register
   that ends level with them, and five paragraphs set underneath would be
   the one thing in 01 that has to be scrolled.

   So it stands behind a quiet control and opens as its own leaf: set at a
   reading measure, nothing else on the glass, and the paragraphs
   rubricated and ruled the way the band they came out of is. The copy is
   profile.bio, in src/data/profile.js, and the last paragraph is drawn
   apart because it is the one a reader is meant to act on.                 */

function Gloss({ open, onClose }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  const close = useCallback(() => {
    const node = ref.current;
    if (!node?.open) return onClose();
    setShown(false);
    return setTimeout(() => node.close(), 200);
  }, [onClose]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (open && !node.open) {
      node.showModal();
      document.body.dataset.locked = 'true';
      requestAnimationFrame(() => setShown(true));
    }

    // Escape is given the same 200ms as the close button rather than
    // taking the sheet off the glass in one frame.
    const onCancel = (event) => {
      event.preventDefault();
      close();
    };
    const onClosed = () => {
      delete document.body.dataset.locked;
      onClose();
    };

    node.addEventListener('cancel', onCancel);
    node.addEventListener('close', onClosed);
    return () => {
      node.removeEventListener('cancel', onCancel);
      node.removeEventListener('close', onClosed);
    };
  }, [open, close, onClose]);

  useEffect(() => () => delete document.body.dataset.locked, []);

  const last = profile.bio.length - 1;

  return (
    <dialog
      className="gloss"
      ref={ref}
      data-shown={shown ? 'true' : undefined}
      aria-labelledby="gloss-title"
      onClick={(event) => {
        if (event.target === ref.current) close();
      }}
    >
      <article className="gloss__sheet">
        <header className="gloss__bar">
          <Shamsa className="gloss__mark" />
          <div>
            <h2 className="gloss__title" id="gloss-title">
              The longer version
            </h2>
            {/* The byline. Where he is goes with it on a sheet wide enough
                to carry it on one line, and is dropped on a phone rather
                than spending three lines of the head on something the
                register below already says. */}
            <p className="gloss__figure label">
              {profile.name}
              <span className="gloss__where">
                <span aria-hidden="true"> · </span>
                {profile.location}
              </span>
            </p>
          </div>
          <button
            type="button"
            className="iconbtn"
            onClick={close}
            aria-label="Close the account"
            data-cursor="close"
          >
            <Icon name="close" />
          </button>
        </header>

        {/* Focusable, because it scrolls: a reader on a keyboard has to be
            able to take the sheet down without a pointer. */}
        <div className="gloss__read" tabIndex={0}>
          {profile.bio.map((para, index) => {
            if (index === 0) {
              const [rubric, rest] = opening(para);
              return (
                <p className="gloss__para" key={para}>
                  <span className="about__rubric">{rubric}</span>
                  {rest}
                </p>
              );
            }

            return (
              <p
                className="gloss__para"
                data-close={index === last ? 'true' : undefined}
                key={para}
              >
                {para}
              </p>
            );
          })}
        </div>
      </article>
    </dialog>
  );
}

function Plate({ photo, span, index, sizes }) {
  const image = picture(photo.stem);
  // Anything whose file is missing is dropped rather than drawn empty.
  if (!image) return null;

  const crop = photo.crop ?? {};
  const aspect = crop.aspect ?? image.width / image.height;
  const frame = khatamFrame(aspect);

  // The focus drives both the photograph's offset inside the window and its
  // offset inside its own box; one number for both keeps the two in step.
  const [fx, fy] = (crop.focus ?? '50% 50%')
    .split(/\s+/)
    .map((part) => Number.parseFloat(part) / 100);

  return (
    <figure
      className="khatam reveal"
      style={{
        '--ar': aspect,
        '--span': span,
        '--zoom': crop.zoom ?? 1,
        '--fx': fx,
        '--fy': fy,
        '--i': index,
      }}
    >
      <span className="khatam__frame">
        {/* The window is cut by the same construction the frame is drawn
            from, and worn by the element around the photograph rather than
            the photograph itself, so a zoomed crop is clipped against the
            window and the image keeps its srcset. */}
        <span className="khatam__window" style={{ clipPath: frame.clip }}>
          <img
            draggable="false"
            src={image.src}
            srcSet={image.srcSet}
            sizes={sizes}
            width={image.width}
            height={image.height}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
          />
        </span>

        <Khatam aspect={aspect} />
      </span>

      <figcaption className="khatam__caption label">{photo.caption}</figcaption>
    </figure>
  );
}

export function About() {
  const [rubric, rest] = opening(profile.blurb);
  const [open, setOpen] = useState(false);
  const shut = useCallback(() => setOpen(false), []);

  return (
    <section className="chapter chapter--sand about" id="about" aria-labelledby="about-heading">
      <div className="chapter__inner">
        <Announce id="about" figure={profile.location} />

        <div className="about__body">
          <div className="about__say">
            <Shamsa className="about__mark" />
            {/* The control is set in the sentence, after its full stop, not
                under it: a word on the last line costs the band no height
                and asks for none of the reader's attention until they have
                finished reading. Inside the <p> so it travels with the
                text — where the sentence ends is where it is. */}
            <p className="about__blurb reveal">
              <span className="about__rubric">{rubric}</span>
              {rest}{' '}
              <button
                type="button"
                className="quietbtn about__more"
                onClick={() => setOpen(true)}
                data-cursor="control"
              >
                More
                {/* The word on the page is the start of the name a screen
                    reader hears, not a different one: 'More' alone says
                    nothing about what of. */}
                <span className="visually-hidden"> about me: the longer version</span>
              </button>
            </p>
          </div>

          <div className="plates">
            {PLATES.map(({ photo, span }, index) => (
              <Plate
                key={photo.stem}
                photo={photo}
                span={span}
                index={index}
                sizes="(max-width: 60rem) 92vw, 24vw"
              />
            ))}
          </div>

          <dl className="record">
            {RECORD.map((row, index) => (
              <div className="record__cell reveal" style={{ '--i': index }} key={row.label}>
                <span className="record__mark" aria-hidden="true">
                  <Icon name={row.mark} />
                </span>
                <dt className="record__label label">{row.label}</dt>
                <dd className="record__value">{row.value}</dd>
                {row.detail ? <dd className="record__detail">{row.detail}</dd> : null}
              </div>
            ))}
          </dl>
        </div>
      </div>

      <Gloss open={open} onClose={shut} />
    </section>
  );
}

export default About;
