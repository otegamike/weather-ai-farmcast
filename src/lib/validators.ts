import { z } from "zod";

export const autoWeatherSchema = z.object({
  days: z.coerce.number().int().min(1).max(7).optional().default(3),
  units: z.enum(["metric", "imperial"]).optional().default("metric"),
  lang: z.string().optional().default("en"),
  ai: z.coerce.boolean().optional().default(true),
});

export const searchWeatherSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180),
  days: z.coerce.number().int().min(1).max(7).optional().default(3),
  units: z.enum(["metric", "imperial"]).optional().default("metric"),
  lang: z.string().optional().default("en"),
  ai: z.coerce.boolean().optional().default(true),
});

export const forecastSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180),
  days: z.coerce.number().int().min(1).max(7).optional().default(7),
  units: z.enum(["metric", "imperial"]).optional().default("metric"),
});

export const hourlySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180),
  days: z.coerce.number().int().min(1).max(2).optional().default(1),
  units: z.enum(["metric", "imperial"]).optional().default("metric"),
});
