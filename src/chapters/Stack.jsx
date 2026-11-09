import { useRef, useState } from 'react';

import ChapterHead from '../components/ChapterHead.jsx';
import { GuardBand } from '../components/Ornament.jsx';
import { folio } from '../lib/chapters.js';
import { projects } from '../data/projects.js';
import { stackRegisters } from '../data/stack.js';
import { usedIn } from '../lib/stack.js';

const TOTAL = stackRegisters.reduce((sum, group) => sum + group.items.length, 0);
const OF = projects.length;

// Each register's names ordered the way a specimen is ordered, the largest
// first, and otherwise in the order the register gives them.
//
// A register is set by size only when at least two of its names turn up in
// the projects — size is a comparison, and it needs two things to compare.
// Tools has one (Postman, in the Alumni API's stack), so sizing it would set
// Postman large and Git, GitHub and Figma small, which reads as the reverse
// of the truth: they are simply not the kind of thing a project lists as its
// stack. Tools and the ways of working with people are set even instead.
const REGISTERS = stackRegisters.map((group) => {
  const items = group.items
    .map((name, order) => ({ name, order, uses: usedIn(name) }))
    .sort((a, b) => b.uses.length - a.uses.length || a.order - b.order);
  const listed = items.filter((item) => item.uses.length > 0).length;
  return { ...group, items, sized: listed >= 2, listed: listed > 0 };
});

// The step a name is set at: how many of the seven list it, held to four.
const step = (item, sized) => (sized ? String(Math.min(item.uses.length, 4)) : 'even');

/**
 * The stack, as a type specimen.
 *
 * Every name in a register is set in one wall of type, and the size it is
 * set at is how many of the seven projects actually use it — counted from
 * the project data at render time and never typed here. JavaScript, in four
 * of them, is the largest thing in the chapter; Java and PHP, which are on
 * the CV and in none of the seven, are set small and quiet. That is the
 * chapter's own claim made visible: counted from the work rather than
 * claimed. Size is never the only place the number lives — a figure stands
 * beside every counted name, and the reading under the wall says it in words.
 *
 * Choosing a name is a click. The reading under the wall then gives the
 * count as knots out of seven and lists the projects as links into their
 * files. Each register remembers what was chosen in it.
 */
export function Stack({ onOpen }) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(() => REGISTERS.map((group) => group.items[0].name));
  const tabRefs = useRef([]);

  const group = REGISTERS[index];
  const current = group.items.find((item) => item.name === picked[index]) ?? group.items[0];
  const count = current.uses.length;

  // Selection and focus move together, or the keyboard is left on a button
  // that is no longer tabbable while the ring sits on an unselected tab.
  const go = (next) => {
    const target = (next + REGISTERS.length) % REGISTERS.length;
    setIndex(target);
    tabRefs.current[target]?.focus();
  };

  const pick = (name) => setPicked((list) => list.map((entry, n) => (n === index ? name : entry)));

  return (
    <section className="chapter chapter--fit" id="stack" aria-labelledby="stack-heading">
      <div className="chapter__inner">
        <ChapterHead id="stack" figure={`${TOTAL} in all`} />

        <div className="stackbody">
          <ul className="registers__tabs reveal" role="tablist" aria-label="Stack registers">
            {REGISTERS.map((entry, position) => (
              <li key={entry.id} role="presentation">
                <button
                  type="button"
                  role="tab"
                  id={`tab-${entry.id}`}
                  aria-selected={position === index}
                  aria-controls={`panel-${entry.id}`}
                  tabIndex={position === index ? 0 : -1}
                  className="tab"
                  ref={(node) => {
                    tabRefs.current[position] = node;
                  }}
                  onClick={() => setIndex(position)}
                  onKeyDown={(event) => {
                    const keys = {
                      ArrowRight: position + 1,
                      ArrowLeft: position - 1,
                      Home: 0,
                      End: REGISTERS.length - 1,
                    };
                    if (event.key in keys) {
                      event.preventDefault();
                      go(keys[event.key]);
                    }
                  }}
                >
                  {entry.title}
                  <span className="tab__n figures">{folio(entry.items.length)}</span>
                </button>
              </li>
            ))}
          </ul>

          {REGISTERS.map((register) => (
            <div
              className="specimen"
              id={`panel-${register.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${register.id}`}
              hidden={register.id !== group.id}
              key={register.id}
            >
              <ul className="specimen__wall">
                {register.items.map((item, position) => {
                  const uses = item.uses.length;
                  return (
                    <li key={item.name}>
                      <button
                        type="button"
                        className="specimen__name"
                        data-step={step(item, register.sized)}
                        aria-current={item.name === current.name && register.id === group.id ? 'true' : undefined}
                        aria-controls="stack-reading"
                        onClick={() => pick(item.name)}
                        data-cursor="open"
                        data-cursor-label="Read"
                        style={{ '--i': position }}
                      >
                        {item.name}
                        {uses ? (
                          <span className="specimen__n figures" aria-hidden="true">
                            {folio(uses)}
                          </span>
                        ) : null}
                        {register.listed ? (
                          <span className="visually-hidden">{`, in ${uses} of the ${OF} projects`}</span>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <div className="reading reveal" id="stack-reading" aria-live="polite">
            <div className="reading__head" key={`${group.id}-${current.name}`}>
              <p className="reading__name">{current.name}</p>
              <p className="reading__count">
                {group.listed ? (
                  <>
                    <span className="reading__knots" aria-hidden="true">
                      {Array.from({ length: OF }, (_, knot) => (
                        <span
                          className="reading__knot"
                          key={knot}
                          data-filled={knot < count || undefined}
                          style={{ '--k': knot }}
                        />
                      ))}
                    </span>
                    {/* Said as what the data knows: whether a project names it
                        in its stack, not whether it was ever touched. */}
                    {count ? `In ${count} of the ${OF} projects` : `Not in the listed stack of any of the ${OF}`}
                  </>
                ) : (
                  'Not counted from the projects'
                )}
              </p>
            </div>

            <ul className="reading__projects" key={`${group.id}-${current.name}-projects`}>
              {current.uses.map((project, n) => (
                <li key={project.id} style={{ '--i': n }}>
                  <button
                    type="button"
                    className="chip reading__project"
                    onClick={() => onOpen(project.id)}
                    data-cursor="open"
                    data-cursor-label="Open"
                  >
                    {project.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <GuardBand />
      </div>
    </section>
  );
}

export default Stack;
