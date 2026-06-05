"use client";

import type { DailyWeather } from "@/types/weather";
import {
  formatDayLabel,
  formatTemp,
  formatWind,
  getConditionLabel,
  formatTime,
} from "@/lib/weatherUtils";
import styles from "./DailyForecast.module.css";

interface DailyForecastProps {
  daily: DailyWeather[];
  unit: "metric" | "imperial";
}

export default function DailyForecast({ daily, unit }: DailyForecastProps) {
  const days = daily.slice(0, 3);

  return (
    <section className={styles.grid}>
      {days.map((d, i) => (
        <DailyCard key={d.date} day={d} unit={unit} index={i} />
      ))}
    </section>
  );
}

function DailyCard({ day, unit, index }: { day: DailyWeather; unit: "metric" | "imperial"; index: number }) {
  return (
    <div className={`${styles.card} ${index === 0 ? styles.today : ""}`}>
      <div className={styles.cardHeader}>
        <span className={styles.dayLabel}>{formatDayLabel(day.date, index)}</span>
        <span className={styles.dateLabel}>
          {new Date(day.date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
        </span>
      </div>
      <img src={day.icon} alt="" className={styles.icon} />
      <span className={styles.condition}>{getConditionLabel(day.condition_code)}</span>
      <div className={styles.tempRange}>
        <span className={styles.high}>{formatTemp(day.temp_max, unit)}</span>
        <span className={styles.slash}>/</span>
        <span className={styles.low}>{formatTemp(day.temp_min, unit)}</span>
      </div>
      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Rain</span>
          <span className={styles.statValue}>{day.precipitation_probability}%</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Precip</span>
          <span className={styles.statValue}>{day.precipitation_sum.toFixed(1)}mm</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Wind</span>
          <span className={styles.statValue}>{formatWind(day.wind_max, unit)}</span>
        </div>
      </div>
      <div className={styles.sunRow}>
        <span className="material-symbols-outlined">wb_twilight</span>
        <span className={styles.sunTime}>{formatTime(day.sunrise)}</span>
        <span className={styles.sunTime}>{formatTime(day.sunset)}</span>
      </div>
    </div>
  );
}
