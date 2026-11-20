import Announce from '../components/Announce.jsx';
import { Capture } from '../components/Capture.jsx';
import Icon from '../components/Icon.jsx';
import { projects } from '../data/projects.js';

/**
 * 02 — the deck.
 *
 * The seven projects are dealt as full-screen plates that stack: the band
 * pins to the glass and each plate slides in from the left over the one
 * before it, so reading the chapter is a hand dealing plates across a table
 * rather than a scroll of thumbnails rising from below.
 *
 * The band is one pinned leg and the whole deal is arithmetic on the single
 * travel number the loom engine writes — see the stylesheet. Nothing here
 * measures anything or runs on a clock. Each plate is absolutely stacked in
 * the pinned frame, so the one being read is the topmost arrived plate and
 * the ones under it are still in the page; the engine marks every covered
 * plate `inert`, which takes it out of hit testing and out of the focus
 * order until it is uncovered again.
 *
 * The band used to be pinned to lacquer whichever edition was running — the
 * lights going down for the work. In the day edition that made the one
 * chapter a reader came for the one chapter that ignored the edition they
 * had chosen, so it takes the ordinary parchment ground now, between the
 * two sand bands either side of it. Opening a file is still the lights
 * going down; that is what lacquer is for.
 *
 * Every plate leads with its screen at the size a screen can actually be
 * read, the entry's number standing at architectural scale behind it. The
 * screen is the biggest control on the plate: where the project is deployed
 * it opens the deployment, and where it is not it opens the file. The rest
 * of the file — the whole case — is one click away on every plate.
 */
const SIZES = '(max-width: 64rem) 92vw, 52vw';

/** The sash struck across the screen's corner where the entry is live. */
function Flash() {
  return (
    <span className="flash" aria-hidden="true">
      <span className="flash__band">Live</span>
    </span>
  );
}

function Piece({ project, index, onOpen }) {
  const live = project.links.live;
  const alt = `A screen of ${project.title}`;
  // The title breaks between words and never inside one, so its longest
  // word is what has to fit across a phone. The stylesheet sizes it down
  // from this when the glass is too narrow for it.
  const chars = Math.max(...project.title.split(/\s+/).map((word) => word.length));
  // Built as parts rather than one joined string, so the platform can be
  // struck in madder: it is the thing a reader scanning the deck is looking
  // for, and the kind and the context are the caption around it.
  const meta = [
    { text: project.kind },
    { text: project.platform, where: true },
    { text: project.context },
  ].filter((part) => part.text);

  return (
    <article className="piece" style={{ '--i': index }} aria-labelledby={`piece-${project.id}`}>
      <div className="piece__inner">
        <p className="piece__no figures" aria-hidden="true">
          {project.no}
        </p>

        <div className="piece__text">
          <p className="piece__meta label reveal">
            {meta.map((part, i) => (
              <span key={part.text}>
                {i > 0 ? ' · ' : null}
                <span className={part.where ? 'piece__where' : undefined}>{part.text}</span>
              </span>
            ))}
          </p>
          <h3
            className="piece__title reveal reveal--wipe"
            id={`piece-${project.id}`}
            style={{ '--chars': chars }}
          >
            <span>{project.title}</span>
          </h3>
          <p className="piece__line reveal" style={{ '--i': 1 }}>
            {project.oneLine}
          </p>

          <div className="piece__acts reveal" style={{ '--i': 2 }}>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => onOpen(project.id)}
              data-cursor="control"
            >
              <Icon name="doc" />
              Open the file
            </button>
            {live ? (
              <a className="btn" href={live} target="_blank" rel="noreferrer" data-cursor="control">
                <Icon name="external" />
                Live
              </a>
            ) : null}
            {project.links.site ? (
              <a
                className="btn"
                href={project.links.site}
                target="_blank"
                rel="noreferrer"
                data-cursor="control"
              >
                <Icon name="external" />
                Product site
              </a>
            ) : null}
            {project.links.repo ? (
              <a
                className="btn"
                href={project.links.repo}
                target="_blank"
                rel="noreferrer"
                data-cursor="control"
              >
                <Icon name="repo" />
                Code
              </a>
            ) : null}
          </div>
        </div>

        <div className="piece__stage reveal" style={{ '--i': 1 }}>
          {live ? (
            <a
              className="piece__open"
              href={live}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${project.title} live`}
              data-cursor="open"
              data-cursor-label="Open live"
            >
              <Capture project={project} alt={alt} sizes={SIZES} flag={<Flash />} />
            </a>
          ) : (
            <button
              type="button"
              className="piece__open"
              onClick={() => onOpen(project.id)}
              aria-label={`Open the ${project.title} file`}
              data-cursor="open"
              data-cursor-label="Open file"
            >
              <Capture project={project} alt={alt} sizes={SIZES} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function Work({ onOpen }) {
  return (
    <section className="chapter works" id="work" aria-labelledby="work-heading">
      <div className="chapter__inner works__head">
        <Announce id="work" figure={`${String(projects.length).padStart(2, '0')} entries`} />
      </div>

      {/* The pinned leg. `--n` is the one figure the deal needs: how many
          plates there are to get through, which sets both the leg's height
          and each plate's slice of the travel. */}
      <div className="deck" data-loom="travel" style={{ '--n': projects.length }}>
        <div className="deck__pin" data-loom="deck-x">
          {projects.map((project, index) => (
            <Piece key={project.id} project={project} index={index} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Work;
