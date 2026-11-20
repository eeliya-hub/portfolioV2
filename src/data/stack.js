// The stack, as registers that run.
//
// Each register is drawn as one band in 04, in the order given here, and each
// item carries its own mark:
//
//   logo  a stem into src/media/logos — the product's own mark, converted
//         from src/assets/logos by scripts/optimise-media.mjs. `dark: true`
//         says the mark is drawn in near-black ink and has to be lifted in
//         the night edition, where it would otherwise disappear into the
//         ground.
//   mono  two or three letters set in the display face inside the site's own
//         octagon — the fallback where there is no logo file. It is a drawn
//         mark rather than a missing image, so a register never has a hole
//         in it.
//   icon  a glyph from src/components/Icon.jsx, for everything that is a
//         practice rather than a product. A way of working has no logo, and
//         borrowing one for it would be a claim about a tool rather than a
//         description of the work.

export const stackRegisters = [
  {
    id: 'languages',
    title: 'Languages',
    items: [
      { name: 'JavaScript', logo: 'javascript' },
      { name: 'TypeScript', mono: 'TS' },
      { name: 'Python', logo: 'python' },
      { name: 'Java', logo: 'java' },
      { name: 'Swift', logo: 'swift' },
      { name: 'Dart', logo: 'dart' },
      { name: 'PHP', logo: 'php' },
      { name: 'SQL', logo: 'sql' },
      { name: 'HTML', logo: 'html5' },
      { name: 'CSS', logo: 'css3' },
    ],
  },
  {
    id: 'frameworks',
    title: 'Frameworks and platforms',
    items: [
      { name: 'React', logo: 'react' },
      { name: 'React Native', logo: 'react' },
      { name: 'Node.js', logo: 'nodejs' },
      { name: 'Express', mono: 'EX' },
      { name: 'Django', logo: 'django' },
      { name: 'Flutter', logo: 'flutter' },
      { name: 'SwiftUI', logo: 'swiftui' },
      { name: 'SwiftData', mono: 'SD' },
      { name: 'Expo', mono: 'XP' },
      { name: 'Firebase', logo: 'firebase' },
      { name: 'Tailwind CSS', logo: 'tailwind' },
      { name: 'Vite', logo: 'vite' },
    ],
  },
  {
    id: 'practice',
    title: 'Practice',
    items: [
      { name: 'REST API design', icon: 'route' },
      { name: 'Database modelling', icon: 'database' },
      { name: 'JWT authentication', icon: 'key' },
      { name: 'WebSockets', icon: 'socket' },
      { name: 'MVVM architecture', icon: 'layers' },
      { name: 'Responsive design', icon: 'responsive' },
      { name: 'Accessibility to WCAG 2.2 AA', icon: 'access' },
      { name: 'CI/CD workflows', icon: 'cycle' },
      { name: 'Version control', icon: 'branch' },
      { name: 'UI and UX systems', icon: 'grid' },
    ],
  },
  {
    id: 'tools',
    title: 'Tools',
    items: [
      { name: 'Git', logo: 'git' },
      { name: 'GitHub', logo: 'github', dark: true },
      { name: 'VS Code', logo: 'vscode' },
      { name: 'Xcode', logo: 'xcode' },
      { name: 'Android Studio', logo: 'androidstudio' },
      { name: 'Figma', logo: 'figma' },
      { name: 'Postman', logo: 'postman' },
      { name: 'Google Cloud', logo: 'googlecloud' },
    ],
  },
  {
    id: 'working',
    title: 'Working with people',
    items: [
      { name: 'Communication', icon: 'speak' },
      { name: 'Team collaboration', icon: 'team' },
      { name: 'Problem solving', icon: 'solve' },
      { name: 'Critical thinking', icon: 'think' },
      { name: 'Leadership', icon: 'lead' },
      { name: 'Time management', icon: 'clock' },
      { name: 'Adaptability', icon: 'adapt' },
      { name: 'Project management', icon: 'board' },
    ],
  },
];

// Every logo stem the registers reference, paired with its source file in
// src/assets/logos. Read by scripts/optimise-media.mjs, which converts only
// what is listed here — so an unused logo can never reach the bundle, and a
// referenced one can never be silently missing.
export const logoSources = {
  javascript: 'javascript.png',
  python: 'python.png',
  java: 'java.png',
  swift: 'swift.png',
  dart: 'dart.png',
  php: 'PHP-logo.svg.png',
  sql: 'sql.png',
  // The shields alone. Both files carried their name above the shield in
  // black — invisible on lacquer, so the shield read as sitting low and
  // small beside every other mark. Cut by row, from the first row of
  // coloured shield pixels, and trimmed; both come out at 0.88.
  html5: 'html5-shield.png',
  css3: 'css3-shield.png',
  react: 'react.png',
  nodejs: 'nodejs.png',
  django: 'django.png',
  flutter: 'flutter.png',
  swiftui: 'swiftui.png',
  firebase: 'firebase.png',
  tailwind: 'tailwind.png',
  vite: 'vite.png',
  git: 'git.png',
  github: 'github.png',
  // Not in a register: the mark beside LinkedIn in 05. Derived from the
  // brand's own square, with the 'in' knocked out to transparency, so it
  // can be drawn as a mask in whatever ink the band it sits on takes.
  linkedin: 'linkedin-mark.png',
  vscode: 'vscode.png',
  xcode: 'xcode.png',
  androidstudio: 'Android_Studio_Logo_(2023).svg.png',
  figma: 'figma.png',
  postman: 'postman.png',
  googlecloud: 'google-cloud.png',
};
