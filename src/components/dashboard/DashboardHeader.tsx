"use client";

import styles from "./DashboardHeader.module.css";
import UnitToggle from "@/components/ui/UnitToggle/UnitToggle";
import Logo from "@/components/ui/LogoComponent/LogoComponent";
import { LocationIcon, SearchIcon } from "@/components/ui/icons";

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
        <LocationIcon />
        <span className={styles.locationText}>{locationName}</span>
      </div>
      <div className={styles.right}>
        <UnitToggle unit={unit} onChange={onUnitChange} />
        <button className={styles.searchBtn} onClick={onSearchOpen} aria-label="Search location">
          <SearchIcon />
        </button>
      </div>
    </header>
  );
}


