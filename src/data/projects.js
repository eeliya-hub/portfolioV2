// The register: seven entries, in reading order.
//
// Plain data, no imports — scripts/build-pages.mjs reads this under bare Node
// to generate each entry's page and its metadata.
//
// `media` values are stems into src/media (see src/lib/media.js); the build
// resolves each one to a responsive WebP set. `frame` picks which device the
// entry's plate is set in — 'phone' or 'laptop' — and is the one thing carried
// over wholesale from the previous site.
//
// `year: null` means the date is not established. It renders as an em dash
// rather than a guess.

export const projects = [
  {
    id: 'pulseos',
    no: '01',
    title: 'PulseOS',
    frame: 'laptop',
    kind: 'Personal dashboard',
    year: 2026,
    context: 'Personal project',
    platform: 'Web',

    oneLine: 'A single-screen command centre where mail, projects and the calendar finally talk to each other.',

    standfirst:
      'A dashboard that gathers everything you check in a day onto one screen that never scrolls — and, since the October release, joins up the three things that were still separate: your inbox, your plans and your days.',

    body: [
      'PulseOS pulls the services people check every morning — weather, calendar, news, markets, sport, music and travel — into a single viewport. Every view is composed the same way: a hero set against a living sky, a horizon that lands on the same line in every tab, and one full-bleed surface beneath it divided into columns by hairlines rather than chopped into floating cards.',
      'The October 2026 release added the mail hub. Gmail and Outlook sit side by side, and Pulse reads ahead so that what needs a reply and what is due surface on their own. Dates buried inside an email are extracted into the calendar without being asked. Highlight a line and it becomes a task, or a card on one of your project boards. When it is time to answer, you say what you mean, Pulse drafts it, and you press send.',
      'The same release gave projects room to move. Every plan sits on a board of draggable cards, each card holding its own checklist, dates and notes, and the whole thing can be read as a board, as a timeline, or as every card at once. The calendar grew to a full month view that carries the meetings the inbox found. The assistant answers across all of it: what is in flight, what is up next, what is due on Friday.',
      'Underneath, it is a monorepo — a React and Vite frontend over a layered Node and Express gateway. Every third-party provider is isolated behind its own route, controller and service, with rate limiting and hard usage caps that keep the whole thing inside free tiers.',
    ],

    highlights: [
      'Gmail and Outlook in one inbox that reads ahead, surfacing what needs a reply and what is due.',
      'Dates lifted out of an email into the calendar; a highlighted line becomes a task or a project card.',
      'Project boards with draggable cards — checklist, dates and notes — read as a board, a timeline, or all at once.',
      'Replies dictated rather than typed: say what you mean, Pulse drafts it, you press send.',
      'A background that carries meaning — sky colours follow the hour, and the music view borrows the album’s palette.',
      'A layered Express gateway isolating each provider behind its own route, controller and service.',
    ],

    stack: ['JavaScript', 'React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'WebSockets', 'Firebase', 'REST APIs'],

    links: { live: null, repo: 'https://github.com/eeliya-hub/pulseOS', doc: '/docs/pulseos.pdf' },

    lead: 'pulseos/pulseos-1',
    // NOTE: the gallery still shows the pre-October release. The mail hub,
    // the project boards and the month calendar have no screenshots yet.
    gallery: [
      { stem: 'pulseos/pulseos-1', alt: 'PulseOS home screen with greeting, upcoming events, forecast and app launcher under a daytime sky' },
      { stem: 'pulseos/pulseos-2', alt: 'PulseOS Launchpad showing installed Mac apps, saved websites and a combined search field' },
      { stem: 'pulseos/pulseos-3', alt: 'PulseOS Life Hub with the day’s schedule, to-dos, habits and project progress' },
      { stem: 'pulseos/pulseos-4', alt: 'PulseOS Markets and News with a live television stream, price ticker and headline feed' },
      { stem: 'pulseos/pulseos-5', alt: 'PulseOS markets watchlist showing live prices and daily change per instrument' },
      { stem: 'pulseos/pulseos-6', alt: 'PulseOS local news feed resolved from the user’s county' },
      { stem: 'pulseos/pulseos-7', alt: 'PulseOS sport feed showing the Premier League table with the followed club highlighted' },
      { stem: 'pulseos/pulseos-8', alt: 'PulseOS sport feed showing the Formula 1 drivers’ championship and the next race' },
      { stem: 'pulseos/pulseos-9', alt: 'PulseOS music player playing a track, with the sky taking the album cover’s colours' },
      { stem: 'pulseos/pulseos-10', alt: 'PulseOS travel planner with live flight tracking, a route map, currency and day-by-day itinerary' },
      { stem: 'pulseos/pulseos-11', alt: 'PulseOS AI assistant answering a question about the day from live calendar and weather data' },
      { stem: 'pulseos/pulseos-12', alt: 'PulseOS voice assistant speaking its answer aloud, with the live weather it just looked up shown beside it' },
      { stem: 'pulseos/pulseos-13', alt: 'PulseOS voice assistant listening, the waveform tracking the speaker’s voice in real time' },
      { stem: 'pulseos/pulseos-14', alt: 'PulseOS immersive player: the lyric above a horizon that marks every line of the song, lit by the album’s own colours' },
    ],
  },

  {
    id: 'traverse',
    no: '02',
    title: 'Traverse',
    frame: 'phone',
    kind: 'Travel app',
    year: 2026,
    context: 'Final year project',
    platform: 'iOS & Android',

    oneLine: 'Flight search, hotels, itineraries and budgets in one app, with an AI travel assistant.',

    standfirst:
      'My final year project: a cross-platform travel app that replaces the half-dozen tabs a trip normally takes with one place to search, plan, budget and ask.',

    body: [
      'Traverse brings flight and hotel search together with itinerary building and budget tracking, so a trip stops being spread across a browser and a notes app. An AI travel assistant sits alongside it for the questions a search box cannot answer.',
      'A Firebase data layer handles storage and sync. A Node and Express proxy sits between the app and the outside world, holding the Google Places and Amadeus credentials server-side so no API key ever ships inside the client.',
    ],

    highlights: [
      'Flight and hotel search brought into one app instead of separate planning tools.',
      'Trip management with saved itinerary items, preferences and budget tracking.',
      'AI-assisted travel support, with the backend proxying every call so external API keys stay server-side.',
    ],

    stack: ['Flutter', 'Dart', 'Firebase', 'Node.js', 'Express', 'Google Places API', 'Amadeus API'],

    links: {
      live: 'https://eeliya-hub.github.io/traverse-web/',
      repo: 'https://github.com/eeliya-hub/traverse',
      doc: '/docs/traverse.pdf',
    },

    lead: 'traverse/traverse-1',
    gallery: [
      { stem: 'traverse/traverse-1', alt: 'Traverse home dashboard' },
      { stem: 'traverse/traverse-2', alt: 'Traverse flight search results' },
      { stem: 'traverse/traverse-3', alt: 'Traverse hotel search results' },
      { stem: 'traverse/traverse-4', alt: 'Traverse trip itinerary' },
      { stem: 'traverse/traverse-5', alt: 'Traverse AI travel assistant' },
    ],
  },

  {
    id: 'pit-wall',
    no: '03',
    title: 'Pit Wall',
    frame: 'phone',
    kind: 'Formula 1 fan app',
    year: 2026,
    context: 'Cognizant × Aston Martin F1 Ideathon',
    platform: 'iOS & Android',

    oneLine: 'Live, timed race-strategy calls made beside an AI race engineer, then graded against the real thing.',

    standfirst:
      'A prototype built for the Cognizant and Aston Martin Formula One Ideathon that puts a fan on the pit wall, making the strategy calls under the clock while an AI race engineer argues its corner.',

    body: [
      'During a race the app asks the questions the pit wall is actually asking — stay out or box now, which compound, cover the car behind or chase the one ahead — and it asks them on a timer. An AI race engineer offers its recommendation and rates its own confidence, so a fan can take the advice or overrule it.',
      'A fan-persona system changes how much each screen shows. A newcomer gets the call and the consequence; an expert gets the telemetry behind it. After the chequered flag a scoring engine grades every decision against the team’s real race strategy.',
    ],

    highlights: [
      'Live, timed strategy calls made alongside an AI race engineer that rates its own confidence.',
      'A fan-persona system that adapts telemetry, hints and depth from newcomer to expert.',
      'A scoring engine that grades every pit-wall call against the team’s real race strategy.',
    ],

    stack: ['React Native', 'Expo', 'TypeScript'],

    links: {
      live: 'https://eeliya-hub.github.io/amf1/',
      repo: 'https://github.com/eeliya-hub/amf1',
      doc: '/docs/pit-wall.pdf',
    },

    lead: 'pitwall/1',
    gallery: [
      { stem: 'pitwall/1', alt: 'Pit Wall live race, home dashboard and season detail screens' },
      { stem: 'pitwall/2', alt: 'Pit Wall global leagues, season standings and custom league screens' },
      { stem: 'pitwall/3', alt: 'Pit Wall race setup, live pit-window decision and race data screens' },
    ],
  },

  {
    id: 'prem-predictor',
    no: '04',
    title: 'Prem Predictor',
    frame: 'laptop',
    kind: 'Prediction league',
    year: null,
    context: 'Personal project',
    platform: 'Web',

    oneLine: 'Private Premier League prediction leagues where every pick stays sealed until the deadline.',

    standfirst:
      'A multiplayer prediction app that turns an argument between friends into a competition nobody can cheat: you rank all twenty clubs, and no one sees anything until the deadline passes.',

    body: [
      'Players join a private league by invite link or join code, then rank all twenty clubs for the season. Every prediction stays sealed until the deadline — and it is sealed by Firestore security rules on the server, not merely hidden by the interface, which is the difference between a game and a game people trust.',
      'Standings refresh daily from a scheduled CI job. League owners can close, reopen and reveal; everything can leave as a PDF sheet, a score report or JSON.',
    ],

    highlights: [
      'Multiplayer leagues with Google sign-in, invite links and join codes, and accounts that carry predictions across devices.',
      'Server-side Firestore rules that seal every prediction until the deadline, with owner controls to close, reopen and reveal.',
      'Live standings refreshed daily by a scheduled CI job, plus PDF sheets, score reports and JSON import and export.',
    ],

    stack: ['JavaScript', 'Firebase', 'Tailwind CSS', 'REST APIs', 'HTML', 'CSS'],

    links: { live: 'https://prempredictor.web.app', repo: null, doc: '/docs/prem-predictor.pdf' },

    lead: 'prem-predictor/prem-predictor-0',
    gallery: [
      { stem: 'prem-predictor/prem-predictor-0', alt: 'Prem Predictor home screen welcoming the player with their leagues' },
      { stem: 'prem-predictor/prem-predictor-1', alt: 'Prem Predictor leagues list, both leagues counting down to their deadline' },
      { stem: 'prem-predictor/prem-predictor-2', alt: 'Prem Predictor league overview with players, countdown and sealed picks' },
      { stem: 'prem-predictor/prem-predictor-3', alt: 'Prem Predictor prediction board part-filled, remaining clubs above the positions' },
      { stem: 'prem-predictor/prem-predictor-4', alt: 'Prem Predictor prediction board with all twenty clubs placed' },
      { stem: 'prem-predictor/prem-predictor-5', alt: 'Prem Predictor one-at-a-time mode picking the champions' },
      { stem: 'prem-predictor/prem-predictor-6', alt: 'Prem Predictor league settings with deadline and owner controls' },
      { stem: 'prem-predictor/prem-predictor-7', alt: 'Prem Predictor live Premier League table pulled from the league feed' },
      { stem: 'prem-predictor/prem-predictor-8', alt: 'Prem Predictor rules page explaining how it works and how scoring works' },
      { stem: 'prem-predictor/prem-predictor-9', alt: 'Prem Predictor profile page with display name and club crest picker' },
    ],
  },

  {
    id: 'sky-health',
    no: '05',
    title: 'Sky Health',
    frame: 'laptop',
    kind: 'Health platform',
    year: null,
    context: 'Client brief, Sky UK',
    platform: 'Web',

    oneLine: 'A staff health-check platform built to a real Sky UK brief: guided check-ins, history and trends.',

    standfirst:
      'Built from a brief set by Sky UK: a system where staff complete a guided health check, then see their own answers turn into a trend over time.',

    body: [
      'The survey is deliberately one question at a time — the fastest way to get an honest answer is to stop showing people the length of the form. Behind it sits the dashboard logic: employee verification, which sessions are open to whom, and what has already been submitted.',
      'Past responses are kept and plotted, so the value of filling it in a fourth time is visible on the screen where you fill it in.',
    ],

    highlights: [
      'A guided health-check flow completed one question at a time.',
      'Dashboard logic for employee verification, session availability and submission history.',
      'Trend visualisation that lets staff review patterns across past responses.',
    ],

    stack: ['Django', 'Python', 'HTML', 'CSS', 'JavaScript'],

    links: { live: null, repo: null, doc: '/docs/sky-health.pdf' },

    lead: 'skyhealth/skyhealth-1',
    gallery: [
      { stem: 'skyhealth/skyhealth-1', alt: 'Sky Health dashboard' },
      { stem: 'skyhealth/skyhealth-2', alt: 'Sky Health check-in workflow' },
      { stem: 'skyhealth/skyhealth-3', alt: 'Sky Health survey question' },
      { stem: 'skyhealth/skyhealth-4', alt: 'Sky Health response trends over time' },
    ],
  },

  {
    id: 'alumni-api',
    no: '06',
    title: 'Alumni API',
    frame: 'laptop',
    kind: 'REST backend',
    year: null,
    context: 'Coursework',
    platform: 'Backend',

    oneLine: 'A two-service REST backend: auth and API keys kept separate from alumni data and blind bidding.',

    standfirst:
      'A backend for managing alumni accounts, profiles and featured-alumni selection, split deliberately into two services so that authentication never shares a process with the data it protects.',

    body: [
      'One service owns authentication and API keys. The other owns alumni records, the bidding that decides who is featured, and winner selection. Each is layered into routing, business logic and database access, so a change to how a profile is stored never reaches into how a request is authorised.',
      'Profiles span linked sections — biography, qualifications, employment — and every endpoint is documented and exercised in Postman.',
    ],

    highlights: [
      'A two-service split separating authentication and API-key logic from the alumni platform itself.',
      'Full profile management across linked sections: biography, qualifications and employment.',
      'A blind bidding system with winner selection, protected routes and documented endpoints.',
    ],

    stack: ['Node.js', 'Express', 'SQL', 'SQLite', 'JWT Authentication', 'Postman', 'REST APIs', 'JavaScript'],

    links: { live: null, repo: null, doc: '/docs/alumni-api.pdf' },

    lead: 'alumni-api/alumni-1',
    gallery: [
      { stem: 'alumni-api/alumni-1', alt: 'Alumni API interface' },
      { stem: 'alumni-api/alumni-2', alt: 'Alumni API dashboard' },
      { stem: 'alumni-api/alumni-3', alt: 'Alumni API profile record' },
    ],
  },

  {
    id: 'weather-app',
    no: '07',
    title: 'Weather App',
    frame: 'phone',
    kind: 'Native iOS app',
    year: null,
    context: 'Coursework',
    platform: 'iOS',

    oneLine: 'A native SwiftUI weather app with forecasts, a map of nearby places and saved locations.',

    standfirst:
      'A native iOS weather app built on SwiftUI and MVVM: search a location, read the forecast, explore what is nearby on a map, and come back to the places you saved.',

    body: [
      'Current conditions and a short-term forecast for any searched location, with nearby points of interest shown on a map where the list and the annotations drive each other.',
      'Saved locations persist through SwiftData, so the places you check often are where you left them. The whole app is structured MVVM — the view never reaches past its model.',
    ],

    highlights: [
      'Current conditions and short-term forecast views for any searched location.',
      'A map of nearby points of interest where the list and the annotations stay in sync.',
      'Saved location history restored across sessions through local persistence.',
    ],

    stack: ['Swift', 'SwiftUI', 'SwiftData', 'MVVM', 'OpenWeather API'],

    links: { live: null, repo: null, doc: '/docs/weather-app.pdf' },

    lead: 'weather/weather-1',
    gallery: [
      { stem: 'weather/weather-1', alt: 'Weather app current conditions' },
      { stem: 'weather/weather-2', alt: 'Weather app map and nearby places' },
    ],
  },
];

export const projectById = (id) => projects.find((entry) => entry.id === id);
