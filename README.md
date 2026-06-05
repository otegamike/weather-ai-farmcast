# FarmCast

Farm weather intelligence app powered by [WeatherAI](https://weather-ai.co).
Hyper-local agronomic forecasts with AI-driven farm insights.

## Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** CSS Modules + global design tokens (`src/style/variable.css`)
- **Validation:** Zod 4
- **HTTP Client:** Axios
- **Fonts:** Playfair Display (headings), Hanken Grotesk (body), JetBrains Mono (data)
- **Icons:** Material Symbols
- **Geocoding:** Open-Meteo (free, no API key)
- **Deployment:** Vercel

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout: fonts, metadata, Material Symbols
│   ├── page.tsx                # Root page: renders <AppShell />
│   ├── global.css              # Global styles + .glass utility
│   ├── style/variable.css      # Design tokens (colors, spacing, radius, shadows)
│   └── api/                    # 5 backend API routes
│
├── components/
│   ├── AppShell/               # State machine: welcome → transitioning → dashboard
│   ├── welcome/                # Welcome page (video bg, search, geolocation)
│   ├── dashboard/              # Dashboard (hero, alerts, hourly, daily, farm conditions)
│   └── ui/                     # Reusable primitives (Card, Skeleton, Badge, etc.)
│
├── hooks/                      # 5 custom hooks (useWeather, useGeolocation, etc.)
├── lib/                        # Utilities + API client + validators
└── types/                      # TypeScript interfaces
```

## Frontend Features

| Feature | Components | Data Source |
|---|---|---|
| **Welcome Screen** | `WelcomeVideo`, `SearchInput`, `LocationButton` | Open-Meteo geocoding + browser Geolocation API |
| **Autocomplete Search** | `SearchInput` dropdown | Open-Meteo Geocoding API (300ms debounce, city + region + country) |
| **Current Conditions** | `HeroCard` with gradient background + stat grid | `current` from WeatherAPI |
| **AI Farm Insight** | `AIInsightPanel` with shimmer skeleton | `ai_summary` from WeatherAPI (Gemini-generated) |
| **Farm Alerts** | `AlertChips` (horizontal scrollable chips) | Derived from hourly/daily data |
| **Hourly Forecast** | `HourlyStrip` + `SparklineChart` (SVG) | `hourly` array (24 hours) |
| **Daily Forecast** | `DailyForecast` (3-day grid) | `daily` array |
| **Agronomic Intelligence** | `FarmConditions` (6-cell grid) | Derived from current + hourly + daily |

## Getting Started

1. Copy `.env.example` to `.env.local` and fill in your WeatherAI API key.
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`

## API Routes

| Route | Method | Description | Key Params |
|---|---|---|---|
| `/api/weather` | GET | Auto-detect location via IP | `days`, `units`, `ai` |
| `/api/weather/search` | GET | Weather by coordinates | `lat`, `lon`, `days`, `units`, `ai` |
| `/api/weather/forecast` | GET | Daily forecast only | `lat`, `lon`, `days` |
| `/api/weather/hourly` | GET | Hourly forecast only | `lat`, `lon`, `days` |
| `/api/usage` | GET | API quota stats | none |

## Design System

- **Dark theme** with "Earthy Precision" palette
- **CSS custom properties** in `src/style/variable.css` as single source of truth
- **Glassmorphism** cards via `.glass` utility / `Card` component
- **Animated grain overlay** for texture
- **Responsive:** mobile (<640px), tablet (640-1023px), desktop (>=1024px)

## Environment Variables

| Variable | Description |
|---|---|
| `WEATHER_AI_API_KEY` | Your WeatherAI API key, prefixed `wai_` |
| `WEATHER_AI_BASE_URL` | WeatherAI base URL, default `https://api.weather-ai.co` |
| `NEXT_PUBLIC_APP_URL` | Your app's public URL |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build with TypeScript checking |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
