"use client";

import { useState, useCallback } from "react";

interface UseGeolocationResult {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  coords: { lat: number; lon: number } | null;
  trigger: () => void;
}

export function useGeolocation(): UseGeolocationResult {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  const trigger = useCallback(() => {
    if (!navigator.geolocation) {
      setIsError(true);
      setErrorMessage("Geolocation is not supported by this browser");
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        setIsError(true);
        setIsLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setErrorMessage("Location permission denied");
            break;
          case error.POSITION_UNAVAILABLE:
            setErrorMessage("Location unavailable");
            break;
          case error.TIMEOUT:
            setErrorMessage("Location request timed out");
            break;
          default:
            setErrorMessage("Failed to get location");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  return { isLoading, isError, errorMessage, coords, trigger };
}
