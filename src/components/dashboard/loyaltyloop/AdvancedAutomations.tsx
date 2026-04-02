import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { useCountUp } from "../datadiag/useCountUp";

const automations = [
  { name: "Séquence de rétention client", trigger: "Si inactivité > 14j", impact: "-24% churn sur segment concerné", status: "ACTIVE", clients: "847 clients couverts", lastSync: null },
  { name: "Optimisation prix dynamique", trigger: "Ajuste les offres selon le profil client", impact: "+11% taux de conversion", status: "ACTIVE", clients: null, lastSync: null },
  { name: "Rapport ROI hebdomadaire auto", trigger: "Envoyé chaque lundi à 8h à toute l'équipe", impact: "100% équipe alignée", status: "ACTIVE", clients: null, lastSync: null },
  { name: "Sync CRM bidirectionnel", trigger: "Salesforce + HubSpot synchronisés en temps réel", impact: "0 donnée perdue", status: "ACTIVE", clients: null, lastSync: "il y a 4 min" },
];

const AdvancedAutomations = () => {
  const totalH = useCountUp(14, 1500, 300);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-[#7c3aed]" />
          <h2 className="text-sm font-semibold text-white/60">Automatisations Avancées</h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f0c040]/10 border border-[#f0c040]/15">
          <span className="text-xs font-bold text-[#f0c040]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            12 actives · +{totalH}h/sem
          </span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {automations.map((auto, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-[#f0c040]/[0.08] bg-white/[0.02] overflow-hidden hover:border-[#f0c040]/20 transition-all duration-300 group"
          >
            {/* Gold top border */}
            <div className="h-[2px] bg-gradient-to-r from-[#f0c040]/40 via-[#f0c040]/80 to-[#f0c040]/40" />
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-[#7c3aed]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white/90">{auto.name}</p>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#7c3aed]/15 text-[#7c3aed] font-semibold">IA</span>
                </div>
              </div>
              <p className="text-[10px] text-white/30 mb-2">→ {auto.trigger}</p>
              <p className="text-xs font-semibold text-[#10b981] mb-2">Impact: {auto.impact}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                  <span className="text-[10px] text-[#10b981] font-medium">{auto.status}</span>
                </div>
                {auto.clients && <span className="text-[9px] text-white/25">{auto.clients}</span>}
                {auto.lastSync && <span className="text-[9px] text-white/25">Sync: {auto.lastSync}</span>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdvancedAutomations;
