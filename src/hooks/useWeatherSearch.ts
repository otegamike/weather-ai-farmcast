"use client";

import { useState, useCallback, useRef } from "react";

export interface Suggestion {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string;
  population?: number;
}

interface OpenMeteoResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string;
  population?: number;
}

interface UseWeatherSearchResult {
  suggestions: Suggestion[];
  isSearching: boolean;
  searchError: string | null;
  search: (query: string) => Promise<void>;
  clearSuggestions: () => void;
}

export function useWeatherSearch(): UseWeatherSearchResult {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const searchIdRef = useRef(0);

  const search = useCallback(async (query: string) => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      return;
    }

    const id = ++searchIdRef.current;
    setIsSearching(true);
    setSearchError(null);

    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=5&language=en&format=json`
      );

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.reason ?? "Geocoding request failed");
      }

      const data = await res.json();

      if (id !== searchIdRef.current) return;

      if (!data.results || data.results.length === 0) {
        setSuggestions([]);
        setSearchError("No locations found");
        setIsSearching(false);
        return;
      }

      const mapped: Suggestion[] = data.results.map((r: OpenMeteoResult) => ({
        name: r.name,
        latitude: r.latitude,
        longitude: r.longitude,
        country: r.country,
        country_code: r.country_code,
        admin1: r.admin1,
        population: r.population,
      }));

      setSuggestions(mapped);
      setSearchError(null);
    } catch (err) {
      if (id === searchIdRef.current) {
        setSearchError(err instanceof Error ? err.message : "Search failed");
        setSuggestions([]);
      }
    } finally {
      if (id === searchIdRef.current) {
        setIsSearching(false);
      }
    }
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setSearchError(null);
  }, []);

  return { suggestions, isSearching, searchError, search, clearSuggestions };
}
