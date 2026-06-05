"use client";

import { useRef, useEffect, useState } from "react";
import type { HourlyWeather } from "@/types/weather";
import { buildSparklinePath, isCurrentHour } from "@/lib/weatherUtils";
import styles from "./SparklineChart.module.css";

interface SparklineChartProps {
  hourly: HourlyWeather[];
  width: number;
  height: number;
}

export default function SparklineChart({ hourly, width, height }: SparklineChartProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  const pathD = buildSparklinePath(hourly, width, height);

  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setPathLength(len);
    }
  }, [pathD]);

  const temps = hourly.map((h) => h.temperature);
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const range = max - min || 1;

  const currentHourIdx = hourly.findIndex((h) => isCurrentHour(h.time));
  let dotX = 0;
  let dotY = 0;
  if (currentHourIdx >= 0 && hourly.length > 1) {
    const padding = 4;
    const w = width - padding * 2;
    const h = height - padding * 2;
    dotX = padding + (currentHourIdx / (hourly.length - 1)) * w;
    dotY = padding + ((max - temps[currentHourIdx]) / range) * h;
  }

  const fillD = pathD ? `${pathD} L${width - 4},${height - 4} L4,${height - 4} Z` : "";

  return (
    <div className={styles.container}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className={styles.svg}
      >
        {pathD && (
          <>
            <defs>
              <linearGradient id="sparkline-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.7" />
              </linearGradient>
            </defs>
            <path
              d={fillD}
              fill="url(#sparkline-fill)"
              opacity="0.5"
            />
            <path
              ref={pathRef}
              d={pathD}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="1.5"
              opacity="0.6"
              strokeDasharray={pathLength}
              strokeDashoffset={pathLength}
              style={{
                animation: pathLength > 0
                  ? `drawPath 2s ease forwards 0.5s`
                  : "none",
                "--path-length": pathLength,
              } as React.CSSProperties}
            />
            {currentHourIdx >= 0 && (
              <>
                <circle cx={dotX} cy={dotY} r="4" fill="var(--color-primary)" className={styles.dot} />
                <circle cx={dotX} cy={dotY} r="7" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" opacity="0.3" className={styles.dotRing} />
              </>
            )}
          </>
        )}
      </svg>
    </div>
  );
}
