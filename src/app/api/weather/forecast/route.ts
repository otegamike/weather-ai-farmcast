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

    console.log("\n[WeatherForecast] >>> Requesting /v1/daily with params:", JSON.stringify(params, null, 2));

    const { data } = await weatherClient.get("/v1/daily", { params });

    console.log("\n[WeatherForecast] <<< Response data:", JSON.stringify(data, null, 2));

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
      },
    });
  } catch (error) {
    console.error("\n[WeatherForecast] !!! Error:", error);
    return handleApiError(error);
  }
}
