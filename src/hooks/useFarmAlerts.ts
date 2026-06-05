"use client";

import { useMemo } from "react";
import type { WeatherResponse } from "@/types/weather";

export interface FarmAlert {
  id: string;
  icon: string;
  text: string;
  severity: "good" | "caution" | "warning";
}

export function useFarmAlerts(data: WeatherResponse | null): FarmAlert[] {
  return useMemo(() => {
    if (!data) return [];

    const alerts: FarmAlert[] = [];
    const { current, hourly, daily } = data;
    let idCounter = 0;

    const nextId = () => `alert-${++idCounter}`;

    if (hourly && hourly.length > 0) {
      const rainHour = hourly.find((h) => h.precipitation_probability > 30);
      if (rainHour) {
        const rainTime = new Date(rainHour.time);
        const timeStr = `${rainTime.getHours() % 12 || 12}${rainTime.getHours() >= 12 ? "PM" : "AM"}`;
        alerts.push({
          id: nextId(),
          icon: "water_drop",
          text: `Rain likely after ${timeStr} — cover crops`,
          severity: "caution",
        });
      }

      const highUVHour = hourly.find((h) => h.uv_index > 6);
      if (highUVHour) {
        alerts.push({
          id: nextId(),
          icon: "wb_sunny",
          text: "High UV — limit fieldwork",
          severity: "caution",
        });
      }

      const gustHour = hourly.find((h) => h.wind_gust > 25);
      if (gustHour) {
        alerts.push({
          id: nextId(),
          icon: "air",
          text: "Strong gusts expected — secure structures",
          severity: "warning",
        });
      }

      const morningHours = hourly.filter((h) => {
        const hour = new Date(h.time).getHours();
        return hour >= 6 && hour <= 10;
      });
      const goodSprayWindow = morningHours.some(
        (h) => h.wind_speed < 5 && h.precipitation_probability < 10
      );
      if (goodSprayWindow) {
        alerts.push({
          id: nextId(),
          icon: "check_circle",
          text: "Good spraying window: 6–10AM",
          severity: "good",
        });
      }
    }

    if (current) {
      const nearestHour = hourly?.[0];
      if (nearestHour && nearestHour.humidity > 85 && current.temperature > 18) {
        alerts.push({
          id: nextId(),
          icon: "bug_report",
          text: "High pest pressure conditions",
          severity: "warning",
        });
      }
    }

    if (daily && daily.length > 0) {
      if (daily[0].temp_min < 4) {
        alerts.push({
          id: nextId(),
          icon: "ac_unit",
          text: "Frost risk tonight — protect crops",
          severity: "warning",
        });
      }
    }

    return alerts;
  }, [data]);
}
