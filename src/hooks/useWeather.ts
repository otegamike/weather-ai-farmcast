"use client";

import { useReducer, useEffect, useCallback, useRef } from "react";
import type { WeatherResponse } from "@/types/weather";

interface UseWeatherOptions {
  lat?: number;
  lon?: number;
  unit?: "metric" | "imperial";
  enabled?: boolean;
}

interface UseWeatherResult {
  data: WeatherResponse | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
}

type WeatherState = {
  data: WeatherResponse | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
};

type WeatherAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; data: WeatherResponse }
  | { type: "FETCH_ERROR"; error: string }
  | { type: "RESET" };

function weatherReducer(state: WeatherState, action: WeatherAction): WeatherState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true, isError: false, error: null };
    case "FETCH_SUCCESS":
      return { ...state, data: action.data, isLoading: false };
    case "FETCH_ERROR":
      return { ...state, isError: true, error: action.error, isLoading: false };
    default:
      return state;
  }
}

export function useWeather(options: UseWeatherOptions): UseWeatherResult {
  const { lat, lon, unit = "metric", enabled = true } = options;
  const [state, dispatch] = useReducer(weatherReducer, {
    data: null,
    isLoading: false,
    isError: false,
    error: null,
  });
  const fetchIdRef = useRef(0);

  const fetchWeather = useCallback(async (fetchId: number) => {
    try {
      let url: string;
      if (lat !== undefined && lon !== undefined) {
        url = `/api/weather/search?lat=${lat}&lon=${lon}&units=${unit}&days=3&ai=true`;
      } else {
        url = `/api/weather?units=${unit}&days=3&ai=true`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      const json: WeatherResponse = await res.json();

      if (fetchId === fetchIdRef.current) {
        dispatch({ type: "FETCH_SUCCESS", data: json });
      }
    } catch (err) {
      if (fetchId === fetchIdRef.current) {
        dispatch({
          type: "FETCH_ERROR",
          error: err instanceof Error ? err.message : "Failed to fetch weather data",
        });
      }
    }
  }, [lat, lon, unit]);

  useEffect(() => {
    if (!enabled) return;

    const id = ++fetchIdRef.current;
    dispatch({ type: "FETCH_START" });

    fetchWeather(id);
  }, [fetchWeather, enabled]);

  const refetch = useCallback(() => {
    const id = ++fetchIdRef.current;
    dispatch({ type: "FETCH_START" });
    fetchWeather(id);
  }, [fetchWeather]);

  return { ...state, refetch };
}
