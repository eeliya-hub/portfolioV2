import { useCallback, useEffect, useRef, useState } from "react";

import Icon from "./Icon.jsx";
import { Shamsa } from "./Ornament.jsx";
import { folio } from "../lib/chapters.js";
import { picture } from "../lib/media.js";
import { projectById } from "../data/projects.js";

const LINKS = [
  { key: "live", label: "Open the live site", icon: "external", primary: true },
  { key: "repo", label: "Read the code", icon: "repo" },
  { key: "doc", label: "Read the case study", icon: "doc" },
];

// A capture wider than it is tall takes half the sheet; a narrow panel takes
// a quarter. The two come out within a few per cent of the same height — a
// half-width 16:10 and a quarter-width 3:4 differ by about one line of type —
// so a project whose captures are not all the same shape still rules up into
// even rows, and nothing is cropped or set in a letterbox to get there.
const WIDE = 1.2;

// What each image is told to expect of its box, so the browser never fetches
// a full-width variant for a thumbnail or a thumbnail for the loupe.
const SIZES = {
  half: "(max-width: 62rem) 92vw, 44vw",
  quarter: "(max-width: 62rem) 44vw, 22vw",
  loupe: "(max-width: 62rem) 94vw, 82vw",
};

/**
 * One capture on the sheet, at its own shape, numbered in the margin.
 *
 * The image carries no alt text of its own: the caption under it says the
 * same thing in the open, and the control that holds it is named for what
 * it does. Three readings of one line is two too many.
 */
function Plate({ shot, index, onOpen }) {
  const image = picture(shot.stem);
  if (!image) return null;
  const wide = image.aspect >= WIDE;

  return (
    <figure className="plate" data-width={wide ? "half" : "quarter"}>
      <button
        type="button"
        className="plate__open"
        onClick={() => onOpen(index)}
        aria-label={`Plate ${folio(index + 1)}, enlarge`}
        data-cursor="open"
        data-cursor-label="Enlarge"
      >
        <img
          src={image.src}
          srcSet={image.srcSet}
          sizes={wide ? SIZES.half : SIZES.quarter}
          width={image.width}
          height={image.height}
          alt=""
          loading="lazy"
          decoding="async"
        />
      </button>
      <figcaption className="plate__caption">
        <span className="plate__no figures" aria-hidden="true">
          {folio(index + 1)}
        </span>
        <span className="plate__alt">{shot.alt}</span>
      </figcaption>
    </figure>
  );
}

/**
 * The loupe: one plate off the sheet, held up to the light.
 *
 * It has no ground of its own — only a deeper scrim — so the file is still
 * there underneath, dimmed one further stop. The capture is given the whole
 * frame at its own shape, and everything said about it is ruled off at the
 * foot: which plate of how many, what it shows, and the warp of the rest of
 * the set with this one struck in madder.
 *
 * A second native `<dialog>`, a sibling of the file rather than a child of
 * it, which buys three things: the top layer stacks in arrival order so this
 * is painted over the file without a z-index; Escape is dealt with by the
 * topmost modal, so it lifts the loupe and leaves the file open; and a wheel
 * over it chains to the body rather than to the file's own scroller, so the
 * reader comes back to the place on the sheet they left.
 */
function Loupe({ project, at, onMove, onClose }) {
  const ref = useRef(null);
  const img = useRef(null);
  const [shown, setShown] = useState(false);
  const [lit, setLit] = useState(-1);

  const gallery = project?.gallery ?? [];
  const count = gallery.length;
  const shot = at === null ? null : gallery[at];
  const image = shot ? picture(shot.stem) : null;

  const close = useCallback(() => {
    const node = ref.current;
    if (!node?.open) return onClose();
    setShown(false);
    return setTimeout(() => node.close(), 180);
  }, [onClose]);

  const step = useCallback(
    (by) => {
      if (count) onMove((at + by + count) % count);
    },
    [at, count, onMove],
  );

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (at !== null && !node.open) {
      node.showModal();
      requestAnimationFrame(() => setShown(true));
    }
    if (at === null && node.open) node.close();

    const onClosed = () => onClose();
    node.addEventListener("close", onClosed);
    return () => node.removeEventListener("close", onClosed);
  }, [at, onClose]);

  // A cached capture never fires load, so the state it would have set is
  // read off the element instead, once the frame it belongs to is in place.
  useEffect(() => {
    if (at !== null && img.current?.complete) setLit(at);
  }, [at]);

  // The plate either side, fetched at the size the loupe will ask for, so
  // stepping through the set is a change of picture rather than a wait for
  // one. srcset and sizes before src, or the browser picks from neither.
  useEffect(() => {
    if (!project || at === null) return;
    for (const near of [project.gallery[at + 1], project.gallery[at - 1]]) {
      const ahead = near && picture(near.stem);
      if (!ahead) continue;
      const pre = new Image();
      pre.sizes = SIZES.loupe;
      pre.srcset = ahead.srcSet;
      pre.src = ahead.src;
    }
  }, [at, project]);

  return (
    <dialog
      className="loupe on-lacquer"
      ref={ref}
      data-shown={shown ? "true" : undefined}
      aria-label={
        shot ? `${project.title}, plate ${folio(at + 1)} of ${folio(count)}` : undefined
      }
      // The inner fills the dialog, so a click on the dark around the plate
      // never reaches the backdrop. Anywhere that is not the capture itself
      // or one of the two ruled bands is read as that click instead.
      onClick={(event) => {
        if (!(event.target instanceof Element)) return;
        if (!event.target.closest('.loupe__img, .loupe__bar, .loupe__foot')) close();
      }}
      onKeyDown={(event) => {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
        event.preventDefault();
        step(event.key === "ArrowRight" ? 1 : -1);
      }}
    >
      {shot && image ? (
        <div className="loupe__inner">
          <header className="loupe__bar">
            <p className="loupe__meta label figures">
              <span>{project.title}</span>
              <span className="loupe__mark" aria-hidden="true" />
              <span className="loupe__count">
                {folio(at + 1)} / {folio(count)}
              </span>
            </p>
            <button
              type="button"
              className="iconbtn"
              onClick={close}
              aria-label="Close the plate"
              data-cursor="close"
            >
              <Icon name="close" />
            </button>
          </header>

          <div className="loupe__frame" data-lit={lit === at ? "true" : undefined}>
            <img
              key={shot.stem}
              ref={img}
              className="loupe__img"
              src={image.src}
              srcSet={image.srcSet}
              sizes={SIZES.loupe}
              width={image.width}
              height={image.height}
              alt=""
              decoding="async"
              onLoad={() => setLit(at)}
            />
          </div>

          <footer className="loupe__foot">
            <p className="loupe__caption">
              <span className="loupe__no figures" aria-hidden="true">
                {folio(at + 1)}
              </span>
              <span>{shot.alt}</span>
            </p>

            {count > 1 ? (
              <div className="loupe__nav">
                {/* The warp of the whole set, this one struck in madder:
                  where the reader is, and how much is left, in the same
                  marks the selvedge is woven from. */}
                <nav className="loupe__warp" aria-label="Plates">
                  {gallery.map((other, index) => (
                    <button
                      key={other.stem}
                      type="button"
                      className="loupe__thread"
                      data-here={index === at ? "true" : undefined}
                      aria-current={index === at ? "true" : undefined}
                      onClick={() => onMove(index)}
                      aria-label={`Plate ${folio(index + 1)}`}
                      data-cursor="control"
                    />
                  ))}
                </nav>

                <div className="loupe__steps">
                  <button
                    type="button"
                    className="iconbtn"
                    onClick={() => step(-1)}
                    aria-label="The plate before"
                    data-cursor="control"
                  >
                    <Icon name="chevronLeft" />
                  </button>
                  <button
                    type="button"
                    className="iconbtn"
                    onClick={() => step(1)}
                    aria-label="The plate after"
                    data-cursor="control"
                  >
                    <Icon name="chevronRight" />
                  </button>
                </div>
              </div>
            ) : null}
          </footer>
        </div>
      ) : null}
    </dialog>
  );
}

/**
 * The file: one project, opened out.
 *
 * It is read top to bottom in four movements, each one answering a different
 * question. Who and what — the title block, where the name is set at the size
 * the chapter headings are, and under it one line carrying both standing
 * facts: who it was made for, and what it runs on. Why it exists — the
 * standfirst, and the three ways out to the thing itself. What it does and
 * what it is made of — side by side, because the two are read against each
 * other. And then the evidence: every capture there is, on one sheet, at the
 * shape it was taken in, each one opening into the loupe.
 *
 * The screens are the last movement and the longest, which is the whole
 * argument of the thing: a project is a claim, and the sheet is the proof.
 * They are not behind a strip you have to drag sideways to discover, because
 * a reader who does not find the handle never learns the work exists.
 *
 * It is a native `<dialog>`, so modality, Escape, the top layer and focus
 * return to the row you opened it from are all the platform's job rather
 * than something reimplemented here with a focus trap.
 *
 * The surface is lacquer in both editions: opening a file is meant to feel
 * like the lights going down.
 */
export function Dossier({ id, onClose }) {
  const ref = useRef(null);
  const scrollRef = useRef(null);
  const [shown, setShown] = useState(false);
  const [plate, setPlate] = useState(null);
  const project = id ? projectById(id) : null;

  const close = useCallback(() => {
    const node = ref.current;
    if (!node?.open) return onClose();
    // Let the closing motion run before the element leaves the top layer.
    setShown(false);
    return setTimeout(() => node.close(), 220);
  }, [onClose]);

  const shut = useCallback(() => setPlate(null), []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (project && !node.open) {
      node.showModal();
      document.body.dataset.locked = "true";
      scrollRef.current?.scrollTo(0, 0);
      setPlate(null);
      // One frame, so the opening transition has a state to move from.
      requestAnimationFrame(() => setShown(true));
    }

    const onCancel = (event) => {
      // Escape: run the same closing motion rather than vanishing.
      event.preventDefault();
      close();
    };
    const onClosed = () => {
      delete document.body.dataset.locked;
      onClose();
    };

    node.addEventListener("cancel", onCancel);
    node.addEventListener("close", onClosed);
    return () => {
      node.removeEventListener("cancel", onCancel);
      node.removeEventListener("close", onClosed);
    };
  }, [project, close, onClose]);

  useEffect(() => () => delete document.body.dataset.locked, []);

  return (
    <>
      <dialog
        className="dossier on-lacquer"
        ref={ref}
        data-shown={shown ? "true" : undefined}
        aria-labelledby={project ? "dossier-title" : undefined}
        // A click on the backdrop lands on the dialog element itself.
        onClick={(event) => {
          if (event.target === ref.current) close();
        }}
      >
        {project ? (
          <div className="dossier__scroll" ref={scrollRef}>
            <div className="dossier__inner">
              <button
                type="button"
                className="dossier__close iconbtn"
                onClick={close}
                aria-label={`Close the ${project.title} file`}
                data-cursor="close"
              >
                <Icon name="close" />
              </button>

              {/* The title block. The number is set in the margin and turned
                on its side, the way every chapter is numbered on this site;
                the name takes the whole measure; and under it runs one line
                holding the two things asked of any piece of work before it
                is looked at — who it was for, and what it runs on. */}
              <header className="dossier__head">
                <p className="dossier__folio figures" aria-hidden="true">
                  {project.no}
                  {project.year ? (
                    <span className="dossier__year">{project.year}</span>
                  ) : null}
                </p>

                <h2 className="dossier__title" id="dossier-title">
                  {project.title}
                </h2>

                <p className="dossier__for">
                  {project.context}
                  {project.platform ? (
                    <span className="dossier__platform">
                      <span className="dossier__mid" aria-hidden="true" />
                      {project.platform}
                    </span>
                  ) : null}
                </p>
              </header>

              <p className="dossier__standfirst">{project.standfirst}</p>

              <div className="dossier__links">
                {LINKS.map((link) =>
                  project.links[link.key] ? (
                    <a
                      key={link.key}
                      className={`btn ${link.primary ? "btn--primary" : ""}`.trim()}
                      href={project.links[link.key]}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="control"
                    >
                      <Icon name={link.icon} />
                      {link.label}
                    </a>
                  ) : null,
                )}
              </div>

              <div className="dossier__body">
                <section className="dossier__panel">
                  <h3 className="dossier__sub">What it does</h3>
                  <ul className="points">
                    {project.highlights.map((point, index) => (
                      <li className="points__row" key={point}>
                        <span className="points__no figures" aria-hidden="true">
                          {folio(index + 1)}
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="dossier__panel">
                  <h3 className="dossier__sub">Built with</h3>
                  <ul className="spec">
                    {project.stack.map((item) => (
                      <li className="spec__row" key={item}>
                        <span className="spec__mark" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <section
                className="dossier__gallery"
                aria-label={`${project.title} screenshots`}
              >
                <div className="dossier__galleryhead">
                  <h3 className="dossier__sub">Every screen</h3>
                  <p className="label figures">
                    {folio(project.gallery.length)} plates — open one
                  </p>
                </div>

                <div className="sheet">
                  {project.gallery.map((shot, index) => (
                    <Plate
                      key={shot.stem}
                      shot={shot}
                      index={index}
                      onOpen={setPlate}
                    />
                  ))}
                </div>
              </section>

              <footer className="dossier__foot">
                <Shamsa className="dossier__mark" />
                <button
                  type="button"
                  className="btn"
                  onClick={close}
                  data-cursor="control"
                >
                  <Icon name="arrowLeft" />
                  Back to the register
                </button>
              </footer>
            </div>
          </div>
        ) : null}
      </dialog>

      <Loupe
        project={project}
        at={project ? plate : null}
        onMove={setPlate}
        onClose={shut}
      />
    </>
  );
}

export default Dossier;
