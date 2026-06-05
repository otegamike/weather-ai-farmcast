"use client";

import type { CurrentWeather, DailyWeather } from "@/types/weather";
import StatCell from "@/components/ui/StatCell/StatCell";
import {
  formatTemp,
  formatWind,
  getConditionLabel,
  getConditionGradient,
  getUVLabel,
  formatTime,
} from "@/lib/weatherUtils";
import styles from "./HeroCard.module.css";

interface HeroCardProps {
  current: CurrentWeather;
  daily: DailyWeather;
  unit: "metric" | "imperial";
}

export default function HeroCard({ current, daily, unit }: HeroCardProps) {
  const now = new Date();
  const sunriseDate = new Date(daily.sunrise);
  const sunsetDate = new Date(daily.sunset);
  const totalDay = sunsetDate.getTime() - sunriseDate.getTime();
  const elapsed = now.getTime() - sunriseDate.getTime();
  const sunPosition = totalDay > 0 ? Math.min(Math.max(elapsed / totalDay, 0), 1) : 0.5;
  const isNight = now < sunriseDate || now > sunsetDate;

  const gradient = getConditionGradient(current.condition_code, isNight);

  const statData = [
    { label: "HUMIDITY", value: `${current.humidity}%` },
    { label: "WIND", value: formatWind(current.wind_speed, unit) },
    { label: "GUSTS", value: formatWind(current.wind_gust, unit) },
    { label: "UV INDEX", value: `${current.uv_index} · ${getUVLabel(current.uv_index)}` },
  ];

  const sunriseStr = formatTime(daily.sunrise);
  const sunsetStr = formatTime(daily.sunset);

  const arcX = 10 + sunPosition * 100;
  const arcY = 10 - Math.sin(sunPosition * Math.PI) * 8;

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
            <span className={styles.feelsLike}>Feels like {formatTemp(current.feels_like, unit)}</span>
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
      <div className={styles.bottomStrip}>
        <div className={styles.sunInfo}>
          <div className={styles.sunArcContainer}>
            <svg width="120" height="40" viewBox="0 0 120 40" className={styles.sunArcSvg}>
              <path
                d="M10,35 Q60,0 110,35"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <circle cx={arcX} cy={arcY} r="4" fill="var(--color-secondary)">
                <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>
          <div className={styles.sunTimes}>
            <div className={styles.sunTimeItem}>
              <span className="material-symbols-outlined">wb_twilight</span>
              <span>{sunriseStr}</span>
              <span className={styles.sunLabel}>SUNRISE</span>
            </div>
            <div className={styles.sunTimeItem}>
              <span className="material-symbols-outlined">wb_twilight</span>
              <span>{sunsetStr}</span>
              <span className={styles.sunLabel}>SUNSET</span>
            </div>
          </div>
        </div>
        <span className={styles.dateText}>
          {now.toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
