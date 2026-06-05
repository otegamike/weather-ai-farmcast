"use client";

import styles from "./DashboardHeader.module.css";
import UnitToggle from "@/components/ui/UnitToggle/UnitToggle";
import Logo from "@/components/ui/LogoComponent/LogoComponent";

interface DashboardHeaderProps {
  locationName: string;
  unit: "metric" | "imperial";
  onUnitChange: (u: "metric" | "imperial") => void;
  onSearchOpen: () => void;
}

export default function DashboardHeader({
  locationName,
  unit,
  onUnitChange,
  onSearchOpen,
}: DashboardHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Logo />
      </div>
      <div className={styles.center}>
        <span className="material-symbols-outlined">location_on</span>
        <span className={styles.locationText}>{locationName}</span>
      </div>
      <div className={styles.right}>
        <UnitToggle unit={unit} onChange={onUnitChange} />
        <button className={styles.searchBtn} onClick={onSearchOpen} aria-label="Search location">
          <span className="material-symbols-outlined">search</span>
        </button>
      </div>
    </header>
  );
}


