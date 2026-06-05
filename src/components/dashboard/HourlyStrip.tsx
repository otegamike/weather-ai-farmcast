"use client";

import type { HourlyWeather } from "@/types/weather";
import { formatHour, formatTemp, isCurrentHour } from "@/lib/weatherUtils";
import SparklineChart from "./SparklineChart";
import styles from "./HourlyStrip.module.css";

interface HourlyStripProps {
  hourly: HourlyWeather[];
  unit: "metric" | "imperial";
}

export default function HourlyStrip({ hourly, unit }: HourlyStripProps) {
  const next24 = hourly.slice(0, 24);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Hourly Forecast</h2>
        <div className={styles.sparklineLabel}>
          <span className="material-symbols-outlined">trending_up</span>
          <span>TEMP SPARKLINE</span>
        </div>
      </div>
      <div className={styles.sparklineWrapper}>
        <SparklineChart hourly={next24} width={1000} height={40} />
      </div>
      <div className={styles.strip}>
        {next24.map((h, i) => (
          <HourlyCard key={h.time} hour={h} unit={unit} index={i} />
        ))}
      </div>
    </section>
  );
}

function HourlyCard({ hour, unit, index }: { hour: HourlyWeather; unit: "metric" | "imperial"; index: number }) {
  const current = isCurrentHour(hour.time);
  const precipProb = hour.precipitation_probability ?? 0;
  const barColor = precipProb > 60
    ? "var(--color-warning)"
    : precipProb > 30
    ? "var(--color-caution)"
    : "var(--color-primary)";

  return (
    <div
      className={`${styles.card} ${current ? styles.current : ""}`}
      style={{ animationDelay: `${index * 20}ms` }}
    >
      <span className={styles.time}>{index === 0 ? "Now" : formatHour(hour.time)}</span>
      <img src={hour.icon} alt="" className={styles.icon} />
      <span className={`${styles.temp} ${current ? styles.currentTemp : ""}`}>
        {formatTemp(hour.temperature, unit)}
      </span>
      <div className={styles.rainGroup}>
        <span className="material-symbols-outlined">water_drop</span>
        <span className={styles.rainPct}>{precipProb}%</span>
      </div>
      <div className={styles.barTrack}>
        <div
          className={styles.barFill}
          style={{
            width: `${Math.min(precipProb, 100)}%`,
            background: barColor,
          }}
        />
      </div>
    </div>
  );
}
