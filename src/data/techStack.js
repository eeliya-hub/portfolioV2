import cssLogo from '../assets/logos/css3.png';
import dartLogo from '../assets/logos/dart.png';
import djangoLogo from '../assets/logos/django.png';
import figmaLogo from '../assets/logos/figma.png';
import firebaseLogo from '../assets/logos/firebase.png';
import flutterLogo from '../assets/logos/flutter.png';
import gitLogo from '../assets/logos/git.png';
import googleCloudLogo from '../assets/logos/google-cloud.png';
import githubLogo from '../assets/logos/github.png';
import htmlLogo from '../assets/logos/html5.png';
import javaLogo from '../assets/logos/java.png';
import jsLogo from '../assets/logos/javascript.png';
import nodeLogo from '../assets/logos/nodejs.png';
import postmanLogo from '../assets/logos/postman.png';
import pythonLogo from '../assets/logos/python.png';
import reactLogo from '../assets/logos/react.png';
import sqlLogo from '../assets/logos/sql.png';
import swiftLogo from '../assets/logos/swift.png';
import swiftuiLogo from '../assets/logos/swiftui.png';
import tailwindLogo from '../assets/logos/tailwind.png';
import viteLogo from '../assets/logos/vite.png';
import vscodeLogo from '../assets/logos/vscode.png';
import xcodeLogo from '../assets/logos/xcode.png';
import phpLogo from '../assets/logos/PHP-logo.svg.png';
import androidStudioLogo from '../assets/logos/Android_Studio_Logo_(2023).svg.png';

export const techCategories = [
  {
    id: 'languages',
    title: 'Languages',
    icon: 'code',
    description: 'Core programming and scripting languages.',
    url: 'stack.eeliya.dev/languages',
    items: ['Python', 'Java', 'JavaScript', 'Dart', 'SQL', 'Swift', 'PHP', 'HTML', 'CSS'],
  },
  {
    id: 'frameworks',
    title: 'Frameworks & Stacks',
    icon: 'layers',
    description: 'Libraries, frameworks, and product stacks I build with.',
    url: 'stack.eeliya.dev/frameworks',
    items: ['React', 'Node.js', 'Express', 'Django', 'Flutter', 'SwiftUI', 'Tailwind CSS', 'Vite', 'Firebase', 'REST APIs'],
  },
  {
    id: 'software',
    title: 'Software',
    icon: 'monitorCog',
    description: 'Tools and platforms I use daily.',
    url: 'stack.eeliya.dev/software',
    items: ['VS Code', 'Git', 'GitHub', 'Figma', 'Postman', 'Google Cloud', 'Xcode', 'Android Studio'],
  },
  {
    id: 'capabilities',
    title: 'Tech Capabilities',
    icon: 'braces',
    description: 'Technical skills and engineering patterns.',
    url: 'stack.eeliya.dev/capabilities',
    items: [
      'Responsive Design',
      'API Design',
      'MVVM Architecture',
      'Database Modelling',
      'Motion & Animation',
      'CI/CD Workflows',
      'Version Control',
      'UI/UX Systems',
    ],
  },
  {
    id: 'personal',
    title: 'Personal Skills',
    icon: 'users',
    description: 'Soft skills and professional qualities.',
    url: 'stack.eeliya.dev/personal-skills',
    items: [
      'Leadership',
      'Communication',
      'Problem Solving',
      'Team Collaboration',
      'Time Management',
      'Adaptability',
      'Critical Thinking',
      'Project Management',
    ],
  },
];

export const techLogoMap = {
  'Amadeus API': postmanLogo,
  CSS: cssLogo,
  Dart: dartLogo,
  Django: djangoLogo,
  Figma: figmaLogo,
  Firebase: firebaseLogo,
  Flutter: flutterLogo,
  Git: gitLogo,
  'Google Cloud': googleCloudLogo,
  GitHub: githubLogo,
  HTML: htmlLogo,
  Java: javaLogo,
  JavaScript: jsLogo,
  'Node.js': nodeLogo,
  'Node/Express': nodeLogo,
  Postman: postmanLogo,
  Python: pythonLogo,
  React: reactLogo,
  'REST APIs': postmanLogo,
  SQL: sqlLogo,
  Swift: swiftLogo,
  'Swift/iOS': swiftLogo,
  SwiftUI: swiftuiLogo,
  Tailwind: tailwindLogo,
  'Tailwind CSS': tailwindLogo,
  Vite: viteLogo,
  'VS Code': vscodeLogo,
  Xcode: xcodeLogo,
  PHP: phpLogo,
  'Android Studio': androidStudioLogo,
};

export const stackIconMap = {
  Adaptability: 'refresh',
  'API Design': 'share',
  'CI/CD Workflows': 'rocket',
  Communication: 'message',
  'Critical Thinking': 'brain',
  'Database Modelling': 'database',
  Leadership: 'crown',
  'Motion & Animation': 'sparkles',
  'MVVM Architecture': 'layers',
  'Problem Solving': 'lightbulb',
  'Project Management': 'clipboard',
  'Responsive Design': 'devices',
  'Team Collaboration': 'users',
  'Time Management': 'clock',
  'UI/UX Systems': 'palette',
  'Version Control': 'gitBranch',
};
