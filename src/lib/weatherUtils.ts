import type { HourlyWeather } from "@/types/weather";

export function formatHour(isoTime: string): string {
  const date = new Date(isoTime);
  const hours = date.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  return `${h}${ampm}`;
}

export function formatTime(isoTime: string): string {
  const date = new Date(isoTime);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  const m = minutes.toString().padStart(2, "0");
  return `${h}:${m} ${ampm}`;
}

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function formatDayLabel(dateStr: string, index: number): string {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  const date = new Date(dateStr);
  return dayNames[date.getDay()];
}

const conditionLabels: Record<string, string> = {
  "0": "Clear Sky",
  "1": "Mainly Clear",
  "2": "Partly Cloudy",
  "3": "Overcast",
  "45": "Foggy",
  "48": "Depositing Rime Fog",
  "51": "Light Drizzle",
  "53": "Moderate Drizzle",
  "55": "Dense Drizzle",
  "56": "Light Freezing Drizzle",
  "57": "Dense Freezing Drizzle",
  "61": "Slight Rain",
  "63": "Moderate Rain",
  "65": "Heavy Rain",
  "66": "Light Freezing Rain",
  "67": "Heavy Freezing Rain",
  "71": "Slight Snow",
  "73": "Moderate Snow",
  "75": "Heavy Snow",
  "77": "Snow Grains",
  "80": "Slight Rain Showers",
  "81": "Moderate Rain Showers",
  "82": "Violent Rain Showers",
  "85": "Slight Snow Showers",
  "86": "Heavy Snow Showers",
  "95": "Thunderstorm",
  "96": "Thunderstorm with Slight Hail",
  "99": "Thunderstorm with Heavy Hail",
};

export function getConditionLabel(code: string): string {
  return conditionLabels[code] ?? "Unknown";
}

export function formatTemp(celsius: number, unit: "metric" | "imperial"): string {
  if (unit === "imperial") {
    return `${Math.round(celsius * 9 / 5 + 32)}°`;
  }
  return `${Math.round(celsius)}°`;
}

export function formatWind(kmh: number, unit: "metric" | "imperial"): string {
  if (unit === "imperial") {
    return `${(kmh * 0.621371).toFixed(1)} mph`;
  }
  return `${kmh?.toFixed(1) || 0} km/h`;
}

export function getUVLabel(uv: number): string {
  if (uv <= 2) return "Low";
  if (uv <= 5) return "Moderate";
  if (uv <= 7) return "High";
  if (uv <= 10) return "Very High";
  return "Extreme";
}

export function getConditionGradient(code: string, isNight: boolean): string {
  const codeNum = parseInt(code, 10);

  if (isNight) {
    return "linear-gradient(135deg, rgba(13,27,42,0.75) 0%, rgba(27,40,56,0.75) 50%, rgba(26,26,46,0.75) 100%)";
  }

  if (codeNum >= 95) {
    return "linear-gradient(135deg, rgba(45,27,27,0.75) 0%, rgba(74,42,42,0.75) 50%, rgba(61,30,30,0.75) 100%)";
  }

  if (codeNum >= 71 && codeNum <= 86) {
    return "linear-gradient(135deg, rgba(42,58,74,0.75) 0%, rgba(61,77,93,0.75) 50%, rgba(46,62,78,0.75) 100%)";
  }

  if (codeNum >= 51 && codeNum <= 67) {
    return "linear-gradient(135deg, rgba(42,58,42,0.75) 0%, rgba(61,77,61,0.75) 50%, rgba(46,62,46,0.75) 100%)";
  }

  if (codeNum >= 45) {
    return "linear-gradient(135deg, rgba(42,42,42,0.75) 0%, rgba(61,61,61,0.75) 50%, rgba(46,46,46,0.75) 100%)";
  }

  if (codeNum >= 3) {
    return "linear-gradient(135deg, rgba(42,58,42,0.75) 0%, rgba(61,77,61,0.75) 50%, rgba(46,62,46,0.75) 100%)";
  }

  if (codeNum >= 2) {
    return "linear-gradient(135deg, rgba(58,74,58,0.75) 0%, rgba(77,93,77,0.75) 50%, rgba(62,78,62,0.75) 100%)";
  }

  if (codeNum >= 1) {
    return "linear-gradient(135deg, rgba(65,61,30,0.75) 0%, rgba(45,90,39,0.75) 50%, rgba(101,61,30,0.75) 100%)";
  }

  return "linear-gradient(135deg, rgba(65,61,30,0.75) 0%, rgba(45,90,39,0.75) 50%, rgba(101,61,30,0.75) 100%)";
}

export function isCurrentHour(isoTime: string): boolean {
  const now = new Date();
  const target = new Date(isoTime);
  return (
    now.getFullYear() === target.getFullYear() &&
    now.getMonth() === target.getMonth() &&
    now.getDate() === target.getDate() &&
    now.getHours() === target.getHours()
  );
}

export function buildSparklinePath(
  hourly: HourlyWeather[],
  width: number,
  height: number
): string {
  if (hourly.length < 2) return "";

  const temps = hourly.map((h) => h.temperature);
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const range = max - min || 1;

  const padding = 4;
  const w = width - padding * 2;
  const h = height - padding * 2;

  const points = temps.map((t, i) => {
    const x = padding + (i / (temps.length - 1)) * w;
    const y = padding + ((max - t) / range) * h;
    return `${x},${y}`;
  });

  return `M${points.join(" L")}`;
}
