import { motion } from "framer-motion";
import { useCountUp } from "./useCountUp";

interface ScoreGaugeProps {
  score: number;
  size?: number;
  label?: string;
  delay?: number;
}

const ScoreGauge = ({ score, size = 200, label = "Score Global", delay = 0 }: ScoreGaugeProps) => {
  const displayScore = useCountUp(score, 2000, delay);
  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * 0.75; // 270° arc
  const dashOffset = circumference * (1 - progress);
  const rotation = 135; // start from bottom-left

  const getColor = (v: number) => {
    if (v >= 70) return "#22c55e";
    if (v >= 40) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform" style={{ transform: `rotate(${rotation}deg)` }}>
          {/* Background arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getColor(score)}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference * 0.75 }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 2, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-mono font-bold tracking-tight"
            style={{ fontSize: size * 0.28, color: getColor(score) }}
          >
            {displayScore}
          </span>
          <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>
            / 100
          </span>
        </div>
      </div>
      <p className="mt-2 text-sm font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>{label}</p>
    </div>
  );
};

export default ScoreGauge;
