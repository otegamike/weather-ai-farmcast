import styles from "./Skeleton.module.css";

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export default function Skeleton({
  width = "100%",
  height = "16px",
  borderRadius = "var(--radius-sm)",
  className,
}: SkeletonProps) {
  return (
    <div
      className={`${styles.skeleton} ${className ?? ""}`}
      style={{ width, height, borderRadius }}
    />
  );
}
