import cssLogo from '../assets/logos/css3.png';
import dartLogo from '../assets/logos/dart.png';
import djangoLogo from '../assets/logos/django.png';
import expressLogo from '../assets/logos/nodejs.png';
import firebaseLogo from '../assets/logos/firebase.png';
import flutterLogo from '../assets/logos/flutter.png';
import googleCloudLogo from '../assets/logos/google-cloud.png';
import htmlLogo from '../assets/logos/html5.png';
import jsLogo from '../assets/logos/javascript.png';
import nodeLogo from '../assets/logos/nodejs.png';
import postmanLogo from '../assets/logos/postman.png';
import pythonLogo from '../assets/logos/python.png';
import sqlLogo from '../assets/logos/sql.png';
import swiftLogo from '../assets/logos/swift.png';
import reactLogo from '../assets/logos/react.png';
import viteLogo from '../assets/logos/vite.png';
import tailwindLogo from '../assets/logos/tailwind.png';

import alumniDevice from '../assets/screenshots copy/alumni-api-model.jpg';
import alumniShotOne from '../assets/projects/alumni-api/alumni-1.png';
import alumniShotTwo from '../assets/projects/alumni-api/alumni-2.png';
import alumniShotThree from '../assets/projects/alumni-api/alumni-3.png';
import premDevice from '../assets/projects/prem-predictor/prem-predictor-thumb.png';
// The same home screen as the thumbnail, padded to 16:10 so it matches the rest
// of the gallery; the thumbnail itself stays at its native ratio for the device.
import premShotHome from '../assets/projects/prem-predictor/prem-predictor-0.png';
import premShotOne from '../assets/projects/prem-predictor/prem-predictor-1.png';
import premShotTwo from '../assets/projects/prem-predictor/prem-predictor-2.png';
import premShotThree from '../assets/projects/prem-predictor/prem-predictor-3.png';
import premShotFour from '../assets/projects/prem-predictor/prem-predictor-4.png';
import premShotFive from '../assets/projects/prem-predictor/prem-predictor-5.png';
import premShotSix from '../assets/projects/prem-predictor/prem-predictor-6.png';
import premShotSeven from '../assets/projects/prem-predictor/prem-predictor-7.png';
import premShotEight from '../assets/projects/prem-predictor/prem-predictor-8.png';
import premShotNine from '../assets/projects/prem-predictor/prem-predictor-9.png';
import skyDevice from '../assets/screenshots copy/sky-model.jpg';
import skyShotOne from '../assets/projects/skyhealth/skyhealth-1.png';
import skyShotTwo from '../assets/projects/skyhealth/skyhealth-2.png';
import skyShotThree from '../assets/projects/skyhealth/skyhealth-3.png';
import skyShotFour from '../assets/projects/skyhealth/skyhealth-4.png';
import traverseDevice from '../assets/screenshots copy/traverse-model.jpg';
import traverseShotOne from '../assets/projects/traverse/traverse-1.png';
import traverseShotTwo from '../assets/projects/traverse/traverse-2.png';
import traverseShotThree from '../assets/projects/traverse/traverse-3.png';
import traverseShotFour from '../assets/projects/traverse/traverse-4.png';
import traverseShotFive from '../assets/projects/traverse/traverse-5.png';
import weatherDevice from '../assets/screenshots copy/weather-model.jpg';
import weatherShotOne from '../assets/projects/weather/weather-1.png';
import weatherShotTwo from '../assets/projects/weather/weather-2.png';
import pitWallDevice from '../assets/projects/pitwall/pitwall-device.png';
import pitWallShotOne from '../assets/projects/pitwall/1.png';
import pitWallShotTwo from '../assets/projects/pitwall/2.png';
import pitWallShotThree from '../assets/projects/pitwall/3.png';
import pulseOsDevice from '../assets/projects/pulseos/thumbnail.png';
import pulseOsShotOne from '../assets/projects/pulseos/pulseos-1.png';
import pulseOsShotTwo from '../assets/projects/pulseos/pulseos-2.png';
import pulseOsShotThree from '../assets/projects/pulseos/pulseos-3.png';
import pulseOsShotFour from '../assets/projects/pulseos/pulseos-4.png';
import pulseOsShotFive from '../assets/projects/pulseos/pulseos-5.png';
import pulseOsShotSix from '../assets/projects/pulseos/pulseos-6.png';
import pulseOsShotSeven from '../assets/projects/pulseos/pulseos-7.png';
import pulseOsShotEight from '../assets/projects/pulseos/pulseos-8.png';
import pulseOsShotNine from '../assets/projects/pulseos/pulseos-9.png';
import pulseOsShotTen from '../assets/projects/pulseos/pulseos-10.png';
import pulseOsShotEleven from '../assets/projects/pulseos/pulseos-11.png';
import pulseOsShotTwelve from '../assets/projects/pulseos/pulseos-12.png';
import pulseOsShotThirteen from '../assets/projects/pulseos/pulseos-13.png';
import pulseOsShotFourteen from '../assets/projects/pulseos/pulseos-14.png';
import alumniApiDoc from '../docs/Alumni API.pdf';
import skyHealthDoc from '../docs/Heath Check.pdf';
import premPredictorDoc from '../docs/Prem Predictor.pdf';
import traverseDoc from '../docs/Traverse Doc.pdf';
import weatherAppDoc from '../docs/Weather App.pdf';
import pulseOsDoc from '../docs/PulseOS Doc.pdf';
import pitWallDoc from '../docs/Pitwall Doc.pdf';

const techMap = {
  CSS: { logo: cssLogo, tone: 'blue' },
  Dart: { logo: dartLogo, tone: 'blue' },
  Django: { logo: djangoLogo, tone: 'green' },
  Express: { logo: expressLogo, tone: 'navy' },
  Firebase: { logo: firebaseLogo, tone: 'amber' },
  Flutter: { logo: flutterLogo, tone: 'cyan' },
  'Google Places API': { logo: googleCloudLogo, tone: 'gold' },
  HTML: { logo: htmlLogo, tone: 'cyan' },
  HTML5: { logo: htmlLogo, tone: 'cyan' },
  JavaScript: { logo: jsLogo, tone: 'blue' },
  'JWT Authentication': { icon: 'JWT', tone: 'navy' },
  'Node.js': { logo: nodeLogo, tone: 'green' },
  'OpenWeather API': { icon: 'OW', tone: 'blue' },
  Postman: { logo: postmanLogo, tone: 'amber' },
  Python: { logo: pythonLogo, tone: 'blue' },
  'REST APIs': { logo: postmanLogo, tone: 'gold' },
  SQLite: { logo: sqlLogo, tone: 'navy' },
  SQL: { logo: sqlLogo, tone: 'navy' },
  Swift: { logo: swiftLogo, tone: 'cyan' },
  SwiftData: { icon: 'SD', tone: 'cyan' },
  SwiftUI: { logo: swiftLogo, tone: 'cyan' },
  MVVM: { icon: 'MV', tone: 'navy' },
  'Amadeus API': { icon: 'A', tone: 'gold' },
  'React Native': { logo: reactLogo, tone: 'cyan' },
  React: { logo: reactLogo, tone: 'cyan' },
  Expo: { icon: 'EX', tone: 'navy' },
  TypeScript: { icon: 'TS', tone: 'blue' },
  'react-native-web': { icon: 'RNW', tone: 'cyan' },
  'react-native-svg': { icon: 'SVG', tone: 'cyan' },
  Vite: { logo: viteLogo, tone: 'gold' },
  'Tailwind CSS': { logo: tailwindLogo, tone: 'cyan' },
  WebSockets: { icon: 'WS', tone: 'cyan' },
};

const stack = (items) =>
  items.map((label) => ({
    label,
    icon: techMap[label]?.icon || label.slice(0, 2).toUpperCase(),
    logo: techMap[label]?.logo,
    tone: techMap[label]?.tone || 'navy',
  }));

const unavailable = (label) => ({ label, href: null });
const githubAction = (href) => ({ label: 'GitHub', href });
const docsAction = (href) => ({ label: 'Docs', href, newTab: true });
// Live sites are reached by clicking the device itself (see `liveUrl`), so
// they deliberately have no button of their own here.
const projectActions = (doc, githubHref = null) => [
  githubHref ? githubAction(githubHref) : unavailable('GitHub'),
  docsAction(doc),
];

export const mobileProjects = [
  {
    id: 'traverse',
    title: 'Traverse',
    name: 'Traverse',
    category: 'Travel App',
    label: 'Travel App',
    intro: 'Mobile travel companion for routes, places, and trip details.',
    summary:
      'A cross-platform travel planning app that brings flight search, hotel search, itinerary building, budget tracking, and an AI travel assistant into one connected experience.',
    description:
      'Traverse is my final year project: a cross-platform travel app that lets users search flights and hotels, build trip itineraries, track budgets, and use an AI travel assistant. A Firebase data layer and Node.js proxy backend handle storage, API security, and integrations.',
    overview:
      'Traverse is my final year project: a cross-platform travel app that lets users search flights and hotels, build trip itineraries, track budgets, and use an AI travel assistant. A Firebase data layer and Node.js proxy backend handle storage, API security, and integrations.',
    features: [
      'Flight and hotel search brought together in one app instead of separate planning tools.',
      'Trip management with saved itinerary items, preferences, and budget tracking.',
      'AI-assisted travel support with backend proxying to protect external API keys.',
    ],
    highlights: [
      'Flight and hotel search brought together in one app instead of separate planning tools.',
      'Trip management with saved itinerary items, preferences, and budget tracking.',
      'AI-assisted travel support with backend proxying to protect external API keys.',
    ],
    tech: stack(['Flutter', 'Dart', 'Firebase', 'Node.js', 'Express', 'Google Places API', 'Amadeus API']),
    stack: stack(['Flutter', 'Dart', 'Firebase', 'Node.js', 'Express', 'Google Places API', 'Amadeus API']),
    deviceImage: traverseDevice,
    liveUrl: 'https://eeliya-hub.github.io/traverse-web/',
    gallery: [
      { src: traverseShotOne, alt: 'Traverse home dashboard screenshot' },
      { src: traverseShotTwo, alt: 'Traverse flight search screenshot' },
      { src: traverseShotThree, alt: 'Traverse hotel search screenshot' },
      { src: traverseShotFour, alt: 'Traverse itinerary screenshot' },
      { src: traverseShotFive, alt: 'Traverse travel assistant screenshot' },
    ],
    actions: projectActions(traverseDoc, 'https://github.com/eeliya-hub/traverse'),
  },
  {
    id: 'pit-wall',
    title: 'Pit Wall',
    name: 'Pit Wall',
    category: 'F1 Strategy App',
    label: 'F1 Strategy App',
    intro: 'Prototype F1 fan app for live race-strategy calls with an AI race engineer.',
    summary:
      'A cross-platform Aston Martin F1 fan app where you pick a driver, lock in pre-race predictions, and make live pit-wall strategy calls alongside an AI race engineer.',
    description:
      'An Expo and React Native prototype built for the Cognizant Ideathon that puts fans on the Aston Martin pit wall, making live timed strategy calls alongside an AI race engineer. A fan-persona system adapts each screen\'s depth, and a scoring engine grades every call against the team\'s real strategy.',
    overview:
      'An Expo and React Native prototype built for the Cognizant Ideathon that puts fans on the Aston Martin pit wall, making live timed strategy calls alongside an AI race engineer. A fan-persona system adapts each screen\'s depth, and a scoring engine grades every call against the team\'s real strategy.',
    features: [
      'Live, timed strategy calls made alongside an AI race engineer that rates its own confidence.',
      'Fan-persona system that adapts telemetry, hints, and depth from new fans to experts.',
      'Scoring engine that grades every pit-wall call against the team\'s real race strategy.',
    ],
    highlights: [
      'Live, timed strategy calls made alongside an AI race engineer that rates its own confidence.',
      'Fan-persona system that adapts telemetry, hints, and depth from new fans to experts.',
      'Scoring engine that grades every pit-wall call against the team\'s real race strategy.',
    ],
    tech: stack(['React Native', 'Expo', 'TypeScript']),
    stack: stack(['React Native', 'Expo', 'TypeScript']),
    deviceImage: pitWallDevice,
    liveUrl: 'https://eeliya-hub.github.io/amf1/',
    gallery: [
      { src: pitWallShotOne, alt: 'Pit Wall live race, home dashboard, and season detail screens' },
      { src: pitWallShotTwo, alt: 'Pit Wall global leagues, season standings, and custom league screens' },
      { src: pitWallShotThree, alt: 'Pit Wall race setup, live pit-window decision, and race data screens' },
    ],
    actions: projectActions(pitWallDoc, 'https://github.com/eeliya-hub/amf1'),
  },
  {
    id: 'weather-app',
    title: 'Weather App',
    name: 'Weather App',
    category: 'Weather Application',
    label: 'Weather Application',
    intro: 'Native iOS weather, maps, forecasts, and saved places.',
    summary:
      'A native iOS weather dashboard that combines live forecasts, nearby points of interest, map interaction, and saved locations in one smooth SwiftUI app.',
    description:
      'A native iOS weather app built with SwiftUI and MVVM. Users can search locations, view current conditions and forecasts, explore nearby points of interest on a map, and revisit saved places through local persistence.',
    overview:
      'A native iOS weather app built with SwiftUI and MVVM. Users can search locations, view current conditions and forecasts, explore nearby points of interest on a map, and revisit saved places through local persistence.',
    features: [
      'Current weather and short-term forecast views for searched locations.',
      'Map-based nearby points of interest with linked list and annotation interaction.',
      'Saved location history that restores previously viewed places across sessions.',
    ],
    highlights: [
      'Current weather and short-term forecast views for searched locations.',
      'Map-based nearby points of interest with linked list and annotation interaction.',
      'Saved location history that restores previously viewed places across sessions.',
    ],
    tech: stack(['Swift', 'SwiftUI', 'OpenWeather API', 'SwiftData', 'MVVM']),
    stack: stack(['Swift', 'SwiftUI', 'OpenWeather API', 'SwiftData', 'MVVM']),
    deviceImage: weatherDevice,
    gallery: [
      { src: weatherShotOne, alt: 'Weather app current conditions screenshot' },
      { src: weatherShotTwo, alt: 'Weather app map and places screenshot' },
    ],
    actions: projectActions(weatherAppDoc),
  },
];

export const desktopProjects = [
  {
    id: 'pulseos',
    title: 'PulseOS',
    name: 'PulseOS',
    category: 'Personal Dashboard',
    label: 'Web App',
    intro: 'A single-screen command centre for the day — weather, calendar, news, markets, sport, music and travel, under a sky that follows the hour.',
    summary:
      'A personal command-centre dashboard that pulls the services you check each day — weather, calendar, news, markets, sport, music and travel — into one single-viewport interface, built around a living background whose colour follows the time of day.',
    description:
      'A personal dashboard that gathers the many services people check every day onto one screen that never scrolls. Every view is composed the same way: a hero set straight on a living sky, a horizon that lands on the same line in every tab, and one full-bleed surface below it divided into columns by hairlines rather than chopped into floating cards. Built as a monorepo with a React and Vite frontend and a layered Node.js and Express backend that acts as a secure gateway to a wide range of third-party providers, each isolated behind its own route, controller and service.',
    overview:
      'A personal dashboard that gathers the many services people check every day onto one screen that never scrolls. Every view is composed the same way: a hero set straight on a living sky, a horizon that lands on the same line in every tab, and one full-bleed surface below it divided into columns by hairlines rather than chopped into floating cards. Built as a monorepo with a React and Vite frontend and a layered Node.js and Express backend that acts as a secure gateway to a wide range of third-party providers, each isolated behind its own route, controller and service.',
    features: [
      'A background that carries meaning: sky colours follow the hour, and the Music view lends them the current album\'s palette.',
      'An assistant that acts rather than answers — an agent loop over the user\'s live data, reachable by typing or by real-time speech over a WebSocket.',
      'Layered Express gateway isolating each provider behind its own route, controller and service, with rate limiting and hard usage caps that keep it inside free tiers.',
    ],
    highlights: [
      'A background that carries meaning: sky colours follow the hour, and the Music view lends them the current album\'s palette.',
      'An assistant that acts rather than answers — an agent loop over the user\'s live data, reachable by typing or by real-time speech over a WebSocket.',
      'Layered Express gateway isolating each provider behind its own route, controller and service, with rate limiting and hard usage caps that keep it inside free tiers.',
    ],
    tech: stack(['JavaScript', 'React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'WebSockets', 'Firebase', 'REST APIs']),
    stack: stack(['JavaScript', 'React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'WebSockets', 'Firebase', 'REST APIs']),
    deviceImage: pulseOsDevice,
    gallery: [
      { src: pulseOsShotOne, alt: 'PulseOS home screen with greeting, upcoming events, forecast and app launcher under a daytime sky' },
      { src: pulseOsShotTwo, alt: 'PulseOS Launchpad showing installed Mac apps, saved websites and a combined search field' },
      { src: pulseOsShotThree, alt: 'PulseOS Life Hub with the day\'s schedule, to-dos, habits and project progress' },
      { src: pulseOsShotFour, alt: 'PulseOS Markets & News with a live television stream, price ticker and headline feed' },
      { src: pulseOsShotFive, alt: 'PulseOS markets watchlist showing live prices and daily change per instrument' },
      { src: pulseOsShotSix, alt: 'PulseOS local news feed resolved from the user\'s county' },
      { src: pulseOsShotSeven, alt: 'PulseOS sport feed showing the Premier League table with the followed club highlighted' },
      { src: pulseOsShotEight, alt: 'PulseOS sport feed showing the Formula 1 drivers\' championship and the next race' },
      { src: pulseOsShotNine, alt: 'PulseOS music player playing a track, with the sky taking the album cover\'s colours' },
      { src: pulseOsShotTen, alt: 'PulseOS travel planner with live flight tracking, a route map, currency and day-by-day itinerary' },
      { src: pulseOsShotEleven, alt: 'PulseOS AI assistant answering a question about the day from live calendar and weather data' },
      { src: pulseOsShotTwelve, alt: 'PulseOS voice assistant speaking its answer aloud, with the live weather it just looked up shown beside it' },
      { src: pulseOsShotThirteen, alt: 'PulseOS voice assistant listening, the waveform tracking the speaker’s voice in real time' },
      { src: pulseOsShotFourteen, alt: 'PulseOS immersive player: the lyric above a horizon that marks every line of the song, lit by the album’s own colours' },
    ],
    actions: projectActions(pulseOsDoc, 'https://github.com/eeliya-hub/pulseOS'),
  },
  {
    id: 'prem-predictor',
    title: 'Prem Predictor',
    name: 'Prem Predictor',
    category: 'Football Prediction Project',
    label: 'Web App',
    intro: 'Multiplayer Premier League prediction leagues with sealed picks and live standings.',
    summary:
      'A multiplayer Premier League prediction app where friends join a private league by link or code, rank all twenty clubs, and have their picks stay sealed until the deadline before revealing together.',
    description:
      'A Firebase-backed web app that turns informal football predictions into a competition people can trust. Players join a private league by invite link or code and rank all twenty clubs, and every prediction stays sealed until the deadline — enforced by Firestore security rules on the server, not just hidden in the interface.',
    overview:
      'A Firebase-backed web app that turns informal football predictions into a competition people can trust. Players join a private league by invite link or code and rank all twenty clubs, and every prediction stays sealed until the deadline — enforced by Firestore security rules on the server, not just hidden in the interface.',
    features: [
      'Multiplayer leagues with Google sign-in, invite links and join codes, and accounts that carry predictions across devices.',
      'Server-side Firestore rules that seal every prediction until the deadline, with owner controls to close, reopen and reveal.',
      'Live standings refreshed daily by a scheduled CI job, plus PDF sheets, score reports and JSON import/export.',
    ],
    highlights: [
      'Multiplayer leagues with Google sign-in, invite links and join codes, and accounts that carry predictions across devices.',
      'Server-side Firestore rules that seal every prediction until the deadline, with owner controls to close, reopen and reveal.',
      'Live standings refreshed daily by a scheduled CI job, plus PDF sheets, score reports and JSON import/export.',
    ],
    tech: stack(['JavaScript', 'Firebase', 'Tailwind CSS', 'REST APIs', 'HTML', 'CSS']),
    stack: stack(['JavaScript', 'Firebase', 'Tailwind CSS', 'REST APIs', 'HTML', 'CSS']),
    deviceImage: premDevice,
    liveUrl: 'https://prempredictor.web.app',
    gallery: [
      { src: premShotHome, alt: 'Prem Predictor home screen welcoming the player with their leagues' },
      { src: premShotOne, alt: 'Prem Predictor leagues list showing both leagues counting down to their deadline' },
      { src: premShotTwo, alt: 'Prem Predictor league overview with players, countdown, and sealed picks' },
      { src: premShotThree, alt: 'Prem Predictor prediction board part-filled, with the remaining clubs above the positions' },
      { src: premShotFour, alt: 'Prem Predictor prediction board with all twenty clubs placed' },
      { src: premShotFive, alt: 'Prem Predictor one-at-a-time mode picking the champions' },
      { src: premShotSix, alt: 'Prem Predictor league settings with deadline and owner controls' },
      { src: premShotSeven, alt: 'Prem Predictor live Premier League table pulled from the league feed' },
      { src: premShotEight, alt: 'Prem Predictor rules page explaining how it works and how scoring works' },
      { src: premShotNine, alt: 'Prem Predictor profile page with display name and club crest picker' },
    ],
    actions: projectActions(premPredictorDoc, ''),
  },
  {
    id: 'alumni-api',
    title: 'Alumni API',
    name: 'Alumni API',
    category: 'Backend/API Project',
    label: 'Backend/API Project',
    intro: 'Structured alumni platform with profiles, auth, bidding, and documented endpoints.',
    summary:
      'A structured alumni showcase platform with authentication, profile management, bidding logic, and documented API endpoints built across two connected services.',
    description:
      'A RESTful backend system for managing alumni accounts, profiles, and featured alumni selection. It uses a two-service architecture separating auth and API key logic from alumni data, bidding, and winner selection, with layered routing, business logic, and database access.',
    overview:
      'A RESTful backend system for managing alumni accounts, profiles, and featured alumni selection. It uses a two-service architecture separating auth and API key logic from alumni data, bidding, and winner selection, with layered routing, business logic, and database access.',
    features: [
      'Two-service setup separating authentication and API key logic from alumni platform features.',
      'Full profile management across linked sections such as biography, qualifications, and employment.',
      'Blind bidding system with winner selection, protected routes, and documented API endpoints.',
    ],
    highlights: [
      'Two-service setup separating authentication and API key logic from alumni platform features.',
      'Full profile management across linked sections such as biography, qualifications, and employment.',
      'Blind bidding system with winner selection, protected routes, and documented API endpoints.',
    ],
    tech: stack(['Node.js', 'Express', 'SQL', 'SQLite', 'Postman', 'REST APIs', 'JWT Authentication', 'JavaScript', 'CSS', 'HTML']),
    stack: stack(['Node.js', 'Express', 'SQL', 'SQLite', 'Postman', 'REST APIs', 'JWT Authentication', 'JavaScript', 'CSS', 'HTML']),
    deviceImage: alumniDevice,
    gallery: [
      { src: alumniShotOne, alt: 'Alumni API interface screenshot' },
      { src: alumniShotTwo, alt: 'Alumni API dashboard screenshot' },
      { src: alumniShotThree, alt: 'Alumni API profile screenshot' },
    ],
    actions: projectActions(alumniApiDoc),
  },
  {
    id: 'sky-health',
    title: 'Sky Health Project',
    name: 'Sky Health Project',
    category: 'Health Platform',
    label: 'Health Platform',
    intro: 'Staff health check flow with guided surveys, sessions, history, and trend views.',
    summary:
      'An internal staff health check system where employees complete guided check-ins, track trends over time, and review past responses through a clear dashboard flow.',
    description:
      'Built from a real client brief set by Sky UK, this Django-based system lets staff complete guided health check surveys, track trends over time, and review past responses. It includes employee verification, session management, and trend visualisation across a clean dashboard.',
    overview:
      'Built from a real client brief set by Sky UK, this Django-based system lets staff complete guided health check surveys, track trends over time, and review past responses. It includes employee verification, session management, and trend visualisation across a clean dashboard.',
    features: [
      'Guided health check survey flow with one-question-at-a-time completion.',
      'Dashboard logic for employee verification, session availability, and submission history.',
      'Trend visualisation that helps users review patterns in past health check responses.',
    ],
    highlights: [
      'Guided health check survey flow with one-question-at-a-time completion.',
      'Dashboard logic for employee verification, session availability, and submission history.',
      'Trend visualisation that helps users review patterns in past health check responses.',
    ],
    tech: stack(['Django', 'HTML', 'CSS', 'JavaScript']),
    stack: stack(['Django', 'HTML', 'CSS', 'JavaScript']),
    deviceImage: skyDevice,
    gallery: [
      { src: skyShotOne, alt: 'Sky Health dashboard screenshot' },
      { src: skyShotTwo, alt: 'Sky Health workflow screenshot' },
      { src: skyShotThree, alt: 'Sky Health survey screenshot' },
      { src: skyShotFour, alt: 'Sky Health trend screenshot' },
    ],
    actions: projectActions(skyHealthDoc),
  },
];

export const allProjects = [...mobileProjects, ...desktopProjects];
