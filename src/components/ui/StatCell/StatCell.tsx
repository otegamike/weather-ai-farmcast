import styles from "./StatCell.module.css";

interface StatCellProps {
  label: string;
  value: string;
  icon?: string;
}

export default function StatCell({ label, value, icon }: StatCellProps) {
  return (
    <div className={styles.cell}>
      <span className={styles.label}>{label}</span>
      {icon && <span className={`material-symbols-outlined ${styles.icon}`}>{icon}</span>}
      <span className={styles.value}>{value}</span>
    </div>
  );
}
