// Everything the site says about Eeliya in one place. Plain data only — no
// imports — so the page generator in scripts/ can read it under bare Node.

export const profile = {
  name: 'Eeliya Nayeri',
  namePersian: 'ایلیا نیری',
  role: 'Software developer',
  location: 'London, United Kingdom',
  // Sits under the location in the About register.
  relocation: 'Open to relocate',
  edition: 2026,

  // The jacket line. Three statements, one per line, each independently true.
  jacket: [
    'Software developer',
    'BSc Computer Science, First Class',
    'London',
  ],

  // Read in under ten seconds, directly under the name.
  standfirst:
    'I build finished products across mobile, web and backend, and each one here is open to inspect: a live deployment, a public repository, or a written case study.',

  // The about page's opening line. Every clause of it restates bio[0] and
  // the credentials below — it says nothing the longer copy does not
  // already say.
  //
  // One sentence, not an array of lines: how many lines it takes is set by
  // how wide it is allowed to run, which is `--blurb` on `.about` in
  // src/styles/chapters.css. Widen that and it takes fewer lines; narrow it
  // and it takes more.
  blurb:
    'First Class Computer Science graduate, born in Iran, I build beautiful, finished products across mobile, web and backend. I work where systems, people and useful products meet.',

  // The long account, read in the gloss: the sheet 01 opens from the `More`
  // set in the blurb. Eeliya's own words, in his own order, and the only
  // place on the site where he speaks at length rather than in evidence —
  // the degree and the subjects are also in `credentials` and in the
  // chapters, the jobs in src/data/journey.js, the projects in
  // src/data/projects.js, but this is the one that is written rather than
  // listed. It took over a three-sentence `bio` that sat in this file and
  // was rendered nowhere.
  //
  // Any number of paragraphs: the gloss sets what it is given. The last one
  // is drawn apart, ruled off and marked in the margin, so the account ends
  // on whatever a reader is meant to do next. And the first two words are
  // struck in madder, the same rubrication the blurb takes above it, so an
  // opening worth striking earns its place.
  bio: [
    'I was born in Iran and grew up in the UK, two places that have both shaped who I am. My Iranian heritage is an important part of my identity, and something I have always wanted to stay connected to. Growing up between different cultures has given me a broader perspective, an appreciation for different ways of thinking, and a curiosity about the world around me.',
    'I am a software developer and First Class Computer Science graduate from the University of Westminster. I enjoy working across mobile, web and backend development, particularly when technology can solve everyday problems or create something genuinely useful. My interests have increasingly centred around AI, travel technology and aviation, three areas where I see plenty of opportunities to build products that bring people and technology together.',
    'My projects reflect these interests. Traverse, my final-year project, explored how flight search, hotels, itineraries and budgeting could come together in one travel assistant. PulseOS is a personal productivity dashboard designed to bring everyday tools and information into one place. I also worked on Pit Wall during a Cognizant and Aston Martin F1 ideathon, where our team explored how AI could help fans understand race strategy through an interactive race engineer. Each project has given me the opportunity to take an idea from its early stages through to something tangible.',
    'Alongside my studies, I have worked at B&Q since 2021, balancing employment with A-Levels, university and personal projects. I have also gained experience working with a startup team at FounderMatcha, collaborating with designers and developers to build Flutter interfaces from Figma designs. During the F1 ideathon, I helped lead a team of five, coordinating responsibilities, keeping development on track and presenting our work to Aston Martin F1 and Cognizant stakeholders. These experiences have taught me the importance of communication, adaptability and working towards a shared goal.',
    'I am now looking forward to the next stage of my career, where I can continue developing my technical skills, learn from experienced people and contribute to meaningful projects. I am open to graduate and junior software development roles, internships, freelance opportunities and collaborations.',
  ],

  // Each row carries a label, the matter of record itself, and the line that
  // qualifies it. There is no `icon` any more: 01 rules these as a ledger,
  // and a ledger does not have a mark in the margin of every line — the four
  // that were here were four more figures competing with the ornament the
  // chapter is actually about.
  credentials: [
    {
      label: 'Degree',
      value: 'BSc (Hons) Computer Science',
      detail: 'First Class Honours',
    },
    {
      label: 'Institution',
      value: 'University of Westminster',
      detail: '2023 – 2026',
    },
    {
      label: 'Availability',
      value: 'Open to opportunities',
      detail: 'Graduate, junior, internship, freelance',
    },
  ],

  links: {
    github: 'https://github.com/eeliya-hub',
    linkedin: 'https://www.linkedin.com/in/eeliya',
    cv: '/docs/eeliya-nayeri-cv.pdf',
  },

  // The form posts here; there is no backend of Eeliya's own.
  web3formsKey: '00278f25-2bfb-4583-801f-3c9ad4e45642',

  site: {
    origin: 'https://eeliyanayeri.com',
    verification: 'xku-436tZvunmpdLc4gHRnmXHdfJgX1_dbyJ6KcFcM0',
  },
};

// Cut out from src/assets/image.png with scripts/cutout.swift — a real alpha
// matte from Vision, not a shape mask.
export const portrait = { stem: 'portrait/eeliya-cutout', alt: 'Eeliya Nayeri' };

// Photographs of the real thing. Listed here rather than read off the
// directory, so scripts/optimise-media.mjs converts exactly what the site
// uses and an unreferenced photograph can never reach the bundle.
// Built by scripts/treat-photographs.mjs, which crops each one and holds the
// subject sharp while the room behind it goes soft. The originals are beside
// them in src/assets/personal and are never shipped.
//
// `crop` is the framing, and it is edited here rather than in the CSS or by
// re-cutting the file:
//
//   aspect - the shape of the window. Left out, it is the photograph's own
//            shape, and the whole photograph shows.
//   zoom   - how much larger than the window the photograph is held. At 1 it
//            is held at the smallest size that fills the window, so it moves
//            only on the axis the two shapes disagree about: a window wider
//            than its photograph has slack above and below, a narrower one
//            left and right. Above 1 it overhangs on both axes and moves
//            freely in any direction, at the cost of what the zoom pushes
//            out of frame. These photographs are shown far smaller than
//            their source files, so the enlargement itself costs no
//            sharpness - 1.5 on the widest plate still draws from more
//            source pixels than the screen has to show.
//   focus  - the point of the photograph that stays in the window, as
//            `x y`. '50% 50%' is the middle. A smaller first number holds
//            the left of the photograph in view and crops the right; a
//            larger one does the opposite. The second number does the same
//            top to bottom.
//
// These three numbers are the whole framing of each plate, and this is the
// only place they are set. There was a browser tool for finding them by
// dragging; it is gone, because a crop that can be nudged in the page is a
// crop nobody can be sure of. Change a value here and the page follows.
export const photographs = {
  room: {
    stem: 'personal/founder-matcha',
    // 1100 x 1100, square, so the window keeps the photograph's own shape.
    // Pushed in far enough to take the man on the near side of the table
    // back to about half, and held low enough to keep the laptop and the
    // can on the table — the things that say what the room was. The one of
    // the three whose framing never had to change.
    crop: { zoom: 1.38, focus: '84.9% 61.6%' },
    source: 'src/assets/personal/treated/founder-matcha.jpg',
    alt: 'Eeliya mid-conversation across a table, talking with his hands, in a busy daylit workspace.',
    caption: 'The part of the job that is not the code.',
  },
  graduation: {
    stem: 'personal/graduation',
    // 1536 x 1900, the tallest of the three, and the one the band is
    // composed around. Pushed well in and held high on him, which is what
    // brings him up to the size of the other two inside a frame three
    // columns wide. Set against the render and written down here; the
    // source is 1536 across and the plate is drawn at about 250, so even at
    // this zoom it is nowhere near short of pixels.
    //
    // It was opened out to 1.6 for a while, when the photographs were cut
    // as diamonds rather than framed — a lozenge is at its narrowest
    // exactly where a portrait is tallest, and the mortarboard went into
    // the two upper edges. The octagon takes only the corners, so the tight
    // crop is right again.
    crop: { zoom: 1.9, focus: '46.4% 33.8%' },
    source: 'src/assets/personal/treated/graduation.jpg',
    alt: 'Eeliya in cap and gown on graduation day, holding his degree folder, on a walkway with the London Eye on the skyline behind him.',
    caption: 'Graduation day, London.',
  },
  stage: {
    stem: 'personal/amf1',
    // 1280 x 920, shown whole. The panel, the screen behind it and the
    // stage floor are all evidence of the event, and a tighter window
    // trades one of them away for no gain. It was held at 1.35 while the
    // photographs were diamonds, because a long lozenge throws away both
    // ends of a wide frame; the octagon does not, so it is whole again.
    crop: { zoom: 1, focus: '50% 50%' },
    source: 'src/assets/personal/treated/amf1.jpg',
    alt: 'Eeliya answering a question with a microphone on stage, the screen behind the panel showing Ideathon 2026 Silverstone with the Aston Martin Aramco Formula One Team and Cognizant marks.',
    caption: 'Cognizant × Aston Martin F1 Ideathon.',
  },
};
