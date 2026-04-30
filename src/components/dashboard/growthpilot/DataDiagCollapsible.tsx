import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BarChart3 } from "lucide-react";
import ScoreGauge from "../datadiag/ScoreGauge";
import MiniScoreArc from "../datadiag/MiniScoreArc";

const DataDiagCollapsible = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#00d4ff]" />
          <span className="text-sm font-semibold text-white/70">
            📊 DataDiag inclus — Score 360°, KPIs, Rapport mensuel
          </span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-white/30" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-5 border-t border-white/[0.04] pt-5">
              <div className="flex flex-wrap items-center justify-center gap-8">
                <ScoreGauge score={0} size={120} delay={0} />
                <MiniScoreArc score={0} label="Rentabilité" delay={100} />
                <MiniScoreArc score={0} label="Efficacité" delay={200} />
                <MiniScoreArc score={0} label="Croissance" delay={300} />
              </div>
              <p className="text-xs text-white/30 italic text-center">Aucune donnée disponible</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DataDiagCollapsible;
