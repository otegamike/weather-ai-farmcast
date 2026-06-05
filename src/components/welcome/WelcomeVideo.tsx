import styles from "./WelcomeVideo.module.css";

export default function WelcomeVideo() {
  return (
    <div className={styles.wrapper}>
      <video
        className={styles.video}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/background-image.mp4" type="video/mp4" />
      </video>
      <div className={styles.overlay} />
    </div>
  );
}
