"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: string;
  duration?: number;
}

export function AnimatedCounter({
  value,
  duration = 2000,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // Extract number from value (handles "100%", "< 30s", "5-10", etc.)
  const extractNumber = (val: string): number => {
    const match = val.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  const targetNumber = extractNumber(value);

  // Check if value contains special characters
  const getPrefix = (val: string): string => {
    if (val.includes("<")) return "< ";
    return "";
  };

  const getSuffix = (val: string): string => {
    if (val.includes("%")) return "%";
    if (val.includes("s")) return "s";
    if (val.includes("-")) {
      const parts = val.split("-");
      return parts.length > 1 ? `-${parts[1]}` : "";
    }
    return "";
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateCount();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCount = () => {
    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * targetNumber);

      setCount(currentCount);

      if (now < endTime) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(targetNumber);
      }
    };

    requestAnimationFrame(updateCount);
  };

  return (
    <div ref={elementRef} className="tabular-nums">
      {getPrefix(value)}
      {count}
      {getSuffix(value)}
    </div>
  );
}
