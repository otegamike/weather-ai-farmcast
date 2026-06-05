"use client";

import { useEffect, useRef, useState } from "react";
import Skeleton from "@/components/ui/Skeleton/Skeleton";
import styles from "./AIInsightPanel.module.css";

interface AIInsightPanelProps {
  summary: string | undefined;
  isLoading: boolean;
}

export default function AIInsightPanel({ summary, isLoading }: AIInsightPanelProps) {
  const [showText, setShowText] = useState(false);
  const prevLoadingRef = useRef(isLoading);

  useEffect(() => {
    if (prevLoadingRef.current && !isLoading && summary) {
      const timer = setTimeout(() => setShowText(true), 50);
      return () => clearTimeout(timer);
    }
    prevLoadingRef.current = isLoading;
  }, [isLoading, summary]);

  if (!summary && !isLoading) return null;

  const firstSentence = summary ? summary.split(".")[0] + "." : "";
  const restText = summary ? summary.slice(firstSentence.length) : "";

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className="material-symbols-outlined">temp_preferences_custom</span>
        <span className={styles.title}>AI FARM INSIGHT</span>
        <span className={styles.badge}>Powered by Gemini</span>
      </div>

      {isLoading ? (
        <div className={styles.skeletonGroup}>
          <Skeleton width="100%" height="14px" />
          <Skeleton width="82%" height="14px" />
          <Skeleton width="60%" height="14px" />
        </div>
      ) : (
        <p className={`${styles.text} ${showText ? styles.visible : ""}`}>
          <span className={styles.firstSentence}>&ldquo;{firstSentence} </span>
          {restText}&rdquo;
        </p>
      )}
    </div>
  );
}
