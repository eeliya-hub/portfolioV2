// Journey timeline events. `short` is the compact label shown on the device
// timeline; `title`/`detail` are shown in the left panel when an event is
// selected. `start`/`end` are decimal years (e.g. Sep 2021 = 2021.67) used to
// plot each event's duration on the Gantt-style timeline so overlapping
// chapters are visible. Set `ongoing: true` for things that are still running.
export const journeyTimeline = [
  {
    id: 'gcses',
    color: '#56d9ff',
    short: 'GCSEs',
    date: 'Sep 2018 – 2021',
    start: 2018.67,
    end: 2021.5,
    command: 'init study --gcse',
    title: 'High GCSE Achievement',
    detail:
      'Completed 11 GCSEs with strong grades, including A* (9) in Computer Science and A+ (8) in Mathematics, laying a solid foundation for future studies.',
  },
  {
    id: 'a-levels',
    color: '#a78bfa',
    short: 'A-Levels',
    date: 'Sep 2021 – Jul 2023',
    start: 2021.67,
    end: 2023.5,
    command: 'init study --a-levels',
    title: 'Completed A-Levels',
    detail:
      'Studied towards A-Levels while balancing part-time work and personal coding projects, sharpening the fundamentals for a Computer Science degree.',
  },
  {
    id: 'b-and-q',
    color: '#fbbf24',
    short: 'B&Q',
    date: 'Oct 2021 – Present',
    start: 2021.75,
    end: 2026.5,
    ongoing: true,
    command: 'work customer-facing',
    title: 'Working at B&Q',
    detail:
      'Developed practical customer-facing experience, communication, and working within a team, balancing studies and personal projects.',
  },
  {
    id: 'fujitsu-workx',
    color: '#4ade80',
    short: 'Fujitsu WorkX',
    date: 'Jul 2022',
    start: 2022.5,
    end: 2022.58,
    command: 'work fujitsu --workx',
    title: 'WorkX Placement at Fujitsu',
    detail:
      'Gained insight into the tech industry through a virtual placement at Fujitsu whilst learning about their research into quantum computing and digital development.',
  },
  {
    id: 'bsc-westminster',
    color: '#f472b6',
    short: "Bachelor's Degree",
    date: 'Sep 2023 – Jun 2026',
    start: 2023.67,
    end: 2026.42,
    command: 'init study --bachelors',
    title: 'Studied BSc Computer Science at University of Westminster',
    detail:
      'Completed a Bachelor of Science in Computer Science with First Class Honours, focusing on software development, algorithms, and data structures.',
  },
  {
    id: 'aston-ideathon',
    color: '#60a5fa',
    short: 'Aston Martin F1 Ideathon',
    date: 'Jun 2026 – Jul 2026',
    start: 2026.42,
    end: 2026.58,
    command: 'init work --aston-martin-ideathon',
    title: "Competed in Aston Martin Formula One Team's Ideathon",
    detail:
      'Collaborated with a team to develop innovative solutions for the Aston Martin F1 Team & Cognizant on how AI can be used to increase fan engagement and improve the overall fan experience.',
  },
  {
    id: 'fm',
    color: '#b4f589',
    short: 'Foundermatcha Internship',
    date: ' May 2026 - Jul 2026',
    start: 2026.33,
    end: 2026.58,
    command: 'init work --foundermatcha-internship',
    title: 'Worked as a software development intern at Foundermatcha',
    detail: 'Completed a two-month internship as primarily a UI/UX developer for a startup, contributing to the development of early-stage software features.',

  }
];
