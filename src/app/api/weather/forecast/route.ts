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
      days: searchParams.get("days") || 7,
      units: searchParams.get("units") || "metric",
    });

    console.log("[WeatherForecast] requesting...");

    const { data } = await weatherClient.get("/v1/daily", { params });

    console.log("[WeatherForecast] request successful");

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
      },
    });
  } catch (error) {
    console.error("[WeatherForecast] request failed:", error instanceof Error ? error.message : error);
    return handleApiError(error);
  }
}
