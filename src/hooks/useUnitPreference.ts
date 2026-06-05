"use client";

import { useState, useCallback } from "react";

const STORAGE_KEY = "farmcast_unit";

export function useUnitPreference(): {
  unit: "metric" | "imperial";
  setUnit: (u: "metric" | "imperial") => void;
} {
  const [unit, setUnitState] = useState<"metric" | "imperial">(() => {
    if (typeof window === "undefined") return "metric";
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "metric" || stored === "imperial") return stored;
    return "metric";
  });

  const setUnit = useCallback((u: "metric" | "imperial") => {
    setUnitState(u);
    try {
      localStorage.setItem(STORAGE_KEY, u);
    } catch {
      // localStorage unavailable
    }
  }, []);

  return { unit, setUnit };
}
