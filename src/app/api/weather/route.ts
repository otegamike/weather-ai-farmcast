import { NextRequest, NextResponse } from "next/server";
import weatherClient from "@/lib/weatherai";
import { autoWeatherSchema } from "@/lib/validators";
import { handleApiError } from "@/lib/errors";
import type { WeatherResponse } from "@/types/weather";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = autoWeatherSchema.parse({
      days: searchParams.get("days"),
      units: searchParams.get("units"),
      lang: searchParams.get("lang"),
      ai: searchParams.get("ai"),
    });

    const requestParams = {
      ip: "auto",
      days: params.days,
      units: params.units,
      lang: params.lang,
      ai: params.ai,
    };

    console.log("\n[WeatherAuto] >>> Requesting /v1/weather-geo with params:", JSON.stringify(requestParams, null, 2));

    const { data } = await weatherClient.get<WeatherResponse>(
      "/v1/weather-geo",
      { params: requestParams },
    );

    console.log("\n[WeatherAuto] <<< Response data:", JSON.stringify(data, null, 2));

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("\n[WeatherAuto] !!! Error:", error);
    return handleApiError(error);
  }
}
