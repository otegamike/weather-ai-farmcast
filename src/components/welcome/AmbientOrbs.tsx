import styles from "./AmbientOrbs.module.css";

export default function AmbientOrbs() {
  return (
    <div className={styles.container}>
      <div className={`${styles.orb} ${styles.orb1}`} />
      <div className={`${styles.orb} ${styles.orb2}`} />
      <div className={`${styles.orb} ${styles.orb3}`} />
    </div>
  );
}
