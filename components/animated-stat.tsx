"use client";

import { useEffect, useRef, useState } from "react";

const DURATION_MS = 3500;

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type AnimatedStatProps = {
  value: number;
  suffix: string;
  label: string;
  duration?: number;
};

export function AnimatedStat({ value, suffix, label, duration = DURATION_MS }: AnimatedStatProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReduceMotion(prefersReducedMotion());
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || value <= 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!hasAnimated && entries[0]?.isIntersecting) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated, value]);

  useEffect(() => {
    if (!hasAnimated) return;

    if (reduceMotion || prefersReducedMotion()) {
      setDisplayValue(value);
      return;
    }

    const startTime = performance.now();
    const endValue = value;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      const current = Math.round(eased * endValue);
      setDisplayValue(current);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setDisplayValue(endValue);
      }
    };
    requestAnimationFrame(tick);
  }, [hasAnimated, value, duration, reduceMotion]);

  return (
    <div
      ref={ref}
      className="liquid-surface-dark overflow-hidden rounded-[20px] p-6 text-center"
    >
      <p className="relative z-10 font-[family-name:var(--font-cormorant)] text-[40px] font-medium leading-none text-[#F0EAE0]">
        {displayValue.toLocaleString()}
        {suffix && <span className="text-[28px] text-champagne">{suffix}</span>}
      </p>
      <p className="relative z-10 mt-2 text-xs tracking-wide text-white/80">{label}</p>
    </div>
  );
}
