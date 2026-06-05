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
      days: searchParams.get("days") || 1,
      units: searchParams.get("units") || "metric",
    });

    console.log("[WeatherHourly] requesting...");

    const { data } = await weatherClient.get("/v1/hourly", { params });

    console.log("[WeatherHourly] request successful");

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("[WeatherHourly] request failed:", error instanceof Error ? error.message : error);
    return handleApiError(error);
  }
}
