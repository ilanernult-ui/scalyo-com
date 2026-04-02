import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BarChart3 } from "lucide-react";
import ScoreGauge from "../datadiag/ScoreGauge";
import MiniScoreArc from "../datadiag/MiniScoreArc";
import SparkLine from "../datadiag/SparkLine";
import { useCountUp } from "../datadiag/useCountUp";

const kpis = [
  { label: "CA mensuel", value: "72 000€", spark: [58, 62, 65, 71, 68, 72], up: true },
  { label: "Marge nette", value: "12%", spark: [14, 13.5, 13, 12.8, 12.2, 12], up: false },
  { label: "Trésorerie", value: "95 000€", spark: [80, 82, 85, 88, 91, 95], up: true },
  { label: "Rétention", value: "62%", spark: [55, 57, 58, 60, 61, 62], up: true },
];

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
              {/* Mini Score Gauge */}
              <div className="flex flex-wrap items-center justify-center gap-8">
                <ScoreGauge score={70} size={120} delay={0} />
                <MiniScoreArc score={72} label="Rentabilité" delay={100} />
                <MiniScoreArc score={58} label="Efficacité" delay={200} />
                <MiniScoreArc score={81} label="Croissance" delay={300} />
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {kpis.map((kpi) => (
                  <div key={kpi.label} className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
                    <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">{kpi.label}</p>
                    <p className="font-mono text-lg font-bold text-white">{kpi.value}</p>
                    <div className="mt-2 opacity-60">
                      <SparkLine data={kpi.spark} color={kpi.up ? "#22c55e" : "#ef4444"} height={24} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DataDiagCollapsible;
