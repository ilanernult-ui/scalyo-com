import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

const events = [
  { time: "14:32", icon: "✓", text: "Automatisation email → +3 nouveaux clients cette semaine", color: "#00e676" },
  { time: "11:15", icon: "✓", text: "Quick win relance → +420€ récupérés", color: "#00e676" },
  { time: "09:00", icon: "✓", text: "Plan semaine appliqué à 60% → +8.3% croissance projetée", color: "#00e676" },
  { time: "En cours", icon: "⏳", text: "Optimisation tunnel → Résultats dans 3 jours", color: "#f59e0b" },
];

const ImpactTracker = () => (
  <div className="rounded-2xl border border-white/[0.06] bg-[#080b12] p-5 font-mono relative overflow-hidden">
    {/* Scanline effect */}
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.03]"
      style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,230,118,0.1) 2px, rgba(0,230,118,0.1) 4px)",
      }}
    />

    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#00e676]" />
          <h2 className="text-sm font-semibold text-[#00e676]">Impact Tracker</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00e676] animate-pulse" />
          <span className="text-[10px] text-white/30">Mis à jour il y a 2 min</span>
        </div>
      </div>

      <div className="space-y-2">
        {events.map((ev, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15, duration: 0.3 }}
            className="flex items-start gap-3 text-xs py-1.5"
          >
            <span className="text-white/20 w-16 shrink-0">[{ev.time}]</span>
            <span style={{ color: ev.color }}>{ev.icon}</span>
            <span style={{ color: `${ev.color}aa` }}>{ev.text}</span>
          </motion.div>
        ))}
        {/* Blinking cursor */}
        <div className="flex items-center gap-1 pt-1">
          <span className="text-[#00e676] animate-pulse">▋</span>
          <span className="text-white/15 text-xs">En attente de nouveaux événements...</span>
        </div>
      </div>
    </div>
  </div>
);

export default ImpactTracker;
