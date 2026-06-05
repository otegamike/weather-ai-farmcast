# FarmCast
### Farm Weather Intelligence — WeatherAI Take-Home Challenge

Hyper-local agronomic forecasts that translate raw meteorological data into actionable farm decisions. Auto-detects your location on load and surfaces field-ready insights — irrigation windows, pest pressure risk, frost warnings, and more.

`Next.js 16.2.7` · `Deployed on Vercel`

---

## Live Demo

[View Live App](YOUR_DEPLOYMENT_URL) · [GitHub Repository](YOUR_REPO_URL)

---

## Project Overview

FarmCast is a response to the WeatherAI take-home engineering challenge. Rather than building a basic weather widget, the decision was made to build farm-specific intelligence on top of the WeatherAI API. The app auto-detects the user's location on load via IP geolocation, and translates raw meteorological data (temperature, wind, humidity, UV, precipitation probability) into actionable farm decisions — irrigation timing, spray windows, pest pressure alerts, frost risk, harvest advisories, and field work windows.

The core product thinking is that raw weather data is only useful when interpreted for a specific domain. Six agronomic intelligence conditions (Best Irrigation Window, Best Spray Window, Pest Pressure Risk, Frost Risk, Harvest Conditions, Field Work Window) are derived client-side from the API response with no additional API calls. The hero card displays the current conditions with one of nine distinct CSS-driven weather animations (clear, partly cloudy, overcast, fog, drizzle, rain, showers, snow, thunderstorm), each with a unique gradient background and overlay animation.

---

## WeatherAI API Integration

All WeatherAI calls are proxied through Next.js server routes — the API key is injected at the server level and never reaches the browser.

**Proxy route table:**

| App Route | Method | Upstream WeatherAI Endpoint | Purpose |
|---|---|---|---|
| `/api/weather` | GET | `/v1/weather-geo` | IP auto-detect — resolves location from the request IP |
| `/api/weather/search` | GET | `/v1/weather` | Weather by coordinates — `lat`, `lon`, `days`, `units`, `lang`, `ai` |
| `/api/weather/forecast` | GET | `/v1/daily` | Daily forecast only — `lat`, `lon`, `days`, `units` |
| `/api/weather/hourly` | GET | `/v1/hourly` | Hourly forecast only — `lat`, `lon`, `days`, `units` |
| `/api/usage` | GET | `/v1/usage` | API quota and usage statistics |

Cache-Control headers are set on weather responses: `s-maxage=300, stale-while-revalidate=600` for auto/search/hourly routes, and `s-maxage=600, stale-while-revalidate=1200` for the daily forecast route.

Every incoming request is validated with Zod before the upstream call is made — malformed parameters return a 400 with field-level error details before reaching the WeatherAI API. Zod schemas enforce numeric ranges (lat -90..90, lon -180..180, days 1..7), unit enum (`metric` | `imperial`), and optional boolean coercion for the `ai` flag.

**The AI summary field:** The `ai=true` query param is passed to request a Gemini-generated agronomic summary from the WeatherAI API. The response field `ai_summary` is rendered by the `AIInsightPanel` component, which shows a shimmer skeleton while loading and fades in the prose text with a quoted, lede-first layout. By default, the free WeatherAI plan returns 500 when `ai=true` is sent, so the app defaults to `ai=false` in production.

**Location resolution flow:**

1. On initial load: IP auto-detection via `/v1/weather-geo` with `ip=auto` — no user action required.
2. On search: user types a city name → 300ms debounced call to Open-Meteo Geocoding API (`https://geocoding-api.open-meteo.com/v1/search?name=...&count=5&language=en&format=json`) → resolves to lat/lon → passed to `/api/weather/search`.
3. On "Use my location": browser `navigator.geolocation` (with `enableHighAccuracy: true`, 10s timeout) → lat/lon → passed to `/api/weather/search`.

---

## Architecture

**State management:** The `AppShell` component manages a three-view state machine: `welcome` → `transitioning` → `dashboard`. The welcome screen is shown first. When a location is selected, the view transitions to `transitioning` (800ms CSS exit animation on the welcome content), then swaps to the dashboard view. The search button in the dashboard header transitions back to the welcome view.

**Hook layer:** All data fetching and business logic lives in custom hooks — components receive data via props only.

| Hook | Responsibility |
|---|---|
| `useWeather` | Fetches weather data from `/api/weather` or `/api/weather/search`; uses `useReducer` for state management and a fetch ID ref to discard stale responses |
| `useGeolocation` | Wraps `navigator.geolocation.getCurrentPosition`; exposes `coords`, `isLoading`, `isError`, `errorMessage`, and a `trigger` callback |
| `useWeatherSearch` | Calls Open-Meteo Geocoding API with a debounced query; returns `suggestions: Suggestion[]`, `isSearching`, `searchError`, `search`, and `clearSuggestions` |
| `useFarmAlerts` | Derives 0–6 farm alerts from hourly/daily data (rain timing, high UV, wind gusts, spraying window, pest pressure, frost risk) |
| `useUnitPreference` | Persists °C/°F preference to `localStorage` under the key `farmcast_unit`; defaults to metric |

**Component structure:** A strict separation is enforced — components are pure UI (props in, JSX out). All data fetching and business logic lives in hooks. Utility functions in `src/lib/weatherUtils.ts` are pure functions with no side effects — they handle temperature/wind formatting, condition labeling, gradient generation, and SVG sparkline path construction.

**Farm intelligence layer:** The `useFarmAlerts` hook and `FarmConditions` component derive actionable intelligence purely from the WeatherAPI response data with no additional API calls. `useFarmAlerts` produces up to 6 alert conditions: rain likelihood, high UV, strong wind gusts, morning spraying window availability, pest pressure (humidity + temperature), and frost risk. `FarmConditions` renders 6 condition cells in a responsive grid — Best Irrigation Window, Best Spray Window, Pest Pressure Risk, Frost Risk, Harvest Conditions, and Field Work Window — each with a severity badge and a plain-English explanation.

---

## Tech Stack

| Category | Technology | Version |
|---|---|---|
| Framework | Next.js | ^16.2.7 |
| Language | TypeScript | ^5 |
| Validation | Zod | ^4.2.0 |
| HTTP Client | Axios | ^1.13.2 |
| UI Library | React | ^19.2.4 |
| Styling | CSS Modules | built-in |
| Geocoding | Open-Meteo Geocoding API | free, no key |
| Icons | Material Symbols | Google Fonts CDN |
| Linting | ESLint | ^9 |
| Deployment | Vercel | — |

---

## Design System

*Earthy Precision* — a dark theme with a warm, agricultural palette. The design system is defined entirely through CSS custom properties in `src/style/variable.css`, organized into categories: surfaces (4 levels), brand colors (primary green `#a1d494`, secondary amber `#f4bb92`), semantic colors (good/caution/warning with dim and border variants), typography (3 font families), spacing (7 steps), radius (5 steps), shadows (2 levels), and transitions (3 speeds). Three fonts are loaded via `next/font/google`: Playfair Display (display/headings, weights 600–700), Hanken Grotesk (body, weights 300–700), and JetBrains Mono (data/monospace, weights 400–700). No Tailwind — pure CSS Modules throughout. The hero card features 9 distinct weather animation states, each with a unique CSS gradient background and a pseudo-element overlay animation (radial glow, horizontal drift, vertical breathe, diagonal streaks, falling particles, or lightning flash), driven entirely by CSS keyframes with no JavaScript.

---

## Getting Started

**Prerequisites:** Node.js 18+

**Installation:**

```bash
git clone https://github.com/YOUR_USERNAME/farmcast.git
cd farmcast
npm install
```

**Environment setup:**

Create a `.env.local` file in the project root:

```env
# WeatherAI API
WEATHER_AI_API_KEY=   # Your WeatherAI API key — get one at weather-ai.co/dashboard
WEATHER_AI_BASE_URL=  # WeatherAI base URL (default: https://api.weather-ai.co)

# App
NEXT_PUBLIC_APP_URL=  # Your app's public URL (e.g. http://localhost:3000)
```

**Run locally:**

```bash
cp .env.example .env.local
# Fill in your WEATHER_AI_API_KEY in .env.local
npm run dev
```

Open `http://localhost:3000`.

**Build for production:**

```bash
npm run build
npm start
```

---

## API Routes Reference

| Route | Method | Query Params | Description |
|---|---|---|---|
| `/api/weather` | GET | `days` (1–7, default 3), `units` (metric\|imperial), `lang` (default en), `ai` (boolean) | Auto-detect weather by request IP |
| `/api/weather/search` | GET | `lat` (-90..90), `lon` (-180..180), `days` (1–7, default 3), `units`, `lang`, `ai` | Weather by geographic coordinates |
| `/api/weather/forecast` | GET | `lat`, `lon`, `days` (1–7, default 7), `units` | Daily forecast only |
| `/api/weather/hourly` | GET | `lat`, `lon`, `days` (1–2, default 1), `units` | Hourly forecast only |
| `/api/usage` | GET | none | API quota and usage statistics |

> All routes proxy to the WeatherAI API server-side. The `WEATHER_AI_API_KEY` is injected at the server level and never exposed to the client.

---

## Deployment

**Vercel (recommended):**

```bash
npm install -g vercel
vercel
```

`vercel.json` is already configured with function settings: 512 MB memory, 10-second max duration, deployed in the `iad1` (Northern Virginia) region.

Set the following environment variables in the Vercel dashboard:

- `WEATHER_AI_API_KEY` — Your WeatherAI API key
- `WEATHER_AI_BASE_URL` — WeatherAI base URL (default: https://api.weather-ai.co)
- `NEXT_PUBLIC_APP_URL` — Your app's public URL

**Other platforms:**

Any Node.js-compatible platform works. The app has no special runtime requirements beyond Node.js and the ability to set environment variables.

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── weather/route.ts          # IP auto-detect weather
│   │   ├── weather/search/route.ts   # Weather by coordinates
│   │   ├── weather/forecast/route.ts # Daily forecast only
│   │   ├── weather/hourly/route.ts   # Hourly forecast only
│   │   └── usage/route.ts            # API quota stats
│   ├── layout.tsx                    # Root layout, font loading, metadata
│   ├── global.css                    # Global styles, grain overlay, .glass utility
│   └── page.tsx                      # Entry point → renders <AppShell />
├── components/
│   ├── AppShell/                     # View state machine (welcome → transitioning → dashboard)
│   ├── welcome/
│   │   ├── WelcomePage.tsx           # Landing screen with search + geolocation
│   │   ├── WelcomeVideo.tsx          # Looping video background with gradient fallback
│   │   ├── SearchInput.tsx           # Debounced autocomplete with dropdown
│   │   ├── LocationButton.tsx        # "Use my location" button
│   │   └── AmbientOrbs.tsx           # Alternative welcome background (unused)
│   ├── dashboard/
│   │   ├── DashboardPage.tsx         # Assembles all dashboard sections
│   │   ├── DashboardHeader.tsx       # Sticky glass header with logo, location, controls
│   │   ├── HeroCard.tsx              # Current conditions + 9 weather animations
│   │   ├── AIInsightPanel.tsx        # Gemini-powered farm insight with shimmer skeleton
│   │   ├── AlertChips.tsx            # Horizontal scrollable severity chips
│   │   ├── HourlyStrip.tsx           # 24-hour forecast strip with auto-scroll
│   │   ├── SparklineChart.tsx        # SVG temperature sparkline with draw-on animation
│   │   ├── DailyForecast.tsx         # 3-day forecast grid
│   │   └── FarmConditions.tsx        # 6-cell agronomic intelligence grid
│   └── ui/
│       ├── Card/                     # Reusable glass card wrapper
│       ├── Skeleton/                 # Shimmer loading placeholder
│       ├── Badge/                    # Severity pill (good/caution/warning)
│       ├── StatCell/                 # Metric label + value
│       ├── UnitToggle/               # °C/°F toggle
│       └── LogoComponent/            # FarmCast logo (unused in dashboard)
├── hooks/
│   ├── useWeather.ts                 # Weather data fetching with useReducer
│   ├── useGeolocation.ts             # Browser Geolocation API wrapper
│   ├── useWeatherSearch.ts           # Open-Meteo geocoding with debounce
│   ├── useFarmAlerts.ts              # Derives 0–6 farm alerts from API data
│   └── useUnitPreference.ts          # localStorage unit persistence
├── lib/
│   ├── weatherai.ts                  # Axios client with Bearer auth, interceptors
│   ├── validators.ts                 # Zod schemas for all 4 weather routes
│   ├── errors.ts                     # Error handler (Zod, Axios, generic)
│   └── weatherUtils.ts               # 9 pure formatting/derivation functions
├── style/
│   └── variable.css                  # Design tokens (colors, spacing, radius, shadows)
├── types/
│   └── weather.ts                    # TypeScript interfaces for all API responses
└── utils/
    └── scrollIntoview.ts             # Utility function (unused)
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build with TypeScript checking |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

Built by Mikenzie · Submitted for the WeatherAI Engineering Challenge
