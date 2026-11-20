// The bands of the carpet, in order. Read by the warp, the menu, the
// observer, App, and each band's own announcement.
//
// `title` is the band's name as announced; `fa` is its Persian pair, struck
// beside the Latin the way the hero pairs the name itself. `lede` is one
// line under the rule: what the band holds. Any figure that belongs in an
// announcement — a count, a span of years — is passed in by the band itself
// from its own data, never written here, so the two can never disagree.

export const CHAPTERS = [
  { id: 'hero', no: 0, label: 'Top' },
  {
    id: 'about',
    no: 1,
    label: 'About',
    title: 'About me',
    fa: 'درباره',
    lede: ['A brief introduction to who I am and what I do.'],
  },
  {
    id: 'work',
    no: 2,
    label: 'Projects',
    title: 'Projects',
    fa: 'کارها',
    lede: ['Seven finished products, from academic work to personal projects and professional endeavors.'],
  },
  {
    id: 'journey',
    no: 3,
    label: 'Experience',
    title: 'Experience',
    fa: 'مسیر',
    lede: ['Eight years worth of experiences under one timeline.'],
  },
  {
    id: 'stack',
    no: 4,
    label: 'Skills',
    title: 'Skills',
    fa: 'مهارت‌ها',
    lede: ['Languages, frameworks, practice, tools, and the personal skills I bring to the table.'],
  },
  {
    id: 'contact',
    no: 5,
    label: 'Contact',
    title: 'Get in touch',
    fa: 'تماس',
    lede: ['A graduate role, an internship, a freelance build, or an idea you want a second pair of hands on.'],
  },
];

/** The five numbered bands — everything except the hero. */
export const SECTIONS = CHAPTERS.filter((entry) => entry.id !== 'hero');

export const chapter = (id) => CHAPTERS.find((entry) => entry.id === id);

/** 2 -> '02' */
export const folio = (n) => String(n).padStart(2, '0');
