import { useState } from 'react';

import ChapterHead from '../components/ChapterHead.jsx';
import { Device } from '../components/Device.jsx';
import Icon from '../components/Icon.jsx';
import { projects } from '../data/projects.js';
import { deviceFrame } from '../lib/device.js';

/**
 * Selected work, as a dial.
 *
 * The artefact runs out to the selvedge on the left and the seven entries
 * are read down an aside on the right: choose one and it comes up on the
 * left. A grid of seven cards makes the reader compare thumbnails; this
 * makes them compare products, at a size where the screen can actually be
 * read, and keeps all seven names in view while they do it.
 *
 * Choosing is a click, never a hover. A rail that changed the whole left of
 * the page as the pointer crossed it put the reader in the position of
 * having to avoid it, and gave the keyboard a different instrument from the
 * mouse. One click selects, a second on the one already up opens its file.
 *
 * The artefact itself is the link: where an entry is deployed it goes to the
 * deployment, and where it is not it opens the file. A screen this size that
 * did nothing when clicked is a dead zone the whole chapter is built around.
 */
// Both frames are read at about half the glass, so one figure covers them.
const SIZES = '(max-width: 62rem) 92vw, 50vw';

/** The sash, struck across the artefact's top-left corner where it is live. */
function Flash() {
  return (
    <span className="flash" aria-hidden="true">
      <span className="flash__band">Live</span>
    </span>
  );
}

export function Work({ onOpen }) {
  const [active, setActive] = useState(0);
  const project = projects[active];

  // Which frame the entry will be drawn in, decided from the same place the
  // drawing decides it.
  const { kind } = deviceFrame(project);

  // Clicking the artefact does the biggest thing the entry has: open what is
  // deployed, or open the file.
  const live = project.links.live;

  const alt =
    kind === 'laptop'
      ? `${project.title} running on a laptop`
      : `Three screens of ${project.title} running on a phone`;

  // Three actions, always three, in the same order whatever the entry: the
  // file, the source, the written case study. `See more` is the one every
  // project has, so it leads; a project missing one of the other two says so
  // in place rather than dropping the control, because a row of two buttons
  // here and three there reads as a layout accident. The deployment is not
  // in this row — it is on the device itself, as the flash.
  const actions = [
    { key: 'open', label: 'See more', icon: 'arrowRight', open: true },
    project.links.repo
      ? { key: 'repo', label: 'GitHub', icon: 'repo', href: project.links.repo }
      : { key: 'repo', label: 'Code not public', icon: 'repo' },
    project.links.doc
      ? { key: 'doc', label: 'Case study', icon: 'doc', href: project.links.doc }
      : { key: 'doc', label: 'No file yet', icon: 'doc' },
  ];

  return (
    <section className="chapter chapter--fit" id="work" aria-labelledby="work-heading">
      <div className="chapter__inner">
        <ChapterHead id="work" figure={`${String(projects.length).padStart(2, '0')} entries`} />

        <div className="dial">
          {/* The name of what is up, read across the top of the chapter
              rather than down a column beside it. The name and the facts
              about it share a line — they are one statement, and stacking
              the facts above the name made a label out of them. The
              sentence runs underneath. Keyed on the project so it replays
              as the channel changes instead of only on arrival. */}
          <header className="dial__head" key={project.id}>
            <div className="dial__name">
              <h3 className="dial__title">{project.title}</h3>
              <p className="dial__meta label">
                {`${project.kind} · ${project.platform} · ${project.context}`}
              </p>
            </div>
            <p className="dial__line">{project.oneLine}</p>
          </header>

          {/* The channels, read down rather than across. Every name stays on
              screen, so the reader is choosing between seven products rather
              than paging through them one at a time. One click brings an
              entry up, a second on the one already up opens its file. */}
          <nav className="dial__rail" aria-label="Projects">
            {projects.map((entry, index) => (
              <button
                key={entry.id}
                type="button"
                className="chan"
                aria-current={index === active ? 'true' : undefined}
                onClick={() => (index === active ? onOpen(entry.id) : setActive(index))}
                data-cursor="open"
                data-cursor-label={index === active ? 'Open' : 'Show'}
              >
                <span className="chan__no figures" aria-hidden="true">
                  {entry.no}
                </span>
                <span className="chan__title">{entry.title}</span>
                <span className="chan__mark" aria-hidden="true" />
                <span className="visually-hidden">{` — ${entry.oneLine}`}</span>
              </button>
            ))}
          </nav>

          {/* The artefact, drawn in the frame it was captured in and run out
              past the reading column to the woven edge. No ground under it:
              the artefact is the drawing. */}
          <div className="dial__stage" data-frame={kind}>
            <div className="dial__screen" key={`${project.id}-screen`}>
              {live ? (
                <a
                  className="dial__open"
                  href={live}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${project.title} live`}
                  data-cursor="open"
                  data-cursor-label="Open live"
                >
                  <Device project={project} alt={alt} sizes={SIZES} flag={<Flash />} />
                </a>
              ) : (
                <button
                  type="button"
                  className="dial__open"
                  onClick={() => onOpen(project.id)}
                  aria-label={`Open the ${project.title} file`}
                  data-cursor="open"
                  data-cursor-label="See more"
                >
                  <Device project={project} alt={alt} sizes={SIZES} />
                </button>
              )}
            </div>
          </div>

          <ul className="dial__actions">
            {actions.map((action) => (
              <li key={action.key}>
                {action.href ? (
                  <a
                    className="act"
                    href={action.href}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="control"
                  >
                    <Icon name={action.icon} />
                    {action.label}
                  </a>
                ) : action.open ? (
                  <button
                    type="button"
                    className="act act--lead"
                    onClick={() => onOpen(project.id)}
                    data-cursor="control"
                  >
                    <Icon name={action.icon} />
                    {action.label}
                  </button>
                ) : (
                  <span className="act act--off">
                    <Icon name={action.icon} />
                    {action.label}
                  </span>
                )}
              </li>
            ))}
          </ul>

        </div>
      </div>
    </section>
  );
}

export default Work;
