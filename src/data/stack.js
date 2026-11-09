// The stack, as registers of names rather than a wall of brand logos: in this
// world everything is type and rules, and a name in a ruled table is read
// faster than a tile anyway.
//
// Where a technology appears in the project register, the table says so and
// links to the entries. That count is derived from projects.js at render time
// (src/lib/stack.js), never typed here, so it cannot drift.

export const stackRegisters = [
  {
    id: 'languages',
    title: 'Languages',
    items: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Swift', 'Dart', 'PHP', 'SQL', 'HTML', 'CSS'],
  },
  {
    id: 'frameworks',
    title: 'Frameworks and platforms',
    items: [
      'React',
      'React Native',
      'Node.js',
      'Express',
      'Django',
      'Flutter',
      'SwiftUI',
      'SwiftData',
      'Expo',
      'Firebase',
      'Tailwind CSS',
      'Vite',
    ],
  },
  {
    id: 'practice',
    title: 'Practice',
    items: [
      'REST API design',
      'Database modelling',
      'JWT authentication',
      'WebSockets',
      'MVVM architecture',
      'Responsive design',
      'Accessibility to WCAG 2.2 AA',
      'CI/CD workflows',
      'Version control',
      'UI and UX systems',
    ],
  },
  {
    id: 'tools',
    title: 'Tools',
    items: ['Git', 'GitHub', 'VS Code', 'Xcode', 'Android Studio', 'Figma', 'Postman', 'Google Cloud'],
  },
  {
    id: 'working',
    title: 'Working with people',
    items: [
      'Communication',
      'Team collaboration',
      'Problem solving',
      'Critical thinking',
      'Leadership',
      'Time management',
      'Adaptability',
      'Project management',
    ],
  },
];

// Names that mean the same thing in a project's stack list and in a register.
export const stackAliases = {
  'REST API design': 'REST APIs',
  'JWT authentication': 'JWT Authentication',
  'MVVM architecture': 'MVVM',
};
