import { useCallback, useEffect, useRef, useState } from "react";

import Icon from "./Icon.jsx";
import { folio } from "../lib/chapters.js";
import { markFor } from "../lib/marks.js";
import { picture } from "../lib/media.js";
import { projectById } from "../data/projects.js";

// A product site is a page ABOUT the work rather than the work running, so it
// is never called live. It leads the file only where nothing is live — a
// project never carries both.
const LINKS = [
  { key: "live", label: "Open the live site", icon: "external", primary: true },
  { key: "site", label: "Visit the product site", icon: "external", primary: true },
  { key: "repo", label: "Read the code", icon: "repo" },
  { key: "doc", label: "Read the case study", icon: "doc" },
];

// The frame is cut to the work, not the work to the frame.
//
// A project's captures are mostly one shape — a phone app's are 1.78, a web
// app's 1.6, a dashboard's 2.1 — so each file gets a STAGE in that shape:
// the largest group of captures within SAME of each other, at the group's
// median. The bordered frame is then sized to the capture actually being
// shown. Where the capture is the stage's shape it fills it exactly; where it
// is not (PulseOS's four portrait panels among ten wide screens) the frame is
// cut to the capture and stands centred in the stage, so the lozenges either
// side never move under the reader's pointer while they step.
//
// Every figure here is in units of the reference drawing the file is laid out
// to: the stage is at most 712 wide and 445 tall, which is a 1.6 capture at
// the full width of the frame column.
const SAME = 0.06;
// Within this of the stage a capture fills it, trimmed by at most the
// difference — under 1% for every capture in the register. Past it, the
// capture keeps every pixel and gets a frame of its own, at the stage's
// height so nothing moves vertically between one capture and the next.
// Sky Health's four dashboards run 2.02 to 2.12: at one shared fill the
// 2.02 lost 4.5% off its top and bottom edges, which on that screen is the
// greeting bar.
const FILL = 0.02;
const STAGE_W = 712;
const STAGE_H = 445;

function stageOf(gallery) {
  const shapes = gallery
    .map((shot) => picture(shot.stem)?.aspect)
    .filter(Boolean)
    .sort((a, b) => a - b);
  if (!shapes.length) return STAGE_W / STAGE_H;
  // Clusters of shapes within SAME of the first in the cluster.
  const groups = [];
  for (const shape of shapes) {
    const last = groups.at(-1);
    if (last && shape / last[0] - 1 <= SAME) last.push(shape);
    else groups.push([shape]);
  }
  const biggest = groups.reduce((a, b) => (b.length > a.length || (b.length === a.length && b[0] > a[0]) ? b : a));
  return biggest[Math.floor(biggest.length / 2)];
}

/** The stage and the frame inside it, in reference units. */
function cut(stageAr, shotAr) {
  const stageW = Math.min(STAGE_W, STAGE_H * stageAr);
  const stageH = stageW / stageAr;
  if (Math.abs(shotAr / stageAr - 1) <= FILL) return { stageW, stageH, shotW: stageW, shotH: stageH };
  const shotW = Math.min(stageW, stageH * shotAr);
  return { stageW, stageH, shotW, shotH: shotW / shotAr };
}

// Three points to a file, and three to every file. A list that is six long
// on one project and three on the next is not a summary, it is whatever was
// written down; three is short enough that a reader takes all of it.
const POINTS = 3;

// What each image is told to expect of its box, so the browser never fetches
// a full-width variant for a thumbnail or a thumbnail for the loupe.
const SIZES = {
  half: "(max-width: 62rem) 92vw, 52vw",
  loupe: "(max-width: 62rem) 94vw, 82vw",
};

/**
 * The mark beside a name in Built with: the product's own logo where there
 * is a file for one, a drawn glyph where the thing is a practice rather
 * than a product, and the knot — the lozenge every part carries in the
 * reference this file is drawn to — otherwise.
 * It is the same mark 04 gives the same name, looked up rather than listed
 * again — see src/lib/marks.js.
 */
function Badge({ item }) {
  if (item.logo) {
    const image = picture(`logos/${item.logo}`);
    if (image) {
      return (
        <span className="case__mark" data-dark={item.dark ? "true" : undefined}>
          <img
            src={image.src}
            srcSet={image.srcSet}
            sizes="2rem"
            width={image.width}
            height={image.height}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </span>
      );
    }
  }

  if (item.icon) {
    return (
      <span className="case__mark case__mark--drawn" aria-hidden="true">
        <Icon name={item.icon} />
      </span>
    );
  }

  // No logo file: the knot, as the reference marks every part. A monogram
  // at this size is two letters six pixels tall — a smudge, not a mark.
  return <span className="case__mark case__mark--knot" aria-hidden="true" />;
}


/**
 * The arrow inside a step control: a long shaft and an open head, drawn on
 * its own box rather than taken from the icon set — the set's arrows are
 * drawn to sit beside a word, and these stand alone inside a lozenge.
 */
function Arrow({ toward }) {
  return (
    <svg className="case__arrow" viewBox="0 0 34 16" aria-hidden="true" focusable="false">
      <path d={toward === "back" ? "M33 8H2M9 1 2 8l7 7" : "M1 8h31M25 1l7 7-7 7"} />
    </svg>
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
 * standfirst, and the ways out to the thing itself — and, beside it, the
 * work: ONE capture at the size a screen can actually be read, stepped
 * through rather than scrolled past. Under both, what it does and what it is
 * made of, side by side, because the two are read against each other.
 *
 * It was a sheet of every capture there is, stacked down the page at the
 * shape each was taken in. A fourteen-plate project ran four screens deep
 * and the reader met the same screenshot at three sizes before reaching the
 * end of it; the frame shows one at a time, says which of how many, and
 * keeps the whole set one arrow away.
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
  // Which capture the frame is showing. Not the loupe's index — the loupe
  // opens ON this one and can then be stepped independently.
  const [at, setAt] = useState(0);
  const project = id ? projectById(id) : null;
  const gallery = project?.gallery ?? [];
  const frames = gallery.length;
  const shot = gallery[Math.min(at, Math.max(0, frames - 1))] ?? null;
  const image = shot ? picture(shot.stem) : null;
  const stageAr = stageOf(gallery);
  const size = image ? cut(stageAr, image.aspect) : null;

  const turn = useCallback(
    (by) => setAt((current) => (frames ? (current + by + frames) % frames : 0)),
    [frames],
  );

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
      setAt(0);
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

              {/* The file, as one composition measured off the reference
                  it was drawn to: on the left what the project IS, on the
                  right one capture of it with a lozenge either side to step
                  through the rest, and under a single rule what it does
                  beside what it is made of. Every length in it is stated in
                  --rp, one reference pixel, so the whole file is that
                  drawing at any size and always lands in one frame. */}
              <div
                className="case"
                style={{
                  "--chars": project.title.length,
                  // The meta line is fitted to one line like the title: the
                  // context, the knot and the platform, counted together.
                  "--meta-chars": (project.context?.length ?? 0) + (project.platform?.length ?? 0) + 3,
                }}
              >
                <div className="case__about">
                  <p className="case__no figures" aria-hidden="true">
                    {project.no}
                  </p>

                  <h2 className="case__title" id="dossier-title">
                    {project.title}
                  </h2>

                  <p className="case__meta">
                    <span className="case__ctx">{project.context}</span>
                    {project.platform ? (
                      <>
                        <span className="case__lozenge" aria-hidden="true" />
                        <span className="case__plat">{project.platform}</span>
                      </>
                    ) : null}
                  </p>

                  <p className="case__text">{project.standfirst}</p>

                  <div className="case__acts">
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
                </div>

                {image ? (
                  <figure
                    className="case__frame"
                    aria-roledescription="carousel"
                    aria-label={`${project.title} screens`}
                    style={{
                      "--stage-w": size.stageW,
                      "--stage-h": size.stageH,
                      "--shot-w": size.shotW,
                      "--shot-h": size.shotH,
                    }}
                  >
                    <div className="case__stage">
                      <button
                        type="button"
                        className="case__shot"
                        onClick={() => setPlate(at)}
                        aria-label={`Screen ${folio(at + 1)} of ${folio(frames)}, enlarge`}
                        data-cursor="open"
                        data-cursor-label="Enlarge"
                      >
                        <img
                          key={shot.stem}
                          src={image.src}
                          srcSet={image.srcSet}
                          sizes={SIZES.half}
                          width={image.width}
                          height={image.height}
                          alt=""
                          decoding="async"
                        />
                      </button>

                      <button
                        type="button"
                        className="case__step"
                        data-side="back"
                        onClick={() => turn(-1)}
                        disabled={frames < 2}
                        aria-label="Previous screen"
                        data-cursor="control"
                      >
                        <Arrow toward="back" />
                      </button>

                      <button
                        type="button"
                        className="case__step"
                        data-side="on"
                        onClick={() => turn(1)}
                        disabled={frames < 2}
                        aria-label="Next screen"
                        data-cursor="control"
                      >
                        <Arrow toward="on" />
                      </button>
                    </div>

                    <figcaption className="case__cap">
                      <span className="case__said">
                        <span className="case__name">{project.title}</span>
                        <span className="case__lozenge" aria-hidden="true" />
                        <span className="case__alt">{shot.alt}</span>
                      </span>
                      <span className="case__count figures" aria-live="polite">
                        {folio(at + 1)} / {folio(frames)}
                      </span>
                    </figcaption>
                  </figure>
                ) : null}

                <div className="case__lower">
                  <section className="case__col">
                    <h3 className="case__label">What it does</h3>
                    <ol className="case__points">
                      {project.highlights.slice(0, POINTS).map((point, index) => (
                        <li className="case__point" key={point}>
                          <span className="case__pno figures" aria-hidden="true">
                            {folio(index + 1)}
                          </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ol>
                  </section>

                  <span className="case__divider" aria-hidden="true" />

                  <section className="case__col">
                    <h3 className="case__label">Built with</h3>
                    {/* Past five parts the list goes to two columns, read
                        down then across, so the longest stack in the
                        register is still five rows — the height the
                        reference was drawn at. */}
                    <ul
                      className="case__parts"
                      data-many={project.stack.length > 5 ? "true" : undefined}
                      style={{ "--rows": Math.min(5, Math.ceil(project.stack.length / 2)) }}
                    >
                      {project.stack.map((item) => (
                        <li className="case__part" key={item}>
                          <Badge item={markFor(item)} />
                          <span className="case__partname">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </div>
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
