import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import googleLogoMark from '../assets/Google-logo.png';
import westminsterLogo from '../assets/UoW.jpeg';
import homeWallpaper from '../assets/image.png';
import traversePreview from '../assets/projects/traverse/traverse-thumb.png';
import weatherPreview from '../assets/projects/weather/weather-thumb.png';
import { itemVariants, quickEase, screenVariants, smoothEase } from '../lib/motion.js';

const googlePageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2, ease: smoothEase } },
  exit: { opacity: 0, transition: { duration: 0.12, ease: [0.4, 0, 1, 1] } },
};

const fakeWebPageVariants = {
  initial: { opacity: 1, scale: 0.992 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.22, ease: smoothEase } },
  exit: { opacity: 0, transition: { duration: 0.1, ease: quickEase } },
};

const dockItems = [
  { label: 'About', icon: 'user', href: '#about', tone: 'dock-cyan' },
  { label: 'Projects', icon: 'grid', href: '#projects', tone: 'dock-violet' },
  { label: 'Tech Stack', display: 'Tech', icon: 'code', href: '#tech-stack', tone: 'dock-green' },
  { label: 'Journey', icon: 'route', href: '#journey', tone: 'dock-amber' },
  { label: 'Contact', icon: 'mail', href: '#contact', tone: 'dock-rose' },
];

const mobileProjects = [
  {
    name: 'Traverse',
    meta: 'Mobile travel planner',
    description: 'A Flutter travel planner for flights, hotels, itineraries, budgets, and AI-assisted planning.',
    stack: ['Flutter', 'Firebase', 'Amadeus'],
    accent: 'dock-cyan',
    image: traversePreview,
  },
  {
    name: 'Weather App',
    meta: 'Native iOS weather',
    description: 'A SwiftUI dashboard for live weather, forecasts, maps, nearby places, and visited locations.',
    stack: ['SwiftUI', 'MapKit', 'OpenWeather'],
    accent: 'dock-violet',
    image: weatherPreview,
  },
];

const stackItems = ['React', 'Vite', 'Tailwind', 'APIs', 'Node', 'Git'];

const googleSearchQuery = 'who is Eeliya Nayeri?';

const googleResults = [
  {
    type: 'detail',
    icon: 'profile',
    theme: 'profile',
    title: 'My background',
    url: 'eeliya-profile.test/background',
    snippet: 'Born in Iran, raised in the United Kingdom, and shaped by adaptability, detail, and practical software work.',
    eyebrow: 'Profile',
    detailTitle: 'Personal Background',
    intro:
      'Born in Iran but raised in the United Kingdom, my passion for software development was sparked by a desire to create and understand the digital world around me. Moving to the UK at a young age fuelled my natural ability to adapt and learn quickly, which has been a cornerstone of my journey in tech. I thrive on diving deep into projects, iterating on details, and pushing myself to create work that feels polished and credible.',
    cards: [
      'I am very detail-oriented and have a strong desire to create modern and user-friendly experiences.',
      'Through my experiences in retail and group projects at university level, I have developed strong communication and teamwork skills, and I am always eager to learn from others and contribute my own ideas.',
      'From a young age, I have always taken leadership roles in group settings and have a natural ability to guide, organise, and lead teams.',
    ],
    chips: ['Adaptable', 'Detail-oriented', 'Teamwork', 'Leadership'],
  },
  {
    type: 'detail',
    icon: 'degree',
    theme: 'degree',
    title: 'Degree and Qualification',
    url: 'westminster-degree.example/computer-science-bsc',
    snippet: 'First Class Honours graduate from the University of Westminster with a Computer Science BSc Honours degree.',
    logo: westminsterLogo,
    eyebrow: 'Qualification',
    detailTitle: 'Degree and Qualification',
    intro:
      '',
    modules: [
      'Applied Artificial Intelligence',
      'Mobile Native Application Development',
      'Server Side Web Programming',
      'Machine Learning and Data Mining',
    ],
    cards: [
      'Built confidence across frontend, backend, data, and mobile development rather than staying in a single lane.',
      'University work strengthened collaboration, structured problem-solving, and the habit of turning technical ideas into complete coursework builds.',
      'The course sharpened my interest in intelligent systems and the practical side of building usable software around them.',
    ],
    chips: ['BSc Honours', 'First Class', 'Software Engineering', 'Systems'],
  },
  {
    type: 'detail',
    icon: 'interests',
    theme: 'interests',
    title: 'Personal interests',
    url: 'interests.eeliya.test/travel-ai-aviation',
    snippet: 'Travel, aviation, football, geopolitics, AI, and design often intersect with the software I build.',
    eyebrow: 'Interests',
    detailTitle: 'Passions & Interests',
    intro:
      'Outside software, I tend to be drawn to subjects with movement, strategy, and personality. Travel, aviation, football, geopolitics, AI, and design all feed the way I think about products, interfaces, and the kinds of ideas I naturally want to build.',
    chips: ['Trip planning', 'Aviation', 'Football', 'Geopolitics', 'AI tools', 'Interface design'],
    highlights: [
      {
        icon: 'plane',
        title: 'Travel & aviation',
        body: 'I enjoy products around routes, airports, movement, and logistics because they combine real-world structure with useful digital experiences.',
      },
      {
        icon: 'football',
        title: 'Football & sport',
        body: 'Sport keeps me interested in momentum, performance, statistics, and competitive systems, which often translates well into product thinking.',
      },
      {
        icon: 'globe',
        title: 'Geopolitics',
        body: 'I like understanding how incentives, pressure, and large-scale systems interact. It pushes me to think beyond isolated features.',
      },
      {
        icon: 'spark',
        title: 'AI & design',
        body: 'I pay close attention to tools that make software feel smarter, cleaner, and more intuitive without losing usefulness.',
      },
    ],
    cards: [
      'A lot of my favourite project ideas sit at the intersection of travel, data, and interface design because they feel grounded and genuinely useful.',
      'I also enjoy topics with strong visual identity or strategic depth, since they usually make the work more engaging and help me bring more personality into what I build.',
    ],
  },
  {
    type: 'detail',
    icon: 'skills',
    theme: 'skills',
    title: 'Strengths and Skills',
    url: 'skills.eeliya.test/full-stack-toolkit',
    snippet: 'Full-stack development, mobile apps, APIs, UI detail, and clear problem-solving.',
    eyebrow: 'Strengths',
    detailTitle: 'Skills & Attributes',
    intro:
      'My edge is usually a mix of product instinct, aesthetic sensitivity, and technical adaptability. I care about architecture and scalability, but my primary focus is on creating user-friendly and visually appealing experiences.',
    chips: ['Product instinct', 'UI polish', 'Adaptability', 'System thinking'],
    cards: [
      'Shaping both the product feel and the implementation structure.',
      'Modern tooling, fast iteration, and a clear quality bar.',
    ],
    toolTags: ['React', 'Vite', 'Tailwind', 'Flutter', 'SwiftUI', 'Firebase', 'Node.js', 'Django', 'APIs'],
  },
  {
    type: 'link',
    icon: 'projects',
    theme: 'projects',
    title: 'Projects - Eeliya Nayeri Portfolio',
    url: 'projects.eeliya.test/showcase',
    href: '#projects',
    snippet: 'Mobile and desktop projects including Traverse, Prem Predictor, weather, finance, SkyHealth, and alumni work.',
    eyebrow: 'Work',
    detailTitle: 'Projects',
    intro:
      'Projects are where I turn ideas into working products. I like building complete flows, then tightening the interface, data, and edge cases until the result feels usable.',
    cards: [
      'Traverse combines travel search, itinerary planning, budgeting, and AI-assisted trip support.',
      'Prem Predictor focuses on prediction leagues, scoring, local persistence, and report generation.',
      'Other builds include weather, finance, SkyHealth, and alumni API work.',
    ],
    chips: ['Mobile apps', 'Desktop apps', 'APIs', 'Reports', 'AI features'],
  },
  {
    type: 'link',
    icon: 'stack',
    theme: 'stack',
    title: 'Tech Stack - Eeliya Nayeri Portfolio',
    url: 'toolkit.eeliya.test/tech-stack',
    href: '#tech-stack',
    snippet: 'A practical stack across React, Vite, Tailwind, Flutter, SwiftUI, Firebase, Node, Django, APIs, and tooling.',
    eyebrow: 'Toolkit',
    detailTitle: 'Tech Stack',
    intro:
      'My toolkit is built around practical delivery: fast interfaces, mobile prototypes, backend routes, database work, and reliable API integrations.',
    cards: [
      'Frontend: React, Vite, Tailwind, HTML, CSS, and JavaScript.',
      'Mobile: Flutter, Dart, SwiftUI, and Xcode.',
      'Backend and data: Node.js, Express, Django, Firebase, SQL, and third-party APIs.',
    ],
    chips: ['React', 'Flutter', 'Firebase', 'Node.js', 'Django', 'SQL', 'APIs'],
  },
  {
    type: 'link',
    icon: 'journey',
    theme: 'journey',
    title: 'Journey - Eeliya Nayeri Portfolio',
    url: 'journey.eeliya.test/timeline',
    href: '#journey',
    snippet: 'A quick route through study, customer-facing work, product practice, and the projects that shaped the portfolio.',
    eyebrow: 'Timeline',
    detailTitle: 'Journey',
    intro:
      'My journey combines university, customer-facing work, independent projects, and a steady focus on building software that feels useful in real situations.',
    cards: [
      'Retail work at B&Q strengthened communication, patience, and user empathy.',
      'University projects built the technical foundation and gave me space to collaborate in teams.',
      'Independent builds helped me sharpen product judgement, interface quality, and delivery habits.',
    ],
    chips: ['Study', 'Retail', 'Teamwork', 'Independent builds', 'Growth'],
  },
];

const contactDetails = [
  { label: 'Email', value: 'eeliya@example.com', href: 'mailto:eeliya@example.com' },
  { label: 'LinkedIn', value: 'linkedin.com/in/eeliya-nayeri', href: 'https://linkedin.com/in/eeliya-nayeri' },
  { label: 'GitHub', value: 'github.com/eeliyanayeri', href: 'https://github.com/eeliyanayeri' },
  { label: 'Location', value: 'United Kingdom' },
  { label: 'Role', value: 'Computer Science Graduate / Software Developer' },
];

function useIsCompact() {
  const getInitial = () => (typeof window === 'undefined' ? false : window.matchMedia('(max-width: 1023px)').matches);
  const [isCompact, setIsCompact] = useState(getInitial);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1023px)');
    const sync = () => setIsCompact(media.matches);

    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  return isCompact;
}

function useProjectBoundaryOffset(enabled) {
  const stageRef = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setOffset(0);
      return undefined;
    }

    let frame = 0;

    const sync = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const projectSection = document.getElementById('projects');
        const stage = stageRef.current;

        if (!projectSection || !stage) {
          setOffset(0);
          return;
        }

        const projectBottom = projectSection.getBoundingClientRect().bottom;
        const phoneHeight = stage.getBoundingClientRect().height;
        const lockedPhoneBottom = window.innerHeight / 2 + phoneHeight / 2;
        const nextOffset = Math.min(0, projectBottom - lockedPhoneBottom);

        setOffset((current) => (Math.abs(current - nextOffset) < 0.5 ? current : nextOffset));
      });
    };

    sync();
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [enabled]);

  return [stageRef, offset];
}

function getStageVariants(isCompact) {
  if (isCompact) {
    return {
      home: { left: '50%', top: '4.4rem', x: '-50%', y: '0%', scale: 1, opacity: 1 },
      about: { left: '50%', top: '4.4rem', x: '-50%', y: '0%', scale: 1, opacity: 1 },
      projects: { left: '50%', top: '4.4rem', x: '-50%', y: '0%', scale: 1, opacity: 1 },
      'projects-desktop': { left: '50%', top: '4.4rem', x: '-50%', y: '0%', scale: 1, opacity: 0 },
      'tech-stack': { left: '50%', top: '4.4rem', x: '-50%', y: '0%', scale: 0.78, opacity: 0.78 },
      journey: { left: '50%', top: '4.4rem', x: '-50%', y: '0%', scale: 0.72, opacity: 0.72 },
      contact: { left: '50%', top: '4.4rem', x: '-50%', y: '0%', scale: 1, opacity: 1 },
    };
  }

  return {
    home: { left: '27%', top: '50%', x: '-50%', y: '-50%', scale: 0.88, opacity: 1 },
    about: { left: '76%', top: '50%', x: '-50%', y: '-50%', scale: 0.9, opacity: 1 },
    projects: { left: '50%', top: '50%', x: '-50%', y: '-50%', scale: 0.9, opacity: 1 },
    'projects-desktop': { left: '50%', top: '50%', x: '-50%', y: '-50%', scale: 0.9, opacity: 0 },
    'tech-stack': { left: '76%', top: '50%', x: '-50%', y: '-50%', scale: 0.72, opacity: 0.86 },
    journey: { left: '78%', top: '54%', x: '-50%', y: '-50%', scale: 0.62, opacity: 0.72 },
    contact: { left: '76%', top: '50%', x: '-50%', y: '-50%', scale: 0.90, opacity: 1 },
  };
}

function WallpaperFace() {
  return (
    <div className="iphone-wallpaper" role="img" aria-label="Eeliya Nayeri wallpaper">
      <img className="home-wallpaper-image" src={homeWallpaper} alt="" aria-hidden="true" />
    </div>
  );
}

function HomeScreen() {
  return (
    <motion.div
      key="home"
      className="phone-screen-layer"
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <WallpaperFace />
      <motion.nav className="phone-dock" aria-label="Phone dock navigation" variants={itemVariants}>
        {dockItems.map((item) => (
          <a key={item.href} href={item.href} className="dock-app" aria-label={item.label}>
            <span className={`dock-icon ${item.tone}`} aria-hidden="true">
              <DockIcon name={item.icon} />
            </span>
            <span className="dock-label">{item.display ?? item.label}</span>
          </a>
        ))}
      </motion.nav>
    </motion.div>
  );
}

function DockIcon({ name }) {
  const icons = {
    user: (
      <>
        <path d="M12 12.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" />
        <path d="M5.8 19.2c.7-3 3-4.6 6.2-4.6s5.5 1.6 6.2 4.6" />
      </>
    ),
    grid: (
      <>
        <path d="M5.2 5.2h5.1v5.1H5.2z" />
        <path d="M13.7 5.2h5.1v5.1h-5.1z" />
        <path d="M5.2 13.7h5.1v5.1H5.2z" />
        <path d="M13.7 13.7h5.1v5.1h-5.1z" />
      </>
    ),
    code: (
      <>
        <path d="m9 7-4 5 4 5" />
        <path d="m15 7 4 5-4 5" />
        <path d="m13 5-2 14" />
      </>
    ),
    route: (
      <>
        <path d="M6.5 7.5a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z" />
        <path d="M17.5 20.9a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z" />
        <path d="M6.5 7.5v2.1c0 1.5 1.2 2.7 2.7 2.7h5.6c1.5 0 2.7 1.2 2.7 2.7v1.5" />
      </>
    ),
    mail: (
      <>
        <path d="M4.6 7.3h14.8v9.4H4.6z" />
        <path d="m5.2 7.8 6.8 5.1 6.8-5.1" />
      </>
    ),
  };

  return (
    <svg className="dock-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

function GoogleLogo({ compact = false }) {
  return (
    <div className={`google-logo ${compact ? 'google-logo-compact' : ''}`} aria-label="Google">
      <img src={googleLogoMark} alt="" aria-hidden="true" />
    </div>
  );
}

function SearchIcon() {
  return (
    <svg className="google-search-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m20 20-4.2-4.2" />
      <circle cx="11" cy="11" r="6" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4a2.6 2.6 0 0 0-2.6 2.6v4.2a2.6 2.6 0 0 0 5.2 0V6.6A2.6 2.6 0 0 0 12 4Z" />
      <path d="M6.8 10.7a5.2 5.2 0 0 0 10.4 0" />
      <path d="M12 16v3.4" />
      <path d="M9 19.4h6" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6.7 8.2h2.1l1.1-1.7h4.2l1.1 1.7h2.1a2 2 0 0 1 2 2v6.1a2 2 0 0 1-2 2H6.7a2 2 0 0 1-2-2v-6.1a2 2 0 0 1 2-2Z" />
      <circle cx="12" cy="13.2" r="2.6" />
      <path d="M17.3 11h.01" />
    </svg>
  );
}

function CellularIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 18.5h1.8" />
      <path d="M9 16.2h1.8" />
      <path d="M13 13.8h1.8" />
      <path d="M17 11.4h1.8" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4.8 10.1a10.4 10.4 0 0 1 14.4 0" />
      <path d="M7.7 13.2a6.4 6.4 0 0 1 8.6 0" />
      <path d="M10.7 16.1a2.3 2.3 0 0 1 2.6 0" />
      <path d="M12 18.3h.01" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg viewBox="0 0 26 14" fill="none" aria-hidden="true">
      <rect x="1" y="1.5" width="20" height="11" rx="3" />
      <rect x="22.2" y="4.2" width="2.8" height="5.6" rx="1.2" />
      <rect x="3.2" y="3.7" width="13.6" height="6.6" rx="1.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function GoogleSearchActions() {
  return (
    <div className="google-search-actions" aria-hidden="true">
      <ClearIcon />
      <i />
      <MicIcon />
      <CameraIcon />
    </div>
  );
}

function GoogleResultIcon({ name }) {
  const icons = {
    profile: (
      <>
        <path d="M12 12.2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M6.3 18.3c.7-2.6 2.8-4 5.7-4s5 1.4 5.7 4" />
      </>
    ),
    degree: (
      <>
        <path d="m4.5 8.4 7.5-3.7 7.5 3.7-7.5 3.7-7.5-3.7Z" />
        <path d="M7.2 10.2v4.1c1.3 1 2.9 1.5 4.8 1.5s3.5-.5 4.8-1.5v-4.1" />
      </>
    ),
    interests: (
      <>
        <path d="M12 20s6.5-4.1 6.5-9.2A4 4 0 0 0 12 7.8a4 4 0 0 0-6.5 3c0 5.1 6.5 9.2 6.5 9.2Z" />
        <path d="m10 12.2 2-2 2 2" />
      </>
    ),
    skills: (
      <>
        <path d="m9 7-4 5 4 5" />
        <path d="m15 7 4 5-4 5" />
        <path d="m13 5-2 14" />
      </>
    ),
    plane: (
      <>
        <path d="m3.8 13.1 15.6-5.3" />
        <path d="m11.8 10.4 2.6 2.5" />
        <path d="m7.8 14.8 2.5-1.3.8 3.7 1.4-.8.1-4.1 4.9-2.4c.9-.4 1.2-1.5.7-2.2-.4-.6-1.2-.8-1.9-.6L5.1 11.2l-1.3 3.1 2.5-.8 1.5 1.3" />
      </>
    ),
    football: (
      <>
        <circle cx="12" cy="12" r="7.2" />
        <path d="m12 8.3 2.2 1.6-.8 2.6h-2.8l-.8-2.6L12 8.3Z" />
        <path d="m9.8 12.5-2.1 1.5" />
        <path d="m14.2 12.5 2.1 1.5" />
        <path d="m10.6 9.9-1.9-1.4" />
        <path d="m13.4 9.9 1.9-1.4" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="7.2" />
        <path d="M4.8 12h14.4" />
        <path d="M12 4.8c2 2.1 3 4.5 3 7.2s-1 5.1-3 7.2c-2-2.1-3-4.5-3-7.2s1-5.1 3-7.2Z" />
      </>
    ),
    spark: (
      <>
        <path d="m12 4.6 1.6 4.1 4.1 1.6-4.1 1.6-1.6 4.1-1.6-4.1-4.1-1.6 4.1-1.6L12 4.6Z" />
        <path d="m18.4 15.7.8 2 .8-2 2-.8-2-.8-.8-2-.8 2-2 .8 2 .8Z" />
      </>
    ),
    projects: (
      <>
        <path d="M5.2 5.2h5.1v5.1H5.2z" />
        <path d="M13.7 5.2h5.1v5.1h-5.1z" />
        <path d="M5.2 13.7h5.1v5.1H5.2z" />
        <path d="M13.7 13.7h5.1v5.1h-5.1z" />
      </>
    ),
    stack: (
      <>
        <path d="m12 4.5 7 4-7 4-7-4 7-4Z" />
        <path d="m5 12.2 7 4 7-4" />
        <path d="m5 16 7 4 7-4" />
      </>
    ),
    journey: (
      <>
        <path d="M6.5 7.5a2.1 2.1 0 1 0 0-4.2 2.1 2.1 0 0 0 0 4.2Z" />
        <path d="M17.5 20.7a2.1 2.1 0 1 0 0-4.2 2.1 2.1 0 0 0 0 4.2Z" />
        <path d="M6.5 7.5v2.1c0 1.5 1.2 2.7 2.7 2.7h5.6c1.5 0 2.7 1.2 2.7 2.7v1.5" />
      </>
    ),
  };

  return (
    <span className={`google-result-icon google-result-icon-${name}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        {icons[name] ?? icons.profile}
      </svg>
    </span>
  );
}

function FakeWebPage({ result }) {
  const chips = result.chips ?? [];
  const cards = result.cards ?? [];
  const highlights = result.highlights ?? [];
  const modules = result.modules ?? [];
  const toolTags = result.toolTags ?? [];
  const pageTheme = result.theme ?? result.icon;
  const detailTitle = result.detailTitle ?? result.title;
  const eyebrow = result.eyebrow ?? (result.type === 'link' ? 'Portfolio quick link' : 'Profile page');

  const renderDefaultPage = () => (
    <div className="fake-web-shell fake-web-shell-standard">
      <section className="fake-web-hero">
        <div className="fake-web-hero-icon" aria-hidden="true">
          {result.logo ? <img src={result.logo} alt="" /> : <GoogleResultIcon name={result.icon} />}
        </div>
        <div>
          <p>{eyebrow}</p>
          <h4>{detailTitle}</h4>
        </div>
      </section>
      <p className="fake-web-intro">{result.intro ?? result.snippet}</p>
      {chips.length ? (
        <div className="fake-web-tags" aria-label={`${result.title} tags`}>
          {chips.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      ) : null}
      {cards.length ? (
        <div className="fake-web-card-list">
          {cards.map((card, index) => (
            <article className="fake-web-card" key={card}>
              <span aria-hidden="true">{index + 1}</span>
              <p>{card}</p>
            </article>
          ))}
        </div>
      ) : null}
      {toolTags.length ? (
        <div className="fake-web-tool-grid" aria-label={`${result.title} tools`}>
          {toolTags.map((tool) => (
            <span key={tool}>{tool}</span>
          ))}
        </div>
      ) : null}
      {result.href ? (
        <a className="fake-web-cta" href={result.href}>
          Open {detailTitle}
        </a>
      ) : null}
    </div>
  );

  const renderProfilePage = () => (
    <div className="fake-web-shell fake-web-shell-profile">
      <section className="fake-profile-feature">
        <div className="fake-profile-orb" aria-hidden="true">
          <GoogleResultIcon name={result.icon} />
        </div>
        <h4>{detailTitle}</h4>
        <span className="fake-profile-rule" aria-hidden="true" />
        <p className="fake-web-intro">{result.intro ?? result.snippet}</p>
      </section>
      {cards.length ? (
        <div className="fake-profile-storyboard">
          {cards.map((card, index) => (
            <article className="fake-profile-panel" key={card}>
              <small>0{index + 1}</small>
              <p>{card}</p>
            </article>
          ))}
        </div>
      ) : null}
      {chips.length ? (
        <div className="fake-web-tags fake-web-tags-profile" aria-label={`${result.title} tags`}>
          {chips.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      ) : null}
    </div>
  );

  const renderDegreePage = () => (
    <div className="fake-web-shell fake-web-shell-degree">
      <section className="fake-degree-certificate">
        <div className="fake-degree-brand" aria-hidden="true">
          <span className="fake-web-logo">
            <img src={result.logo} alt="" />
          </span>
        </div>
        <span>{eyebrow}</span>
        <h4>{detailTitle}</h4>
        <p className="fake-degree-course">Computer Science BSc Honours</p>
        <p className="fake-degree-university">University of Westminster</p>
        <p className="fake-web-intro">{result.intro ?? result.snippet}</p>
      </section>
      <div className="fake-degree-stats" aria-label="Qualification summary">
        <article>
          <strong>First Class Honours</strong>
          <span>Classification</span>
        </article>
        <article>
          <strong>University of Westminster</strong>
          <span>Institution</span>
        </article>
        <article>
          <strong>BSc Honours</strong>
          <span>Degree</span>
        </article>
      </div>
      {modules.length ? (
        <section className="fake-degree-modules">
          <div className="fake-degree-section-heading">
            <span className="fake-degree-section-mark" aria-hidden="true" />
            <h5>Notable Modules</h5>
          </div>
          <div className="fake-degree-module-grid">
            {modules.map((module) => (
              <article className="fake-degree-module" key={module}>
                <span aria-hidden="true" />
                <p>{module}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
      {cards.length ? (
        <section className="fake-degree-foundation">
          <div className="fake-degree-section-heading">
            <span className="fake-degree-section-mark" aria-hidden="true" />
            <h5>What the course built</h5>
          </div>
          <div className="fake-degree-list">
          {cards.map((card) => (
            <article className="fake-degree-item" key={card}>
              <i aria-hidden="true" />
              <p>{card}</p>
            </article>
          ))}
          </div>
        </section>
      ) : null}
      {chips.length ? (
        <div className="fake-web-tags fake-web-tags-degree" aria-label={`${result.title} tags`}>
          {chips.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      ) : null}
    </div>
  );

  const renderInterestsPage = () => (
    <div className="fake-web-shell fake-web-shell-interests">
      <section className="fake-interests-hero">
        <div className="fake-interests-icons" aria-hidden="true">
          <span><GoogleResultIcon name="plane" /></span>
          <span><GoogleResultIcon name="football" /></span>
          <span><GoogleResultIcon name="globe" /></span>
          <span><GoogleResultIcon name="spark" /></span>
        </div>
        <h4>{detailTitle}</h4>
        <p className="fake-web-intro">{result.intro ?? result.snippet}</p>
      </section>
      {chips.length ? (
        <div className="fake-interests-chip-cloud" aria-label={`${result.title} interests`}>
          {chips.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      ) : null}
      {highlights.length ? (
        <div className="fake-interests-feature-grid" aria-label={`${result.title} highlights`}>
          {highlights.map((item) => (
            <article className="fake-interests-feature-card" key={item.title}>
              <div className="fake-interests-feature-head">
                <span className="fake-interests-feature-icon" aria-hidden="true">
                  <GoogleResultIcon name={item.icon} />
                </span>
                <h5>{item.title}</h5>
              </div>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      ) : null}
      {cards.length ? (
        <div className="fake-interests-journal">
          {cards.map((card) => (
            <article className="fake-interests-note" key={card}>
              <p>{card}</p>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );

  const renderSkillsPage = () => (
    <div className="fake-web-shell fake-web-shell-skills">
      <section className="fake-skills-console">
        <div className="fake-skills-console-bar" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="fake-skills-console-icon" aria-hidden="true">
          <GoogleResultIcon name={result.icon} />
        </div>
        <p>{eyebrow}</p>
        <h4>{detailTitle}</h4>
        <p className="fake-web-intro">{result.intro ?? result.snippet}</p>
      </section>
      {chips.length ? (
        <div className="fake-skills-chip-grid" aria-label={`${result.title} strengths`}>
          {chips.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      ) : null}
      {cards.length ? (
        <div className="fake-skills-note-list">
          {cards.map((card) => (
            <article className="fake-skills-note" key={card}>
              <p>{card}</p>
            </article>
          ))}
        </div>
      ) : null}
      {toolTags.length ? (
        <div className="fake-web-tool-grid fake-web-tool-grid-skills" aria-label={`${result.title} tools`}>
          {toolTags.map((tool) => (
            <span key={tool}>{tool}</span>
          ))}
        </div>
      ) : null}
    </div>
  );

  const renderPageBody = () => {
    switch (pageTheme) {
      case 'profile':
        return renderProfilePage();
      case 'degree':
        return renderDegreePage();
      case 'interests':
        return renderInterestsPage();
      case 'skills':
        return renderSkillsPage();
      default:
        return renderDefaultPage();
    }
  };

  return (
    <motion.article
      className={`fake-web-page fake-web-page-${pageTheme}`}
      key={`page-${result.title}`}
      variants={fakeWebPageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {renderPageBody()}
    </motion.article>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m15 5-7 7 7 7" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 12h.01" />
      <path d="M17 12h.01" />
      <path d="M7 12h.01" />
    </svg>
  );
}

function PageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5.5 6.5h13v10.2h-13z" />
      <path d="M8 19h8" />
    </svg>
  );
}

function ReloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18.2 9.2A6.2 6.2 0 1 0 18 15" />
      <path d="M18.2 5.8v3.4h-3.4" />
    </svg>
  );
}

function AboutGoogleScreen() {
  const [typedQuery, setTypedQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    let characterIndex = 0;
    let resultTimer = 0;

    setTypedQuery('');
    setShowResults(false);
    setSelectedResult(null);

    const typeTimer = window.setInterval(() => {
      characterIndex += 1;
      setTypedQuery(googleSearchQuery.slice(0, characterIndex));

      if (characterIndex >= googleSearchQuery.length) {
        window.clearInterval(typeTimer);
        resultTimer = window.setTimeout(() => setShowResults(true), 360);
      }
    }, 56);

    return () => {
      window.clearInterval(typeTimer);
      window.clearTimeout(resultTimer);
    };
  }, []);

  const handleBack = () => {
    if (selectedResult) {
      setSelectedResult(null);
      return;
    }

    if (showResults) {
      setShowResults(false);
      setTypedQuery(googleSearchQuery);
    }
  };

  const showSearchResults = () => {
    setSelectedResult(null);
    setTypedQuery(googleSearchQuery);
    setShowResults(true);
  };

  const showGoogleHome = () => {
    setSelectedResult(null);
    setShowResults(false);
    setTypedQuery(googleSearchQuery);
  };

  const handleResultClick = (result) => {
    if (result.href) {
      window.location.hash = result.href;
      return;
    }

    setSelectedResult(result);
  };

  return (
    <motion.div
      key="about"
      className={`phone-screen-layer app-screen google-app ${selectedResult ? 'google-app-webpage-open' : ''}`}
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <AnimatePresence mode={selectedResult ? 'sync' : 'wait'} initial={false}>
        {selectedResult ? (
          <FakeWebPage result={selectedResult} />
        ) : !showResults ? (
          <motion.div
            className="google-home-page"
            key="google-home"
            variants={googlePageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <GoogleLogo />
            <div className="google-search-pill google-search-pill-home" aria-label="Search query">
              <SearchIcon />
              <span className="google-search-entry">
                <span className="google-search-text">{typedQuery}</span>
                <span className="google-search-cursor" aria-hidden="true" />
              </span>
              <GoogleSearchActions />
            </div>
            <div className="google-home-actions">
              <button type="button" onClick={showSearchResults}>
                Google Search
              </button>
              <button type="button" onClick={showSearchResults}>
                {`I'm Feeling Lucky`}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="google-results-page"
            key="google-results"
            variants={googlePageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="google-results-header">
              <button type="button" className="google-logo-button" onClick={showGoogleHome} aria-label="Back to Google home">
                <GoogleLogo />
              </button>
              <div className="google-search-pill google-search-pill-results" aria-label="Search query">
                <SearchIcon />
                <span className="google-search-text">{googleSearchQuery}</span>
                <GoogleSearchActions />
              </div>
            </div>
            <nav className="google-tabs" aria-label="Google search filters">
              <span>All</span>
              <span>Images</span>
              <span>News</span>
              <span>Videos</span>
              <span>Maps</span>
              <span>Shopping</span>
              <span>More</span>
            </nav>
            <p className="google-result-count">About {googleResults.length} results (0.32 seconds)</p>
            <div className="google-results-list">
              {googleResults.map((result) => (
                  <button
                    type="button"
                    className={`google-result ${result.href ? 'google-result-link' : ''}`}
                    key={result.title}
                    onClick={() => handleResultClick(result)}
                  >
                    <span className="google-result-url">{result.url}</span>
                    <span className="google-result-title">{result.title}</span>
                    <span className="google-result-snippet">{result.snippet}</span>
                  </button>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className={`google-bottom-bar ${showResults && !selectedResult ? 'google-bottom-bar-results' : ''}`}
        variants={itemVariants}
      >
        <button type="button" aria-label="Back" onClick={handleBack}>
          <BackIcon />
        </button>
        <div className="google-bottom-search" aria-label="Safari address and search bar">
          <PageIcon />
          <span>google.com</span>
          <ReloadIcon />
        </div>
        <button type="button" aria-label="More">
          <MoreIcon />
        </button>
      </motion.div>

    </motion.div>
  );
}

function ProjectsScreen({ mobileActiveIndex, setMobileActiveIndex }) {
  const [internalIndex, setInternalIndex] = useState(0);
  const activeIndex = mobileActiveIndex !== undefined ? mobileActiveIndex : internalIndex;
  const setActiveIndex = (i) => {
    if (typeof setMobileActiveIndex === 'function') setMobileActiveIndex(i);
    else setInternalIndex(i);
  };
  const activeProject = mobileProjects[activeIndex];
  const showPrevious = () => setActiveIndex((activeIndex - 1 + mobileProjects.length) % mobileProjects.length);
  const showNext = () => setActiveIndex((activeIndex + 1) % mobileProjects.length);

  return (
    <motion.div
      key="projects"
      className="phone-screen-layer app-screen projects-app"
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div className="app-topbar" variants={itemVariants}>
        <p>Mobile</p>
        <span>{activeIndex + 1}/{mobileProjects.length}</span>
      </motion.div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.article
          className="phone-project-detail"
          key={activeProject.name}
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <ProjectPhonePreview accent={activeProject.accent} image={activeProject.image} name={activeProject.name} />
          <p className="device-kicker">{activeProject.meta}</p>
          <h3>{activeProject.name}</h3>
          <p>{activeProject.description}</p>
          <div className="device-stack" aria-label={`${activeProject.name} tech stack`}>
            {activeProject.stack.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <div className="project-actions">
            <a href="#projects">GitHub</a>
            <a href="#projects">Demo</a>
          </div>
        </motion.article>
      </AnimatePresence>
      <div className="phone-project-controls" aria-label="Switch mobile projects">
        <button type="button" onClick={showPrevious}>
          Prev
        </button>
        <div>
          {mobileProjects.map((project, index) => (
            <button
              key={project.name}
              type="button"
              className={index === activeIndex ? 'is-active' : ''}
              aria-label={`Show ${project.name}`}
              aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
        <button type="button" onClick={showNext}>
          Next
        </button>
      </div>
    </motion.div>
  );
}

function ProjectPhonePreview({ accent, image, name }) {
  return (
    <div className={`phone-ui-preview ${accent}`} aria-hidden="true">
      <img src={image} alt={`${name} preview`} loading="lazy" />
    </div>
  );
}

function TechStackScreen() {
  return (
    <motion.div
      key="tech-stack"
      className="phone-screen-layer app-screen stack-app"
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div className="stack-orb" variants={itemVariants}>
        <span>UI</span>
      </motion.div>
      <motion.div className="stack-grid" variants={itemVariants}>
        {stackItems.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </motion.div>
      <motion.p className="secondary-note" variants={itemVariants}>
        Phone is secondary while the stack takes focus.
      </motion.p>
    </motion.div>
  );
}

function JourneyPhoneScreen() {
  return (
    <motion.div
      key="journey"
      className="phone-screen-layer app-screen journey-phone"
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div className="journey-mini-card" variants={itemVariants}>
        <p>Journey</p>
        <h3>Study Log</h3>
        <span>Keep building</span>
      </motion.div>
      <motion.div className="journey-mini-lines" variants={itemVariants}>
        <i />
        <i />
        <i />
      </motion.div>
    </motion.div>
  );
}

function ContactScreen() {
  return (
    <motion.div
      key="contact"
      className="phone-screen-layer contacts-app"
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div className="ios-contact-header" variants={itemVariants}>
        <span>Contacts</span>
        <strong>Edit</strong>
      </motion.div>
      <motion.div className="ios-contact-profile" variants={itemVariants}>
        <div className="ios-contact-avatar" aria-hidden="true">
          EN
        </div>
        <h3>Eeliya Nayeri</h3>
        <p>Computer Science Graduate</p>
        <span>Software Developer</span>
      </motion.div>
      <motion.div className="ios-contact-actions" variants={itemVariants}>
        <a href="mailto:eeliya@example.com">message</a>
        <a href="https://linkedin.com/in/eeliya-nayeri">linkedin</a>
        <a href="https://github.com/eeliyanayeri">github</a>
      </motion.div>
      <motion.div className="ios-contact-list" variants={itemVariants}>
        {contactDetails.map((detail) => (
          <div className="ios-contact-row" key={detail.label}>
            <p>{detail.label}</p>
            {detail.href ? <a href={detail.href}>{detail.value}</a> : <span>{detail.value}</span>}
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

function getPhoneScreen(activeSection, mobileActiveIndex, setMobileActiveIndex) {
  switch (activeSection) {
    case 'about':
      return <AboutGoogleScreen />;
    case 'projects':
      return <ProjectsScreen mobileActiveIndex={mobileActiveIndex} setMobileActiveIndex={setMobileActiveIndex} />;
    case 'tech-stack':
      return <TechStackScreen />;
    case 'journey':
      return <JourneyPhoneScreen />;
    case 'contact':
      return <ContactScreen />;
    case 'home':
    default:
      return <HomeScreen />;
  }
}

const staticStageVariants = {
  static: { opacity: 1, scale: 1, x: 0, y: 0 },
};

export default function IPhoneMockup({ activeSection = 'home', className = '', staticMode = false, controlledMobileIndex, onControlledMobileIndexChange }) {
  const isCompact = useIsCompact();
  const variants = getStageVariants(isCompact);
  const screenKey = activeSection || 'home';
  const projectBoundarySections = ['projects', 'projects-desktop'];
  const hiddenStageSections = ['tech-stack', 'journey'];
  const isProjectBoundaryActive = !staticMode && projectBoundarySections.includes(screenKey);
  const isHidden = !staticMode && hiddenStageSections.includes(screenKey);
  const displayKey = isProjectBoundaryActive || isHidden ? 'projects' : screenKey;
  const [stageRef, projectBoundaryOffset] = useProjectBoundaryOffset(isProjectBoundaryActive);

  return (
    <motion.aside
      ref={stageRef}
      className={`iphone-stage iphone-section-${displayKey} ${staticMode ? 'is-static' : ''} ${
        isHidden ? 'is-hidden' : ''
      } ${className}`}
      aria-label="Persistent iPhone section navigation"
      aria-hidden={isHidden}
      animate={staticMode ? 'static' : displayKey}
      variants={staticMode ? staticStageVariants : variants}
      initial={false}
      style={!staticMode ? { marginTop: projectBoundaryOffset } : undefined}
      transition={{ duration: 1, ease: smoothEase }}
    >
      <div className="iphone-device">
        <span className="iphone-button iphone-button-left" aria-hidden="true" />
        <span className="iphone-button iphone-button-right" aria-hidden="true" />

        <div className="iphone-frame">
          <div className="iphone-screen">
            <div className="phone-status" aria-hidden="true">
              <span>9:41</span>
              <span className="status-icons">
                <span className="status-icon status-icon-cellular">
                  <CellularIcon />
                </span>
                <span className="status-icon status-icon-wifi">
                  <WifiIcon />
                </span>
                <span className="status-icon status-icon-battery">
                  <BatteryIcon />
                </span>
              </span>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {getPhoneScreen(displayKey, controlledMobileIndex, onControlledMobileIndexChange)}
            </AnimatePresence>

            <div className="iphone-glass" aria-hidden="true" />
            <div className="dynamic-island" aria-hidden="true">
              <span />
            </div>

            <span className="home-indicator" aria-hidden="true" />
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
