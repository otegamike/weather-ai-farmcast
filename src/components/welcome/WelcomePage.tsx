"use client";

import { useCallback } from "react";
import WelcomeVideo from "./WelcomeVideo";
import SearchInput from "./SearchInput";
import LocationButton from "./LocationButton";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useWeatherSearch } from "@/hooks/useWeatherSearch";
import type { Suggestion } from "@/hooks/useWeatherSearch";
import styles from "./WelcomePage.module.css";
import Logo from "../ui/LogoComponent/LogoComponent";

interface WelcomePageProps {
  onLocationSelect: (lat: number, lon: number, name: string) => void;
  isExiting?: boolean;
}

export default function WelcomePage({ onLocationSelect, isExiting }: WelcomePageProps) {
  const geo = useGeolocation();
  const weatherSearch = useWeatherSearch();
  const { suggestions, isSearching, search } = weatherSearch;

  const handleSelectSuggestion = useCallback(
    (s: Suggestion) => {
      weatherSearch.clearSuggestions();
      onLocationSelect(s.latitude, s.longitude, s.name);
    },
    [onLocationSelect, weatherSearch]
  );

  const handleDetect = useCallback(() => {
    geo.trigger();
    if (geo.coords) {
      setTimeout(() => {
        onLocationSelect(geo.coords!.lat, geo.coords!.lon, "Your Location");
      }, 600);
    }
  }, [geo, onLocationSelect]);

  if (geo.coords && !geo.isLoading) {
    setTimeout(() => {
      onLocationSelect(geo.coords!.lat, geo.coords!.lon, "Your Location");
    }, 600);
  }

  const containerClass = `${styles.container} ${isExiting ? styles.exiting : ""}`;

  return (
    <div className={containerClass}>
      <div className={styles.headerLogo}>
        <Logo />
      </div>
      <WelcomeVideo />
      <div className={styles.content}>
        <div className={`${styles.stagger} ${styles.stagger1}`}>
          <div className={styles.badge}>
            <span className={styles.dot} />
            <span>LIVE FIELD DATA</span>
          </div>
        </div>
        <h1 className={`${styles.stagger} ${styles.stagger2} ${styles.headline}`}>
          Weather intelligence for the farm.
        </h1>
        <p className={`${styles.stagger} ${styles.stagger3} ${styles.subheadline}`}>
          Enter your location or allow auto-detection to receive hyper-local agronomic forecasts.
        </p>
        <div className={`${styles.stagger} ${styles.stagger4} ${styles.searchCard}`}>
          <SearchInput
            suggestions={suggestions}
            isSearching={isSearching}
            onSearch={search}
            onSelectSuggestion={handleSelectSuggestion}
          />
          <div className={styles.divider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerText}>or</span>
            <span className={styles.dividerLine} />
          </div>
          <LocationButton
            onDetect={handleDetect}
            isLoading={geo.isLoading}
            isSuccess={false}
          />
        </div>
      </div>
    </div>
  );
}
