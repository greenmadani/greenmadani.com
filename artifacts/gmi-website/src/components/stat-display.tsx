import { useEffect, useState, useRef } from "react";

interface StatDisplayProps {
  value: string | number;
  label: string;
  className?: string;
}

function extractNumber(str: string): { num: number; suffix: string } {
  const match = str.match(/^([\d,]+)(.*)$/);
  if (!match) return { num: 0, suffix: str };
  return { num: parseInt(match[1].replace(/,/g, ""), 10), suffix: match[2] };
}

export function StatDisplay({ value: rawValue, label, className = "" }: StatDisplayProps) {
  const value = String(rawValue);
  const [displayValue, setDisplayValue] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasAnimated) return;

    const { num: target, suffix } = extractNumber(value);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          if (target === 0) {
            setDisplayValue(value);
            return;
          }
          const duration = 1500;
          const steps = 30;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setDisplayValue(value);
              clearInterval(timer);
            } else {
              setDisplayValue(Math.floor(current).toLocaleString() + suffix);
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <div ref={ref} className={`text-center ${className}`}>
      <div className="text-3xl md:text-4xl font-extrabold text-accent">{displayValue}</div>
      <div className="text-sm text-white/50 tracking-widest uppercase mt-1">{label}</div>
    </div>
  );
}
