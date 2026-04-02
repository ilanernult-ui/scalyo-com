import { motion } from "framer-motion";
import { useCountUp } from "./useCountUp";

interface MiniScoreArcProps {
  score: number;
  label: string;
  delay?: number;
}

const MiniScoreArc = ({ score, label, delay = 0 }: MiniScoreArcProps) => {
  const displayScore = useCountUp(score, 1800, delay);
  const size = 90;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * 0.75;
  const dashOffset = circumference * (1 - progress);

  const getColor = (v: number) => {
    if (v >= 70) return "#22c55e";
    if (v >= 40) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(135deg)" }}>
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
            strokeLinecap="round"
          />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={getColor(score)}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference * 0.75 }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.8, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-lg font-bold" style={{ color: getColor(score) }}>
            {displayScore}
          </span>
        </div>
      </div>
      <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</span>
    </div>
  );
};

export default MiniScoreArc;
