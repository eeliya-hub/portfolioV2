import { stackIconMap, techLogoMap } from '../data/techStack.js';

export function LucideIcon({ name }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 2,
  };

  const paths = {
    braces: (
      <>
        <path {...common} d="M8 3H7a3 3 0 0 0-3 3v2a2 2 0 0 1-2 2 2 2 0 0 1 2 2v2a3 3 0 0 0 3 3h1" />
        <path {...common} d="M16 3h1a3 3 0 0 1 3 3v2a2 2 0 0 0 2 2 2 2 0 0 0-2 2v2a3 3 0 0 1-3 3h-1" />
      </>
    ),
    brain: (
      <>
        <path {...common} d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 3 5" />
        <path {...common} d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-3 5" />
        <path {...common} d="M9 4v16" />
        <path {...common} d="M15 4v16" />
      </>
    ),
    clipboard: (
      <>
        <rect {...common} x="7" y="4" width="10" height="16" rx="2" />
        <path {...common} d="M9 4a3 3 0 0 1 6 0" />
        <path {...common} d="M9 10h6" />
        <path {...common} d="M9 14h4" />
      </>
    ),
    clock: (
      <>
        <circle {...common} cx="12" cy="12" r="8" />
        <path {...common} d="M12 8v5l3 2" />
      </>
    ),
    code: (
      <>
        <path {...common} d="m8 9-4 3 4 3" />
        <path {...common} d="m16 9 4 3-4 3" />
        <path {...common} d="m14 5-4 14" />
      </>
    ),
    crown: (
      <>
        <path {...common} d="m4 8 4 4 4-7 4 7 4-4-2 10H6L4 8Z" />
        <path {...common} d="M6 20h12" />
      </>
    ),
    database: (
      <>
        <ellipse {...common} cx="12" cy="6" rx="7" ry="3" />
        <path {...common} d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
        <path {...common} d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
      </>
    ),
    devices: (
      <>
        <rect {...common} x="3" y="5" width="12" height="9" rx="1.5" />
        <rect {...common} x="16" y="10" width="5" height="9" rx="1.5" />
        <path {...common} d="M8 18h4" />
        <path {...common} d="M10 14v4" />
      </>
    ),
    gitBranch: (
      <>
        <circle {...common} cx="6" cy="6" r="2" />
        <circle {...common} cx="18" cy="18" r="2" />
        <circle {...common} cx="6" cy="18" r="2" />
        <path {...common} d="M6 8v8" />
        <path {...common} d="M8 6h4a6 6 0 0 1 6 6v4" />
      </>
    ),
    layers: (
      <>
        <path {...common} d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path {...common} d="m3 12 9 5 9-5" />
        <path {...common} d="m3 16 9 5 9-5" />
      </>
    ),
    lightbulb: (
      <>
        <path {...common} d="M9 18h6" />
        <path {...common} d="M10 22h4" />
        <path {...common} d="M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 4H9c0-2 0-3-1-4Z" />
      </>
    ),
    message: (
      <>
        <path {...common} d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
      </>
    ),
    monitorCog: (
      <>
        <rect {...common} x="3" y="4" width="14" height="10" rx="2" />
        <path {...common} d="M8 20h5" />
        <path {...common} d="M10 14v6" />
        <circle {...common} cx="18" cy="17" r="2" />
        <path {...common} d="M18 13v1" />
        <path {...common} d="M18 20v1" />
        <path {...common} d="m14.5 15 1 .5" />
        <path {...common} d="m20.5 18.5 1 .5" />
      </>
    ),
    palette: (
      <>
        <path {...common} d="M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 1-3.7 1.5 1.5 0 0 1 .8-2.8H17a4 4 0 0 0 4-4C21 6.4 17 3 12 3Z" />
        <circle {...common} cx="7.5" cy="10.5" r=".5" />
        <circle {...common} cx="10.5" cy="7.5" r=".5" />
        <circle {...common} cx="14" cy="7.5" r=".5" />
      </>
    ),
    refresh: (
      <>
        <path {...common} d="M20 6v5h-5" />
        <path {...common} d="M4 18v-5h5" />
        <path {...common} d="M6.2 8A7 7 0 0 1 18 7.1L20 11" />
        <path {...common} d="M17.8 16A7 7 0 0 1 6 16.9L4 13" />
      </>
    ),
    rocket: (
      <>
        <path {...common} d="M5 15c2-6 6-10 14-10-1 8-4 12-10 14l-4-4Z" />
        <path {...common} d="M9 19 5 21l2-4" />
        <circle {...common} cx="15" cy="9" r="1.5" />
      </>
    ),
    share: (
      <>
        <circle {...common} cx="18" cy="5" r="3" />
        <circle {...common} cx="6" cy="12" r="3" />
        <circle {...common} cx="18" cy="19" r="3" />
        <path {...common} d="m8.6 13.5 6.8 4" />
        <path {...common} d="m15.4 6.5-6.8 4" />
      </>
    ),
    sparkles: (
      <>
        <path {...common} d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Z" />
        <path {...common} d="m5 15 .8 1.8L8 18l-2.2 1.2L5 21l-.8-1.8L2 18l2.2-1.2L5 15Z" />
      </>
    ),
    users: (
      <>
        <path {...common} d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle {...common} cx="9" cy="7" r="4" />
        <path {...common} d="M22 21v-2a4 4 0 0 0-3-3.9" />
        <path {...common} d="M16 3.1a4 4 0 0 1 0 7.8" />
      </>
    ),
  };

  return (
    <svg className="lucide-like-icon" viewBox="0 0 24 24" aria-hidden="true">
      {paths[name] || paths.code}
    </svg>
  );
}

export function TechItemIcon({ item }) {
  const logo = techLogoMap[item];

  if (logo) {
    return <img src={logo} alt="" aria-hidden="true" loading="lazy" />;
  }

  return <LucideIcon name={stackIconMap[item] || 'code'} />;
}
