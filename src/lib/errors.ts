import { AxiosError } from "axios";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Invalid request parameters",
        details: error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  if (error instanceof AxiosError) {
    const status = error.response?.status ?? 502;
    const message = error.response?.data?.message ?? "Upstream API error";

    return NextResponse.json(
      { error: message, upstream_status: status },
      { status },
    );
  }

  console.error("[FarmCast] request failed:", error instanceof Error ? error.message : error);

  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
