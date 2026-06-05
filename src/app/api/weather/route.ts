import { NextRequest, NextResponse } from "next/server";
import weatherClient from "@/lib/weatherai";
import { autoWeatherSchema } from "@/lib/validators";
import { handleApiError } from "@/lib/errors";
import type { WeatherResponse } from "@/types/weather";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = autoWeatherSchema.parse({
      days: searchParams.get("days") || 3,
      units: searchParams.get("units") || 'metric',
      lang: searchParams.get("lang") || 'en',
      ai: searchParams.get("ai") || true,
    });

    const requestParams = {
      ip: "auto",
      days: params.days,
      units: params.units,
      lang: params.lang,
      ai: params.ai,
    };

    console.log("[WeatherAuto] requesting...");

    const { data } = await weatherClient.get<WeatherResponse>(
      "/v1/weather-geo",
      { params: requestParams },
    );

    console.log("[WeatherAuto] request successful");

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("[WeatherAuto] request failed:", error instanceof Error ? error.message : error);
    return handleApiError(error);
  }
}
