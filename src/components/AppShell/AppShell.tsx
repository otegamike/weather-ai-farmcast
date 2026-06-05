"use client";

import { useState, useCallback } from "react";
import WelcomePage from "@/components/welcome/WelcomePage";
import DashboardPage from "@/components/dashboard/DashboardPage";
import WelcomeVideo from "@/components/welcome/WelcomeVideo";
import { useUnitPreference } from "@/hooks/useUnitPreference";
import styles from "./AppShell.module.css";

type AppView = "welcome" | "transitioning" | "dashboard";

export default function AppShell() {
  const [view, setView] = useState<AppView>("welcome");
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [locationName, setLocationName] = useState<string>("");
  const { unit, setUnit } = useUnitPreference();

  const handleLocationSelect = useCallback(
    (selectedLat: number, selectedLon: number, name: string) => {
      setLat(selectedLat);
      setLon(selectedLon);
      setLocationName(name);
      setView("transitioning");

      setTimeout(() => {
        setView("dashboard");
      }, 600);
    },
    []
  );

  const handleSearchOpen = useCallback(() => {
    setView("welcome");
    setLat(null);
    setLon(null);
    setLocationName("");
  }, []);

  return (
    <div className={styles.shell}>
      <WelcomeVideo />
      <div
        className={`${styles.view} ${view === "dashboard" || view === "transitioning" ? styles.hidden : ""}`}
      >
        <WelcomePage
          onLocationSelect={handleLocationSelect}
          isExiting={view === "transitioning"}
        />
      </div>
      <div
        className={`${styles.view} ${view === "welcome" ? styles.hidden : ""}`}
      >
        <DashboardPage
          lat={lat}
          lon={lon}
          locationName={locationName}
          unit={unit}
          onUnitChange={setUnit}
          onSearchOpen={handleSearchOpen}
        />
      </div>
    </div>
  );
}
