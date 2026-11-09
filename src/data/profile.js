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
    'I build finished products — mobile, web and backend — and each one here is open to inspect: a live deployment, a public repository, or a written case study.',

  // The about page's opening line. Every clause of it restates bio[0] and
  // the credentials below — it says nothing the longer copy does not
  // already say.
  //
  // One sentence, not an array of lines: how many lines it takes is set by
  // how wide it is allowed to run, which is `--blurb` on `.about` in
  // src/styles/chapters.css. Widen that and it takes fewer lines; narrow it
  // and it takes more.
  blurb:
    'First Class Computer Science graduate, working across mobile, web and backend — most interested in where a system stops being a diagram and starts being something a person can use.',

  bio: [
    'I am a software developer and a First Class Computer Science graduate of the University of Westminster. I work across mobile, web and backend, and I care most about the part of the job where a system stops being a diagram and starts being something a person can use.',
    'The work keeps returning to three subjects: AI, travel technology and aviation. They sit where systems, people and useful products meet, which is the only place I have found where the engineering and the reason for it are the same problem.',
    'I am open to graduate roles, internships, junior positions, freelance builds and collaboration.',
  ],

  // `icon` names a glyph in src/components/Icon.jsx. It lives here so a row
  // and its mark cannot drift apart.
  credentials: [
    {
      label: 'Degree',
      value: 'BSc (Hons) Computer Science',
      detail: 'First Class Honours',
      icon: 'degree',
    },
    {
      label: 'Institution',
      value: 'University of Westminster',
      detail: '2023 – 2026',
      icon: 'institution',
    },
    {
      label: 'Availability',
      value: 'Open to opportunities',
      detail: 'Graduate, junior, internship, freelance',
      icon: 'open',
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
    // can on the table — the things that say what the room was. Set in the
    // browser and written down here.
    crop: { zoom: 1.38, focus: '84.9% 61.6%' },
    source: 'src/assets/personal/treated/founder-matcha.jpg',
    alt: 'Eeliya mid-conversation across a table, talking with his hands, in a busy daylit workspace.',
    caption: 'The part of the job that is not the code.',
  },
  graduation: {
    stem: 'personal/graduation',
    // 1536 x 1900, the tallest of the three. Pushed well in and held high
    // on him, which is what brings him up to the size of the other two
    // inside a frame three columns wide. Set in the browser and written
    // down here; the source is 1536 across and the plate is drawn at about
    // 530, so even at this zoom it is not short of pixels.
    crop: { zoom: 1.9, focus: '46.4% 33.8%' },
    source: 'src/assets/personal/treated/graduation.jpg',
    alt: 'Eeliya in cap and gown on graduation day, holding his degree folder, on a walkway with the London Eye on the skyline behind him.',
    caption: 'Graduation day, London.',
  },
  stage: {
    stem: 'personal/amf1',
    // 1280 x 920, shown whole. The panel, the screen behind it and the
    // stage floor are all evidence of the event, and a tighter window
    // trades one of them away for no gain.
    crop: { zoom: 1, focus: '50% 50%' },
    source: 'src/assets/personal/treated/amf1.jpg',
    alt: 'Eeliya answering a question with a microphone on stage, the screen behind the panel showing Ideathon 2026 Silverstone with the Aston Martin Aramco Formula One Team and Cognizant marks.',
    caption: 'Cognizant × Aston Martin F1 Ideathon.',
  },
};
