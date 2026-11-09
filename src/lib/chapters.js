// The chapters, in order. Read by the selvedge, the nav, the observer, App,
// and each chapter's own heading.
//
// `lede` is the line under the title: what the chapter holds, in one
// sentence. Any figure that belongs in a head — a count, a span of years — is
// passed in by the chapter itself from its own data, never written here, so
// the two can never disagree.

export const CHAPTERS = [
  { id: 'hero', no: 0, label: 'Top' },
  {
    id: 'about',
    no: 1,
    label: 'About',
    title: 'About me',
    // Written as lines, like profile.blurb: each entry is one line of the
    // page on a wide screen, and below that they run together and wrap.
    lede: ['Where I studied, what I build, and three photographs of it actually happening.'],
  },
  {
    id: 'work',
    no: 2,
    label: 'Work',
    title: 'Selected work',
    // Written as one line, so it runs the width of the rule under the
    // title rather than wrapping inside a reading measure.
    lede: ['Seven finished products. Open one and you get the whole file: what it does, and how it is built.'],
  },
  {
    id: 'journey',
    no: 3,
    label: 'Journey',
    title: 'How it went',
    // One line across the rule, like 01 and 02 — every chapter now stands in
    // one screen, and a sentence wrapped to a second line is a line the body
    // under it has to give back.
    lede: ['School, degree, placements and the job that paid for all of it — on one axis, overlaps and all.'],
  },
  {
    id: 'stack',
    no: 4,
    label: 'Stack',
    title: 'What I build with',
    lede: ['Counted from the work above rather than claimed: the figure beside a name is how many of the seven actually use it.'],
  },
  {
    id: 'contact',
    no: 5,
    label: 'Contact',
    title: 'Get in touch',
    lede: ['A graduate role, an internship, a freelance build, or an idea you want a second pair of hands on.'],
  },
];

/** The five numbered chapters — everything except the hero. */
export const SECTIONS = CHAPTERS.filter((entry) => entry.id !== 'hero');

export const chapter = (id) => CHAPTERS.find((entry) => entry.id === id);

/** 2 -> '02' */
export const folio = (n) => String(n).padStart(2, '0');
