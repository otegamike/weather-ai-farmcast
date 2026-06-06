import styles from "./logoComponent.module.css";

export default function Logo() {
  return (
    <a href="/" className={styles.logo_container}>
      <img src="/logo_small.png" alt="FarmCast" className={styles.logo} />
      <span className={styles.wordmark}>
        <span className={styles.wordmarkFarm}>Farm</span>
        <span className={styles.wordmarkCast}>Cast</span>
      </span>
    </a>
  );
}