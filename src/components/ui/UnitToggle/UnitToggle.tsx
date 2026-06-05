import styles from "./UnitToggle.module.css";

interface UnitToggleProps {
  unit: "metric" | "imperial";
  onChange: (u: "metric" | "imperial") => void;
}

export default function UnitToggle({ unit, onChange }: UnitToggleProps) {
  return (
    <div className={styles.toggle}>
      <button
        className={`${styles.btn} ${unit === "metric" ? styles.active : ""}`}
        onClick={() => onChange("metric")}
      >
        °C
      </button>
      <button
        className={`${styles.btn} ${unit === "imperial" ? styles.active : ""}`}
        onClick={() => onChange("imperial")}
      >
        °F
      </button>
    </div>
  );
}
