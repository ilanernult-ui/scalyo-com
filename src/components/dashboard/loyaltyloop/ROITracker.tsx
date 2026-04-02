import { motion } from "framer-motion";
import { useCountUp } from "../datadiag/useCountUp";
import { Terminal } from "lucide-react";

const roiBreakdown = [
  { label: "Churn évité", value: 12400, pct: 43, color: "#dc2626" },
  { label: "Ventes récupérées", value: 8200, pct: 29, color: "#f0c040" },
  { label: "Temps récupéré", value: 4800, pct: 17, color: "#7c3aed" },
  { label: "Optimisations", value: 3240, pct: 11, color: "#10b981" },
];

const events = [
  { time: "16:42", emoji: "🤖", text: "Automatisation rétention → Client \"Dubois SAS\" réengagé", color: "#10b981" },
  { time: "15:30", emoji: "💰", text: "Recommandation appliquée → +840€ projeté", color: "#f0c040" },
  { time: "14:00", emoji: "🔄", text: "Optimisation hebdo exécutée → Score +2pts", color: "#7c3aed" },
  { time: "09:00", emoji: "📊", text: "Analyse 360° complétée → 3 opportunités détectées", color: "#f0c040" },
  { time: "Lundi", emoji: "📋", text: "Briefing IA envoyé à 4 utilisateurs", color: "#ffffff" },
];

const ROITracker = () => {
  const totalROI = useCountUp(28640, 2200, 500);

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {/* LEFT: ROI dashboard */}
      <div className="rounded-2xl border border-[#f0c040]/10 bg-white/[0.02] p-5">
        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">ROI généré depuis activation</p>
        <p className="text-4xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif", color: "#f0c040" }}>
          +{totalROI.toLocaleString("fr-FR")}€
        </p>

        <div className="space-y-3">
          {roiBreakdown.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-center gap-3"
            >
              <span className="text-xs text-white/40 w-32 truncate">{item.label}</span>
              <div className="flex-1 h-3 rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: item.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.pct}%` }}
                  transition={{ duration: 1.5, delay: 0.8 + i * 0.15 }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-white/50 w-16 text-right">
                {(item.value / 1000).toFixed(1)}k€
              </span>
              <span className="text-[10px] text-white/25 w-8 text-right">{item.pct}%</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* RIGHT: Live event stream */}
      <div className="rounded-2xl border border-[#f0c040]/10 bg-[#08080a] p-5 font-mono relative overflow-hidden">
        {/* Scanline */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(240,192,64,0.1) 2px, rgba(240,192,64,0.1) 4px)",
        }} />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#f0c040]" />
              <span className="text-xs font-semibold text-[#f0c040]">LIVE</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#f0c040] animate-pulse" />
              <span className="text-[9px] text-white/25">Maintenant</span>
            </div>
          </div>

          <div className="space-y-2.5">
            {events.map((ev, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className="flex items-start gap-2 text-[11px]"
              >
                <span className="text-white/15 w-12 shrink-0">[{ev.time}]</span>
                <span>{ev.emoji}</span>
                <span style={{ color: `${ev.color}99` }}>{ev.text}</span>
              </motion.div>
            ))}
            <div className="flex items-center gap-1 pt-1">
              <span className="text-[#f0c040] animate-pulse">▋</span>
              <span className="text-white/10 text-[10px]">En attente...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROITracker;
