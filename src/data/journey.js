// The chronology, oldest first. Rendered as a loom: years across, each
// chapter of the life a weft bar, grouped as the CV groups them.
//
// `role` is the job title or the qualification; `org` is the company or the
// institution. Both are taken from the CV published with this site
// (public/docs/eeliya-nayeri-cv.pdf) — the job titles were never in this file
// before, and the timeline asked the reader to work them out from a sentence.
// Where the CV does not say, `org` is left out rather than guessed: it names
// the two schools for GCSEs and A-Levels together, without saying which was
// which.
//
// `kind` is the CV section the entry sits under — Education or Experience.
//
// `from` and `to` are decimal years used only to draw each chapter's span, so
// overlapping chapters (working while studying) stay visible. `to: null`
// means it is still running.

export const chronology = [
  {
    id: 'gcses',
    kind: 'education',
    period: 'Sep 2018 – Jul 2021',
    from: 2018.67,
    to: 2021.5,
    role: 'GCSEs',
    detail:
      'Eleven GCSEs, including a grade 9 in Computer Science and a grade 8 in Mathematics.',
  },
  {
    id: 'b-and-q',
    kind: 'experience',
    period: 'Oct 2021 – present',
    from: 2021.75,
    to: null,
    role: 'Customer Advisor',
    org: 'B&Q',
    detail:
      'Customer-facing retail work, held continuously alongside A-Levels, the degree and every project on this site. Six years of explaining things to people who did not ask for a technical answer.',
  },
  {
    id: 'a-levels',
    kind: 'education',
    period: 'Sep 2021 – Jul 2023',
    from: 2021.67,
    to: 2023.5,
    role: 'A-Levels',
    detail:
      'Studied towards A-Levels while working part-time and building personal projects.',
  },
  {
    id: 'fujitsu',
    kind: 'experience',
    period: 'Jul 2022',
    from: 2022.5,
    to: 2022.58,
    role: 'WorkX placement',
    org: 'Fujitsu',
    detail:
      'A virtual placement covering Fujitsu’s research into quantum computing and digital development.',
  },
  {
    id: 'westminster',
    kind: 'education',
    period: 'Sep 2023 – Jun 2026',
    from: 2023.67,
    to: 2026.42,
    role: 'BSc (Hons) Computer Science',
    org: 'University of Westminster',
    detail:
      'First Class Honours, focused on software development, algorithms and data structures. Traverse was the final year project; Sky Health came from a real client brief set by Sky UK.',
  },
  {
    id: 'foundermatcha',
    kind: 'experience',
    period: 'May 2026 – Jul 2026',
    from: 2026.33,
    to: 2026.58,
    role: 'Software Development Intern',
    org: 'Foundermatcha',
    detail:
      'Two months at a startup as primarily a UI/UX developer, building early-stage product features.',
  },
  {
    id: 'ideathon',
    kind: 'experience',
    period: 'Jun 2026 – Jul 2026',
    from: 2026.42,
    to: 2026.58,
    role: 'Ideathon team member',
    org: 'Cognizant × Aston Martin F1',
    detail:
      'Worked in a team on how AI could improve the Formula One fan experience for Aston Martin and Cognizant. Pit Wall is what came out of it.',
  },
];

// The span the chart is drawn across.
export const chronologyRange = { from: 2018.4, to: 2026.9 };

// The two sections of the CV, in the order it gives them.
export const chronologyKinds = [
  { kind: 'education', title: 'Education' },
  { kind: 'experience', title: 'Experience' },
];
