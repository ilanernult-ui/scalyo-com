import { useEffect, useRef, useState } from "react";

interface Props {
  value: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  /** Format with French thousands separators */
  format?: boolean;
}

/**
 * Premium count-up animation for KPIs.
 * Uses requestAnimationFrame + ease-out cubic. Triggers once on mount and
 * re-animates from current value when `value` changes.
 */
const AnimatedNumber = ({
  value,
  duration = 1400,
  delay = 0,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
  format = true,
}: Props) => {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    fromRef.current = display;
    startRef.current = null;
    cancelAnimationFrame(rafRef.current);

    const timeout = setTimeout(() => {
      const animate = (ts: number) => {
        if (startRef.current === null) startRef.current = ts;
        const elapsed = ts - startRef.current;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const next = fromRef.current + (value - fromRef.current) * eased;
        setDisplay(next);
        if (progress < 1) rafRef.current = requestAnimationFrame(animate);
      };
      rafRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration, delay]);

  const rounded = decimals > 0
    ? display.toFixed(decimals)
    : Math.round(display).toString();

  const formatted = format
    ? Number(rounded).toLocaleString("fr-FR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : rounded;

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

export default AnimatedNumber;
