import { NextResponse } from "next/server";
import weatherClient from "@/lib/weatherai";
import { handleApiError } from "@/lib/errors";
import type { UsageResponse } from "@/types/weather";

export async function GET() {
  try {
    const { data } = await weatherClient.get<UsageResponse>("/v1/usage");

    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
