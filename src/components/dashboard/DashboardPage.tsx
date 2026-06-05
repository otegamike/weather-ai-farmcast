"use client";

import { useWeather } from "@/hooks/useWeather";
import { useFarmAlerts } from "@/hooks/useFarmAlerts";
import DashboardHeader from "./DashboardHeader";
import HeroCard from "./HeroCard";
import AIInsightPanel from "./AIInsightPanel";
import AlertChips from "./AlertChips";
import HourlyStrip from "./HourlyStrip";
import DailyForecast from "./DailyForecast";
import FarmConditions from "./FarmConditions";
import Skeleton from "@/components/ui/Skeleton/Skeleton";
import styles from "./DashboardPage.module.css";

interface DashboardPageProps {
  lat: number | null;
  lon: number | null;
  locationName: string;
  unit: "metric" | "imperial";
  onUnitChange: (u: "metric" | "imperial") => void;
  onSearchOpen: () => void;
}

export default function DashboardPage({
  lat,
  lon,
  locationName,
  unit,
  onUnitChange,
  onSearchOpen,
}: DashboardPageProps) {
  const { data, isLoading, isError, error, refetch } = useWeather({
    lat: lat ?? undefined,
    lon: lon ?? undefined,
    unit,
    enabled: true,
  });

  const alerts = useFarmAlerts(data);

  if (isError) {
    return (
      <div className={styles.container}>
        <DashboardHeader
          locationName={locationName}
          unit={unit}
          onUnitChange={onUnitChange}
          onSearchOpen={onSearchOpen}
        />
        <div className={styles.errorContainer}>
          <span className="material-symbols-outlined">cloud_off</span>
          <h2 className={styles.errorTitle}>Couldn&apos;t load weather data.</h2>
          <p className={styles.errorMessage}>{error}</p>
          <button className={styles.retryBtn} onClick={refetch}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <DashboardHeader
        locationName={data?.location?.country ?? locationName}
        unit={unit}
        onUnitChange={onUnitChange}
        onSearchOpen={onSearchOpen}
      />
      <main className={styles.main}>
        {isLoading ? (
          <div className={styles.skeletonGroup}>
            <Skeleton width="100%" height="200px" borderRadius="var(--radius-md)" />
            <Skeleton width="100%" height="120px" borderRadius="var(--radius-md)" />
            <div className={styles.skeletonRow}>
              <Skeleton width="100%" height="80px" borderRadius="var(--radius-pill)" />
            </div>
            <Skeleton width="100%" height="100px" borderRadius="var(--radius-md)" />
            <div className={styles.skeletonGrid3}>
              <Skeleton width="100%" height="220px" borderRadius="var(--radius-md)" />
              <Skeleton width="100%" height="220px" borderRadius="var(--radius-md)" />
              <Skeleton width="100%" height="220px" borderRadius="var(--radius-md)" />
            </div>
            <div className={styles.skeletonGrid2}>
              <Skeleton width="100%" height="140px" borderRadius="var(--radius-md)" />
              <Skeleton width="100%" height="140px" borderRadius="var(--radius-md)" />
              <Skeleton width="100%" height="140px" borderRadius="var(--radius-md)" />
              <Skeleton width="100%" height="140px" borderRadius="var(--radius-md)" />
              <Skeleton width="100%" height="140px" borderRadius="var(--radius-md)" />
              <Skeleton width="100%" height="140px" borderRadius="var(--radius-md)" />
            </div>
          </div>
        ) : data ? (
          <>
            <section className={styles.heroSection}>
              <div className={styles.heroCol}>
                <HeroCard current={data.current} daily={data.daily[0]} unit={unit} />
              </div>
              <div className={styles.aiCol}>
                <AIInsightPanel
                  summary={data.ai_summary}
                  isLoading={false}
                />
              </div>
            </section>
            <AlertChips alerts={alerts} />
            <HourlyStrip hourly={data.hourly} unit={unit} />
            <DailyForecast daily={data.daily} unit={unit} />
            <FarmConditions data={data} />
          </>
        ) : null}
      </main>
    </div>
  );
}
