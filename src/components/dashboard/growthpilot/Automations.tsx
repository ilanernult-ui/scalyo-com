import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, ChevronRight, Clock } from "lucide-react";
import { useCountUp } from "../datadiag/useCountUp";
import { Button } from "@/components/ui/button";

const automations = [
  { name: "Facturation automatique", hours: "3h30", complexity: "Facile · 0 code requis", active: true },
  { name: "Relance paiements en retard", hours: "4h00", complexity: "Facile · 0 code requis", active: false },
  { name: "Rapports hebdomadaires auto", hours: "2h42", complexity: "Moyen · Config 10 min", active: false },
];

const Automations = () => {
  const [states, setStates] = useState(automations.map((a) => a.active));
  const totalMinutes = states.reduce((acc, on, i) => acc + (on ? parseFloat(automations[i].hours.replace("h", ".")) * 60 : 0), 0);
  const totalH = Math.floor(totalMinutes / 60);
  const totalM = Math.round(totalMinutes % 60);
  const animTotal = useCountUp(totalH * 60 + totalM, 1500, 200);
  const displayH = Math.floor(animTotal / 60);
  const displayM = animTotal % 60;

  const toggle = (i: number) => {
    const next = [...states];
    next[i] = !next[i];
    setStates(next);
  };

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-[#2979ff]" />
          <h2 className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
            Automatisations Recommandées
          </h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00e676]/10 border border-[#00e676]/20">
          <Clock className="w-3 h-3 text-[#00e676]" />
          <span className="font-mono text-sm font-bold text-[#00e676]">
            +{displayH}h{String(displayM).padStart(2, "0")}/sem
          </span>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {automations.map((auto, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:border-white/[0.1] transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#2979ff]/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-[#2979ff]" />
              </div>
              <span className="text-sm font-medium text-white/90 flex-1">{auto.name}</span>
            </div>
            <p className="text-xs font-semibold text-[#00e676] mb-1">⏱ +{auto.hours} récupérées/sem</p>
            <p className="text-[10px] text-white/30 mb-3">{auto.complexity}</p>

            {/* Toggle */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-white/40">{states[i] ? "Activé" : "Désactivé"}</span>
              <button
                onClick={() => toggle(i)}
                className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${
                  states[i] ? "bg-[#00e676]/30" : "bg-white/[0.08]"
                }`}
              >
                <motion.div
                  className={`absolute top-0.5 w-4 h-4 rounded-full ${states[i] ? "bg-[#00e676]" : "bg-white/30"}`}
                  animate={{ left: states[i] ? 22 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs gap-1 border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.05] bg-transparent"
            >
              Configurer en 5 min <ChevronRight className="w-3 h-3" />
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Automations;
