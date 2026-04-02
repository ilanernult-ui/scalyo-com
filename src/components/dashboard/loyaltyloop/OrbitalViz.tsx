import { motion } from "framer-motion";
import { useCountUp } from "../datadiag/useCountUp";
import { useState, useEffect } from "react";

const satellites = [
  { emoji: "🔄", label: "Optimisation", badge: "Mise à jour il y a 3h", angle: 0 },
  { emoji: "💡", label: "Recommandations", badge: "3 nouvelles", angle: 90 },
  { emoji: "🤖", label: "Automatisations", badge: "12 actives", angle: 180 },
  { emoji: "📊", label: "Analyse 360°", badge: "Aujourd'hui", angle: 270 },
];

const OrbitalViz = () => {
  const score = useCountUp(87, 2000, 500);
  const [countdown, setCountdown] = useState({ d: 2, h: 14, m: 32 });

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        let { d, h, m } = prev;
        m--;
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; d--; }
        if (d < 0) return { d: 2, h: 14, m: 32 };
        return { d, h, m };
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl border border-[#f0c040]/10 bg-white/[0.02] backdrop-blur-xl p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1.5 h-1.5 rounded-full bg-[#f0c040]" />
        <h2 className="text-sm font-semibold text-white/60">Optimisation Continue</h2>
      </div>

      {/* Orbital visualization */}
      <div className="flex justify-center mb-8">
        <div className="relative w-[300px] h-[300px] sm:w-[360px] sm:h-[360px]">
          {/* Orbit rings */}
          <div className="absolute inset-0 rounded-full border border-[#f0c040]/[0.06]" />
          <div className="absolute inset-8 rounded-full border border-[#f0c040]/[0.08]" />
          <div className="absolute inset-16 rounded-full border border-[#f0c040]/[0.1]" />

          {/* Animated orbit ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-[#f0c040]/[0.15]"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          />

          {/* Center score */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Score Transformation</p>
            <p className="text-5xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "#f0c040" }}>
              {score}
            </p>
            <p className="text-sm text-white/30" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>/100</p>
          </div>

          {/* Satellites */}
          {satellites.map((sat, i) => {
            const size = 300;
            const radius = size / 2 - 10;
            const angleRad = ((sat.angle - 90) * Math.PI) / 180;
            const x = size / 2 + radius * Math.cos(angleRad) - 40;
            const y = size / 2 + radius * Math.sin(angleRad) - 24;

            return (
              <motion.div
                key={i}
                className="absolute"
                style={{ left: x, top: y }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.2, type: "spring", stiffness: 200 }}
              >
                <div className="flex flex-col items-center gap-1 w-20">
                  <motion.div
                    className="w-10 h-10 rounded-full bg-[#f0c040]/10 border border-[#f0c040]/20 flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.7 }}
                  >
                    <span className="text-sm">{sat.emoji}</span>
                  </motion.div>
                  <span className="text-[9px] font-medium text-white/50 text-center">{sat.label}</span>
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-[#f0c040]/10 text-[#f0c040]/70 text-center whitespace-nowrap">
                    {sat.badge}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Countdown */}
      <div className="text-center">
        <p className="text-xs text-white/30 mb-2">Prochaine optimisation automatique dans</p>
        <div className="flex items-center justify-center gap-3">
          {[
            { val: countdown.d, label: "jours" },
            { val: countdown.h, label: "heures" },
            { val: countdown.m, label: "min" },
          ].map((t) => (
            <div key={t.label} className="flex flex-col items-center">
              <span className="text-2xl font-bold text-[#f0c040]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                {String(t.val).padStart(2, "0")}
              </span>
              <span className="text-[9px] text-white/25 uppercase">{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrbitalViz;
