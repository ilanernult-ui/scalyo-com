import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Shield, ChevronRight, TrendingDown } from "lucide-react";
import { useCountUp } from "../datadiag/useCountUp";
import { Button } from "@/components/ui/button";

const riskClients = [
  { name: "Entreprise Dubois", score: 87, signal: "Inactif depuis 28j", action: "Envoyer offre fidélité", color: "#dc2626" },
  { name: "SAS Martin", score: 72, signal: "Baisse commandes -40%", action: "Appel de suivi", color: "#dc2626" },
  { name: "Tech Solutions SARL", score: 61, signal: "Ticket support non résolu", action: "Résoudre + remise 10%", color: "#f59e0b" },
  { name: "Groupe Petit & Fils", score: 54, signal: "Pas de login 21j", action: "Séquence réengagement", color: "#f59e0b" },
  { name: "Cabinet Leroy", score: 43, signal: "Utilisation en baisse", action: "Démonstration valeur", color: "#eab308" },
];

const strategies = [
  { emoji: "🎁", title: "Offre de renouvellement anticipé", impact: "+340€ protégés", active: true },
  { emoji: "📞", title: "Séquence email réengagement", impact: "+5 clients sauvés estimés", active: true },
  { emoji: "💎", title: "Programme fidélité automatique", impact: "-18% churn projeté", active: false },
];

const ChurnRadar = () => {
  const riskPct = useCountUp(83, 1800, 400);
  const [strats, setStrats] = useState(strategies.map((s) => s.active));

  // Gauge
  const size = 160;
  const sw = 10;
  const r = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  const progress = (8.3 / 100) * 0.5;

  return (
    <div className="rounded-2xl border border-[#dc2626]/15 overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(220,38,38,0.06) 0%, rgba(124,58,237,0.06) 100%)" }}>
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-6">
          <AlertTriangle className="w-4 h-4 text-[#dc2626]" />
          <h2 className="text-sm font-semibold text-white/70">Radar Churn — Clients à risque détectés</h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT: Risk gauge */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative" style={{ width: size, height: size / 2 + 20 }}>
              <svg width={size} height={size / 2 + 20} style={{ overflow: "visible" }}>
                <path
                  d={`M ${sw / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - sw / 2} ${size / 2}`}
                  fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={sw} strokeLinecap="round"
                />
                <motion.path
                  d={`M ${sw / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - sw / 2} ${size / 2}`}
                  fill="none" stroke="#dc2626" strokeWidth={sw} strokeLinecap="round"
                  strokeDasharray={circ * 0.5}
                  initial={{ strokeDashoffset: circ * 0.5 }}
                  animate={{ strokeDashoffset: circ * 0.5 * (1 - progress) }}
                  transition={{ duration: 2, delay: 0.5 }}
                />
              </svg>
              <div className="absolute inset-x-0 bottom-2 text-center">
                <p className="text-3xl font-bold text-[#dc2626]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  {(riskPct / 10).toFixed(1)}%
                </p>
                <p className="text-[10px] text-white/30">Risque churn global</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingDown className="w-3 h-3 text-[#10b981]" />
              <span className="text-xs text-[#10b981] font-medium">-2.1% vs mois dernier</span>
            </div>
          </div>

          {/* CENTER: Client risk table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-2 text-white/30 font-medium">Client</th>
                  <th className="text-center py-2 text-white/30 font-medium">Risque</th>
                  <th className="text-left py-2 text-white/30 font-medium hidden sm:table-cell">Signal</th>
                  <th className="text-right py-2 text-white/30 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {riskClients.map((c, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-2.5 text-white/70 font-medium">{c.name}</td>
                    <td className="py-2.5 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: `${c.color}20`, color: c.color }}>
                        {c.score}%
                      </span>
                    </td>
                    <td className="py-2.5 text-white/40 hidden sm:table-cell">{c.signal}</td>
                    <td className="py-2.5 text-right">
                      <button className="text-[10px] text-[#7c3aed] hover:text-[#7c3aed]/80 font-medium whitespace-nowrap">
                        {c.action} →
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* RIGHT: Retention strategies */}
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Stratégies de rétention</p>
            {strategies.map((s, i) => (
              <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 flex items-center gap-3">
                <span className="text-lg">{s.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white/80 truncate">{s.title}</p>
                  <p className="text-[10px] text-[#10b981] font-semibold">{s.impact}</p>
                </div>
                <button
                  onClick={() => { const n = [...strats]; n[i] = !n[i]; setStrats(n); }}
                  className={`relative w-9 h-5 rounded-full transition-colors ${strats[i] ? "bg-[#10b981]/30" : "bg-white/[0.08]"}`}
                >
                  <motion.div
                    className={`absolute top-0.5 w-4 h-4 rounded-full ${strats[i] ? "bg-[#10b981]" : "bg-white/30"}`}
                    animate={{ left: strats[i] ? 18 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChurnRadar;
