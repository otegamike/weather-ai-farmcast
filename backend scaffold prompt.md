# FarmCast — Backend Scaffold Prompt

You are scaffolding the backend of **FarmCast**, a farm weather intelligence web app built with **Next.js 15** (App Router) and deployed on **Vercel**. This prompt covers only the backend: project setup, dependencies, environment config, and all API route handlers. Do not build any frontend yet.

---

## 1. Project Initialization

Bootstrap a new Next.js 15 app with the following options:

```bash
npx create-next-app@latest farmcast \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-turbopack
```

> Use `--no-turbopack` explicitly. Do NOT enable Turbopack.

Move into the project directory:

```bash
cd farmcast
```

---

## 2. Install Dependencies

Install the following packages:

```bash
npm install zod axios
npm install -D @types/node
```

**Why each package:**
- `zod` — runtime validation and type inference for all API request params and responses
- `axios` — HTTP client for proxying requests to the WeatherAI API from server routes

No additional weather SDKs. All WeatherAI calls are raw HTTP via axios.

---

## 3. Environment Variables

Create a `.env.local` file in the project root:

```env
# WeatherAI API
WEATHER_AI_API_KEY=wai_your_key_here
WEATHER_AI_BASE_URL=https://api.weather-ai.co

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Create a `.env.example` file (safe to commit):

```env
WEATHER_AI_API_KEY=
WEATHER_AI_BASE_URL=https://api.weather-ai.co
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Add `.env.local` to `.gitignore` (it should already be there from create-next-app, but verify).

---

## 4. Project Structure

Set up the following folder structure under `src/`:

```
src/
├── app/
│   └── api/
│       ├── weather/
│       │   └── route.ts          # Auto-detect weather via IP
│       ├── weather/search/
│       │   └── route.ts          # Weather by lat/lon or city search
│       ├── weather/forecast/
│       │   └── route.ts          # Extended forecast (daily breakdown)
│       ├── weather/hourly/
│       │   └── route.ts          # Hourly forecast for current day
│       └── usage/
│           └── route.ts          # API quota/usage stats
├── lib/
│   ├── weatherai.ts              # Axios client + shared fetch helper
│   ├── validators.ts             # Zod schemas for all request params
│   └── errors.ts                 # Shared error handler utility
└── types/
    └── weather.ts                # TypeScript types for all API responses
```

---

## 5. Shared WeatherAI Axios Client

**File: `src/lib/weatherai.ts`**

Create an axios instance configured with the WeatherAI base URL and Authorization header:

```typescript
import axios from "axios";

const weatherClient = axios.create({
  baseURL: process.env.WEATHER_AI_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.WEATHER_AI_API_KEY}`,
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default weatherClient;
```

---

## 6. Zod Validators

**File: `src/lib/validators.ts`**

Define Zod schemas for every route's query params:

```typescript
import { z } from "zod";

// For /api/weather — auto-detect via IP
export const autoWeatherSchema = z.object({
  days: z.coerce.number().int().min(1).max(7).optional().default(3),
  units: z.enum(["metric", "imperial"]).optional().default("metric"),
  lang: z.string().optional().default("en"),
  ai: z.coerce.boolean().optional().default(true),
});

// For /api/weather/search — manual lat/lon
export const searchWeatherSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180),
  days: z.coerce.number().int().min(1).max(7).optional().default(3),
  units: z.enum(["metric", "imperial"]).optional().default("metric"),
  lang: z.string().optional().default("en"),
  ai: z.coerce.boolean().optional().default(true),
});

// For /api/weather/forecast — daily breakdown
export const forecastSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180),
  days: z.coerce.number().int().min(1).max(7).optional().default(7),
  units: z.enum(["metric", "imperial"]).optional().default("metric"),
});

// For /api/weather/hourly — hourly breakdown
export const hourlySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180),
  days: z.coerce.number().int().min(1).max(2).optional().default(1),
  units: z.enum(["metric", "imperial"]).optional().default("metric"),
});
```

---

## 7. Shared Error Handler

**File: `src/lib/errors.ts`**

```typescript
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AxiosError } from "axios";

export function handleApiError(error: unknown): NextResponse {
  // Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Invalid request parameters",
        details: error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  // Axios / WeatherAI upstream errors
  if (error instanceof AxiosError) {
    const status = error.response?.status ?? 502;
    const message = error.response?.data?.message ?? "Upstream API error";
    return NextResponse.json(
      { error: message, upstream_status: status },
      { status }
    );
  }

  // Unknown errors
  console.error("[FarmCast API Error]", error);
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}
```

---

## 8. TypeScript Types

**File: `src/types/weather.ts`**

Define the full response shape based on the WeatherAI API:

```typescript
export interface WeatherLocation {
  lat: number;
  lon: number;
  timezone: string;
  country: string;
  requested_lat?: number;
  requested_lon?: number;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_direction: number;
  wind_gust: number;
  uv_index: number;
  condition_code: string;
  icon: string;
  icon_path: string;
}

export interface HourlyWeather {
  time: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_gust: number;
  uv_index: number;
  precipitation_probability: number;
  condition_code: string;
  icon: string;
  icon_path: string;
}

export interface DailyWeather {
  date: string;
  temp_min: number;
  temp_max: number;
  precipitation_sum: number;
  precipitation_probability: number;
  wind_max: number;
  sunrise: string;
  sunset: string;
  condition_code: string;
  icon: string;
  icon_path: string;
}

export interface WeatherResponse {
  location: WeatherLocation;
  current: CurrentWeather;
  hourly: HourlyWeather[];
  daily: DailyWeather[];
  ai_summary?: string;
  client_geo?: {
    country: string;
    ip_hash: string;
  };
}

export interface UsageResponse {
  plan: string;
  requests_used: number;
  requests_limit: number;
  requests_remaining: number;
  ai_requests_used: number;
  ai_requests_limit: number;
  period_start: string;
  period_end: string;
}
```

---

## 9. API Route Handlers

### Route 1: `GET /api/weather`
**File: `src/app/api/weather/route.ts`**

Auto-detects the user's location from their IP using WeatherAI's `/v1/weather-geo` endpoint, then returns full current + hourly + daily data.

```typescript
import { NextRequest, NextResponse } from "next/server";
import weatherClient from "@/lib/weatherai";
import { autoWeatherSchema } from "@/lib/validators";
import { handleApiError } from "@/lib/errors";
import { WeatherResponse } from "@/types/weather";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = autoWeatherSchema.parse({
      days: searchParams.get("days"),
      units: searchParams.get("units"),
      lang: searchParams.get("lang"),
      ai: searchParams.get("ai"),
    });

    const { data } = await weatherClient.get<WeatherResponse>(
      "/v1/weather-geo",
      {
        params: {
          ip: "auto",
          days: params.days,
          units: params.units,
          lang: params.lang,
          ai: params.ai,
        },
      }
    );

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
```

---

### Route 2: `GET /api/weather/search`
**File: `src/app/api/weather/search/route.ts`**

Accepts `lat` and `lon` query params and returns full weather data for that location.

```typescript
import { NextRequest, NextResponse } from "next/server";
import weatherClient from "@/lib/weatherai";
import { searchWeatherSchema } from "@/lib/validators";
import { handleApiError } from "@/lib/errors";
import { WeatherResponse } from "@/types/weather";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = searchWeatherSchema.parse({
      lat: searchParams.get("lat"),
      lon: searchParams.get("lon"),
      days: searchParams.get("days"),
      units: searchParams.get("units"),
      lang: searchParams.get("lang"),
      ai: searchParams.get("ai"),
    });

    const { data } = await weatherClient.get<WeatherResponse>("/v1/weather", {
      params,
    });

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
```

---

### Route 3: `GET /api/weather/forecast`
**File: `src/app/api/weather/forecast/route.ts`**

Returns the daily forecast breakdown for a given location.

```typescript
import { NextRequest, NextResponse } from "next/server";
import weatherClient from "@/lib/weatherai";
import { forecastSchema } from "@/lib/validators";
import { handleApiError } from "@/lib/errors";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = forecastSchema.parse({
      lat: searchParams.get("lat"),
      lon: searchParams.get("lon"),
      days: searchParams.get("days"),
      units: searchParams.get("units"),
    });

    const { data } = await weatherClient.get("/v1/daily", { params });

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
```

---

### Route 4: `GET /api/weather/hourly`
**File: `src/app/api/weather/hourly/route.ts`**

Returns the hourly forecast breakdown for a given location.

```typescript
import { NextRequest, NextResponse } from "next/server";
import weatherClient from "@/lib/weatherai";
import { hourlySchema } from "@/lib/validators";
import { handleApiError } from "@/lib/errors";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = hourlySchema.parse({
      lat: searchParams.get("lat"),
      lon: searchParams.get("lon"),
      days: searchParams.get("days"),
      units: searchParams.get("units"),
    });

    const { data } = await weatherClient.get("/v1/hourly", { params });

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
```

---

### Route 5: `GET /api/usage`
**File: `src/app/api/usage/route.ts`**

Returns the current API quota usage for the WeatherAI account. Useful for a developer debug panel or internal monitoring.

```typescript
import { NextResponse } from "next/server";
import weatherClient from "@/lib/weatherai";
import { handleApiError } from "@/lib/errors";
import { UsageResponse } from "@/types/weather";

export async function GET() {
  try {
    const { data } = await weatherClient.get<UsageResponse>("/v1/usage");
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
```

---

## 10. next.config.ts

Update `next.config.ts` to allowlist the WeatherAI CDN for remote images (the condition icons come from `cdn.weather-ai.co`):

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.weather-ai.co",
        pathname: "/icons/**",
      },
    ],
  },
};

export default nextConfig;
```

---

## 11. Vercel Configuration

Create a `vercel.json` in the project root to configure function memory and region:

```json
{
  "functions": {
    "src/app/api/**": {
      "memory": 512,
      "maxDuration": 10
    }
  },
  "regions": ["iad1"]
}
```

> 512MB is sufficient for pure HTTP proxy routes. No heavy compute happening server-side.

---

## 12. README.md

Replace the default README with:

```markdown
# FarmCast

Farm weather intelligence app powered by [WeatherAI](https://weather-ai.co).

## Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Validation:** Zod
- **HTTP Client:** Axios
- **Deployment:** Vercel

## Getting Started

1. Clone the repo
2. Copy `.env.example` to `.env.local` and fill in your WeatherAI API key
3. Install dependencies: `npm install`
4. Run dev server: `npm run dev`

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/weather` | GET | Auto-detect location via IP + full weather data |
| `/api/weather/search` | GET | Weather by `lat` & `lon` |
| `/api/weather/forecast` | GET | Daily forecast breakdown |
| `/api/weather/hourly` | GET | Hourly forecast breakdown |
| `/api/usage` | GET | WeatherAI API quota stats |

## Environment Variables

| Variable | Description |
|---|---|
| `WEATHER_AI_API_KEY` | Your WeatherAI API key (prefixed `wai_`) |
| `WEATHER_AI_BASE_URL` | WeatherAI base URL (default: `https://api.weather-ai.co`) |
| `NEXT_PUBLIC_APP_URL` | Your app's public URL |
```

---

## 13. Final Checklist

Before handing off or committing, verify:

- [ ] `.env.local` is in `.gitignore`
- [ ] All 5 API routes return JSON with correct status codes
- [ ] Zod validation rejects bad params with 400 errors
- [ ] Axios errors from WeatherAI are forwarded with their original status codes
- [ ] `next.config.ts` includes the CDN image domain
- [ ] `vercel.json` is present with function config
- [ ] `npm run build` passes with no TypeScript errors
- [ ] Test each route manually with `curl` or a REST client before building the frontend
