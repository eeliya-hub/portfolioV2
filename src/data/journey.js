// The chronology, oldest first. Rendered twice by 03: as a thread with a knot
// at the date each chapter began, and as the record that thread folds into.
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
// `from` is the decimal year the chapter began, and it is the only thing that
// places the entry on the thread. `to` is no longer drawn — spans made the
// chapter a Gantt chart nobody asked for — and is kept only to work out the
// last year the chronology covers; `to: null` means it is still running. The
// span a reader actually reads is `period`, in words, in the record.

export const chronology = [
  {
    id: 'gcses',
    kind: 'education',
    period: 'Sep 2018 – Jul 2021',
    from: 2018.67,
    to: 2021.5,
    role: 'GCSEs',
    org: 'The North School',
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
      'Customer-facing retail work, held continuously alongside A-Levels, the degree and every project on this site. Worked multiple roles across two stores, dealing with customer complaints, outbound delivery logistics, and shelf/aisle layout and replenishment.',
  },
  {
    id: 'a-levels',
    kind: 'education',
    period: 'Sep 2021 – Jul 2023',
    from: 2021.67,
    to: 2023.5,
    role: 'A-Levels',
    org: 'The Norton Knatchbull School, Kent',
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
      'Worked as a frontend developer, alongside the lead developer and founder whilst collaborating with the UI/UX designer and backend developer to implement responsive Flutter interfaces from Figma designs and integrate them with backend services. Applied industry practices including design handoff, component-based UI development and version-controlled collaborative workflows, and gained a practical understanding of how a software product is structured and delivered.',
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
      'Helped lead a five-person team in a 2026 Cognizant × Aston Martin F1 ideathon, developing Pit Wall, an AI-driven app concept to improve fan engagement around the 2026 F1 regulations. Owned project planning and delivery, and presented the solution to a panel of AMF1 stakeholders and engineers.',
  },
];
