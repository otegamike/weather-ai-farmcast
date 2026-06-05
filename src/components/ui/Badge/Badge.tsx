import styles from "./Badge.module.css";

interface BadgeProps {
  text: string;
  severity: "good" | "caution" | "warning";
}

export default function Badge({ text, severity }: BadgeProps) {
  return (
    <span className={styles.badge} data-severity={severity}>
      {text}
    </span>
  );
}
