"use client";

import type { WeatherResponse } from "@/types/weather";
import Badge from "@/components/ui/Badge/Badge";
import styles from "./FarmConditions.module.css";

interface FarmConditionsProps {
  data: WeatherResponse;
}

interface ConditionCell {
  icon: string;
  label: string;
  badgeText: string;
  severity: "good" | "caution" | "warning";
  explanation: string;
}

export default function FarmConditions({ data }: FarmConditionsProps) {
  const { current, hourly, daily } = data;

  const cells: ConditionCell[] = [];

  const morningHours = hourly.filter((h) => {
    const hour = new Date(h.time).getHours();
    return hour >= 5 && hour <= 10;
  });

  const goodIrrigation = morningHours.filter((h) => h.precipitation_probability < 10);
  if (goodIrrigation.length > 0) {
    const start = new Date(goodIrrigation[0].time).getHours();
    const end = new Date(goodIrrigation[goodIrrigation.length - 1].time).getHours();
    cells.push({
      icon: "water_drop",
      label: "Best Irrigation Window",
      badgeText: `${start % 12 || 12}${start >= 12 ? "PM" : "AM"} – ${end % 12 || 12}${end >= 12 ? "PM" : "AM"}`,
      severity: "good",
      explanation: "Low precipitation probability in morning hours",
    });
  } else {
    cells.push({
      icon: "water_drop",
      label: "Best Irrigation Window",
      badgeText: "Not recommended today",
      severity: "caution",
      explanation: "High rain probability all morning",
    });
  }

  const goodSpray = hourly.filter((h) => {
    const hour = new Date(h.time).getHours();
    return h.wind_speed < 5 && h.precipitation_probability < 10 && hour >= 6 && hour <= 18;
  });
  if (goodSpray.length > 0) {
    const start = new Date(goodSpray[0].time).getHours();
    const end = new Date(goodSpray[goodSpray.length - 1].time).getHours();
    cells.push({
      icon: "spray",
      label: "Best Spray Window",
      badgeText: `${start % 12 || 12}${start >= 12 ? "PM" : "AM"} – ${end % 12 || 12}${end >= 12 ? "PM" : "AM"}`,
      severity: "good",
      explanation: "Low wind and no rain expected",
    });
  } else {
    cells.push({
      icon: "spray",
      label: "Best Spray Window",
      badgeText: "Conditions unfavorable",
      severity: "caution",
      explanation: "High wind or rain expected",
    });
  }

  const pestHumidity = hourly.length > 0 ? hourly[0].humidity : 0;
  const pestTemp = current.temperature;
  if (pestHumidity > 85 && pestTemp > 20) {
    cells.push({
      icon: "bug_report",
      label: "Pest Pressure Risk",
      badgeText: "High",
      severity: "warning",
      explanation: `Based on humidity ${pestHumidity}% and ${pestTemp}°C`,
    });
  } else if (pestHumidity > 70 && pestTemp > 18) {
    cells.push({
      icon: "bug_report",
      label: "Pest Pressure Risk",
      badgeText: "Medium",
      severity: "caution",
      explanation: `Based on humidity ${pestHumidity}% and ${pestTemp}°C`,
    });
  } else {
    cells.push({
      icon: "bug_report",
      label: "Pest Pressure Risk",
      badgeText: "Low",
      severity: "good",
      explanation: `Based on humidity ${pestHumidity}% and ${pestTemp}°C`,
    });
  }

  const frostTemp = daily[0].temp_min;
  if (frostTemp < 2) {
    cells.push({
      icon: "ac_unit",
      label: "Frost Risk",
      badgeText: "High risk",
      severity: "warning",
      explanation: `Min temp ${frostTemp}°C tonight`,
    });
  } else if (frostTemp < 4) {
    cells.push({
      icon: "ac_unit",
      label: "Frost Risk",
      badgeText: "Monitor tonight",
      severity: "caution",
      explanation: `Min temp ${frostTemp}°C`,
    });
  } else {
    cells.push({
      icon: "ac_unit",
      label: "Frost Risk",
      badgeText: "Clear",
      severity: "good",
      explanation: `Min temp ${frostTemp}°C`,
    });
  }

  const precipProb = daily[0].precipitation_probability;
  const windMax = daily[0].wind_max;
  if (precipProb < 20 && windMax < 20) {
    cells.push({
      icon: "harvest",
      label: "Harvest Conditions",
      badgeText: "Favorable today",
      severity: "good",
      explanation: "Low rain and moderate wind",
    });
  } else if (precipProb < 40) {
    cells.push({
      icon: "harvest",
      label: "Harvest Conditions",
      badgeText: "Proceed with caution",
      severity: "caution",
      explanation: `${precipProb}% rain probability`,
    });
  } else {
    cells.push({
      icon: "harvest",
      label: "Harvest Conditions",
      badgeText: "Delay harvest",
      severity: "warning",
      explanation: `${precipProb}% rain probability`,
    });
  }

  const idealHours = hourly.filter((h) => {
    const hour = new Date(h.time).getHours();
    return hour >= 8 && hour <= 16 && h.wind_speed < 15 && h.uv_index < 6 && h.precipitation_probability < 20;
  });
  if (idealHours.length > 0) {
    const start = new Date(idealHours[0].time).getHours();
    const end = new Date(idealHours[idealHours.length - 1].time).getHours();
    cells.push({
      icon: "engineering",
      label: "Field Work Window",
      badgeText: `${start % 12 || 12}${start >= 12 ? "PM" : "AM"} – ${end % 12 || 12}${end >= 12 ? "PM" : "AM"}`,
      severity: "good",
      explanation: `Ideal conditions: low wind, moderate UV`,
    });
  } else {
    cells.push({
      icon: "engineering",
      label: "Field Work Window",
      badgeText: "Not ideal today",
      severity: "caution",
      explanation: "High wind, UV, or rain expected",
    });
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Agronomic Intelligence</h2>
      <div className={styles.grid}>
        {cells.map((cell) => (
          <div key={cell.label} className={styles.cell}>
            <div className={styles.cellHeader}>
              <span className="material-symbols-outlined">{cell.icon}</span>
              <span className={styles.cellLabel}>{cell.label}</span>
              <Badge text={cell.badgeText} severity={cell.severity} />
            </div>
            <p className={styles.cellExplanation}>{cell.explanation}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
