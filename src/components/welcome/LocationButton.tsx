"use client";

import styles from "./LocationButton.module.css";

interface LocationButtonProps {
  onDetect: () => void;
  isLoading?: boolean;
  isSuccess?: boolean;
}

export default function LocationButton({ onDetect, isLoading, isSuccess }: LocationButtonProps) {
  return (
    <button className={styles.button} onClick={onDetect} disabled={isLoading}>
      <span className="material-symbols-outlined">
        {isLoading ? "progress_activity" : isSuccess ? "check_circle" : "my_location"}
      </span>
      <span className={styles.text}>
        {isLoading ? "Detecting…" : isSuccess ? "Location found" : "Use my location"}
      </span>
    </button>
  );
}
