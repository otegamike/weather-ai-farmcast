"use client";

import LocationIcon from "@/components/ui/icons/LocationIcon";
import styles from "./LocationButton.module.css";

interface LocationButtonProps {
  onDetect: () => void;
  isLoading?: boolean;
  isSuccess?: boolean;
}

export default function LocationButton({ onDetect, isLoading, isSuccess }: LocationButtonProps) {
  return (
    <button className={styles.button} onClick={onDetect} disabled={isLoading}>
      {isLoading ? (
        <span className="material-symbols-outlined">progress_activity</span>
      ) : isSuccess ? (
        <span className="material-symbols-outlined">check_circle</span>
      ) : (
        <LocationIcon />
      )}
      <span className={styles.text}>
        {isLoading ? "Detecting…" : isSuccess ? "Location found" : "Use my location"}
      </span>
    </button>
  );
}
