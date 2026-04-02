import { motion } from "framer-motion";
import { Zap, ChevronRight } from "lucide-react";

const quickWins = [
  { title: "Activer les relances SMS", gain: "+320€ cette semaine", effort: "30 min" },
  { title: "Offre flash -15% clients inactifs", gain: "+580€ cette semaine", effort: "45 min" },
  { title: "Ajouter un upsell post-achat", gain: "+290€ cette semaine", effort: "1h" },
  { title: "Optimiser le formulaire devis", gain: "+410€ cette semaine", effort: "20 min" },
  { title: "Publier 3 témoignages clients", gain: "+180€ cette semaine", effort: "15 min" },
  { title: "Activer chat live sur pricing", gain: "+520€ cette semaine", effort: "30 min" },
];

const QuickWins = () => (
  <div>
    <div className="flex items-center gap-2 mb-4">
      <Zap className="w-4 h-4 text-[#00e676]" />
      <h2 className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
        Quick Wins du moment
      </h2>
    </div>
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {quickWins.map((qw, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
          className="min-w-[220px] rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 hover:border-[#00e676]/30 hover:shadow-[0_0_20px_rgba(0,230,118,0.08)] transition-all duration-300 cursor-pointer group flex-shrink-0"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-[#00e676]/10 flex items-center justify-center">
              <Zap className="w-3 h-3 text-[#00e676]" />
            </div>
            <span className="text-sm font-medium text-white/90 flex-1">{qw.title}</span>
          </div>
          <div className="space-y-1.5 mb-3">
            <p className="text-xs font-semibold text-[#00e676]">💰 {qw.gain}</p>
            <p className="text-[10px] text-white/30">⏱ {qw.effort}</p>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-[#00e676]/70 group-hover:text-[#00e676] transition-colors">
            Lancer <ChevronRight className="w-3 h-3" />
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default QuickWins;
