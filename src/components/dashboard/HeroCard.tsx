"use client";

import type { CurrentWeather, DailyWeather } from "@/types/weather";
import StatCell from "@/components/ui/StatCell/StatCell";
import {
  formatTemp,
  formatWind,
  getConditionLabel,
  getConditionGradient,
} from "@/lib/weatherUtils";
import styles from "./HeroCard.module.css";

function degToCompass(deg: number): string {
  const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}

interface HeroCardProps {
  current: CurrentWeather;
  daily: DailyWeather;
  unit: "metric" | "imperial";
}

export default function HeroCard({ current, daily, unit }: HeroCardProps) {
  const now = new Date();

  const gradient = getConditionGradient(current.condition_code, false);

  const statData = [
    { label: "WIND", value: formatWind(current.wind_speed, unit) },
    { label: "WIND DIR", value: `${current.wind_direction}° ${degToCompass(current.wind_direction)}` },
  ];

  return (
    <div
      className={styles.card}
      style={{ background: gradient, backgroundSize: "200% 200%" }}
    >
      <div className={styles.mainRow}>
        <div className={styles.left}>
          <img
            src={current.icon}
            alt={getConditionLabel(current.condition_code)}
            className={styles.icon}
          />
          <span className={styles.conditionLabel}>
            {getConditionLabel(current.condition_code)}
          </span>
          <div className={styles.tempRow}>
            <span className={styles.temp}>{formatTemp(current.temperature, unit)}</span>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.statGrid}>
            {statData.map((s) => (
              <StatCell key={s.label} label={s.label} value={s.value} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
