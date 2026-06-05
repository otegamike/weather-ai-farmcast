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
      days: searchParams.get("days"),
      units: searchParams.get("units") || "metric",
      lang: searchParams.get("lang") || "en",
      ai: searchParams.get("ai"),
    });

    console.log("\n[WeatherSearch] >>> Requesting /v1/weather with params:", JSON.stringify(params, null, 2));

    const { data } = await weatherClient.get<WeatherResponse>("/v1/weather", { params });

    console.log("\n[WeatherSearch] <<< Response data:", JSON.stringify(data, null, 2));

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("\n[WeatherSearch] !!! Error:", error);
    return handleApiError(error);
  }
}
