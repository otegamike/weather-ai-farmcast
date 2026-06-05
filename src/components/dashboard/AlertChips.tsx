"use client";

import type { FarmAlert } from "@/hooks/useFarmAlerts";
import styles from "./AlertChips.module.css";

interface AlertChipsProps {
  alerts: FarmAlert[];
}

export default function AlertChips({ alerts }: AlertChipsProps) {
  if (alerts.length === 0) return null;

  return (
    <div className={styles.strip}>
      {alerts.map((alert, i) => (
        <div
          key={alert.id}
          className={styles.chip}
          data-severity={alert.severity}
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <span className="material-symbols-outlined">{alert.icon}</span>
          <span className={styles.chipText}>{alert.text}</span>
        </div>
      ))}
    </div>
  );
}
