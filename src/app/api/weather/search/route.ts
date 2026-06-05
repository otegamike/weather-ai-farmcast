import { NextRequest, NextResponse } from "next/server";
import weatherClient from "@/lib/weatherai";
import { searchWeatherSchema } from "@/lib/validators";
import { handleApiError } from "@/lib/errors";
import type { WeatherResponse } from "@/types/weather";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = searchWeatherSchema.parse({
      lat: searchParams.get("lat"),
      lon: searchParams.get("lon"),
      days: searchParams.get("days") || 3,
      units: searchParams.get("units") || "metric",
      lang: searchParams.get("lang") || "en",
      ai: searchParams.get("ai") || true,
    });

    console.log("[WeatherSearch] requesting...");

    const { data } = await weatherClient.get<WeatherResponse>("/v1/weather", { params });

    console.log("[WeatherSearch] request successful");

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("[WeatherSearch] request failed:", error instanceof Error ? error.message : error);
    return handleApiError(error);
  }
}
