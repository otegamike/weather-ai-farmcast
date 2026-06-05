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

    console.log("\n[WeatherHourly] >>> Requesting /v1/hourly with params:", JSON.stringify(params, null, 2));

    const { data } = await weatherClient.get("/v1/hourly", { params });

    console.log("\n[WeatherHourly] <<< Response data:", JSON.stringify(data, null, 2));

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("\n[WeatherHourly] !!! Error:", error);
    return handleApiError(error);
  }
}
