"use client";

import { useState, useCallback } from "react";
import styles from "./WelcomeVideo.module.css";

export default function WelcomeVideo() {
  const [loaded, setLoaded] = useState(false);

  const handleCanPlay = useCallback(() => setLoaded(true), []);

  return (
    <div
      className={styles.wrapper}
      style={{ backgroundImage: "url(/background-alt-img.jpeg)" }}
    >
      <video
        className={`${styles.video} ${loaded ? styles.visible : ""}`}
        autoPlay
        muted
        loop
        playsInline
        onCanPlay={handleCanPlay}
      >
        <source src="/background-image.mp4" type="video/mp4" />
      </video>
      <div className={styles.overlay} />
    </div>
  );
}
