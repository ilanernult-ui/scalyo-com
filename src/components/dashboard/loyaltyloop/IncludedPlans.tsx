import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const IncludedPlans = () => {
  const [gpOpen, setGpOpen] = useState(false);
  const [ddOpen, setDdOpen] = useState(false);

  const accBtn = "w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors";

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      <p className="text-xs font-medium text-white/30 p-4 pb-0">⬇ Tout est inclus</p>

      {/* GrowthPilot */}
      <div className="border-t border-white/[0.04]">
        <button onClick={() => setGpOpen(!gpOpen)} className={accBtn}>
          <span className="text-sm font-medium text-white/60">✈️ GrowthPilot — Plan d'action, Quick Wins, Tunnel</span>
          <motion.div animate={{ rotate: gpOpen ? 180 : 0 }}><ChevronDown className="w-4 h-4 text-white/20" /></motion.div>
        </button>
        <AnimatePresence>
          {gpOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
              <div className="px-4 pb-4 grid grid-cols-3 gap-3 text-[10px] text-white/30">
                <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-3">
                  <p className="font-medium text-white/50 mb-1">Plan d'action hebdo</p>
                  <p>Kanban P1/P2/P3 avec guide IA</p>
                </div>
                <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-3">
                  <p className="font-medium text-white/50 mb-1">Quick Wins</p>
                  <p>Actions rapides à ROI immédiat</p>
                </div>
                <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-3">
                  <p className="font-medium text-white/50 mb-1">Tunnel de conversion</p>
                  <p>Funnel + analyse ventes 30j</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DataDiag */}
      <div className="border-t border-white/[0.04]">
        <button onClick={() => setDdOpen(!ddOpen)} className={accBtn}>
          <span className="text-sm font-medium text-white/60">📊 DataDiag — Score 360°, KPIs, Pertes détectées</span>
          <motion.div animate={{ rotate: ddOpen ? 180 : 0 }}><ChevronDown className="w-4 h-4 text-white/20" /></motion.div>
        </button>
        <AnimatePresence>
          {ddOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
              <div className="px-4 pb-4 grid grid-cols-3 gap-3 text-[10px] text-white/30">
                <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-3">
                  <p className="font-medium text-white/50 mb-1">Score Business 360°</p>
                  <p>Rentabilité, Efficacité, Croissance</p>
                </div>
                <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-3">
                  <p className="font-medium text-white/50 mb-1">KPIs Temps Réel</p>
                  <p>6 indicateurs avec sparklines</p>
                </div>
                <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-3">
                  <p className="font-medium text-white/50 mb-1">Pertes Détectées</p>
                  <p>Argent et temps perdus identifiés</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default IncludedPlans;
