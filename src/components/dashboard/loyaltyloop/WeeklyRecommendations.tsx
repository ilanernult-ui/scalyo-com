import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const recs = [
  {
    category: "RÉTENTION",
    catColor: "#dc2626",
    title: "Réactivez vos 23 clients dormants depuis 60+ jours",
    desc: "Notre analyse détecte un pattern d'abandon lié au manque de suivi post-achat. Une séquence de 3 emails personnalisés peut récupérer 35-40% de ce segment.",
    impact: "+3 200€ estimés",
    effort: "Automatique",
    effortColor: "#10b981",
  },
  {
    category: "CROISSANCE",
    catColor: "#f0c040",
    title: "Lancez une offre flash sur le segment PME inactif",
    desc: "42 PME n'ont pas commandé depuis 45+ jours. Une remise ciblée de 15% sur 72h a historiquement un taux de conversion de 22% sur ce profil.",
    impact: "+1 840€ estimés",
    effort: "30 min",
    effortColor: "#f59e0b",
  },
  {
    category: "RENTABILITÉ",
    catColor: "#7c3aed",
    title: "Renégociez 3 contrats fournisseurs en surcoût",
    desc: "Nos benchmarks montrent que vos coûts d'hébergement et SaaS sont 18% au-dessus de la moyenne secteur. Une renégociation peut générer des économies immédiates.",
    impact: "+2 100€/an",
    effort: "1 journée",
    effortColor: "#dc2626",
  },
];

const WeeklyRecommendations = () => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <div className="w-1.5 h-1.5 rounded-full bg-[#f0c040]" />
      <h2 className="text-sm font-semibold text-white/60">Recommandations Hebdomadaires IA</h2>
    </div>
    <p className="text-[10px] uppercase tracking-widest text-white/25 mb-5" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      📋 Briefing IA — Semaine du 31 mars 2025
    </p>

    <div className="grid lg:grid-cols-3 gap-4">
      {recs.map((rec, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.12 }}
          className="rounded-2xl border border-[#f0c040]/[0.08] bg-white/[0.02] p-5 hover:border-[#f0c040]/20 transition-all duration-300 relative overflow-hidden"
        >
          {/* Gold left border */}
          <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: `linear-gradient(180deg, ${rec.catColor}, ${rec.catColor}40)` }} />

          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-3 inline-block" style={{ background: `${rec.catColor}15`, color: rec.catColor }}>
            {rec.category}
          </span>

          <h3 className="text-sm font-bold text-white/90 mb-2 leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
            {rec.title}
          </h3>
          <p className="text-xs text-white/40 leading-relaxed mb-4">{rec.desc}</p>

          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-bold text-[#f0c040]">💰 {rec.impact}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: `${rec.effortColor}15`, color: rec.effortColor }}>
              {rec.effort}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs gap-1 border-[#f0c040]/15 text-[#f0c040] hover:bg-[#f0c040]/10 hover:text-[#f0c040] bg-transparent"
          >
            Appliquer la recommandation <ChevronRight className="w-3 h-3" />
          </Button>
        </motion.div>
      ))}
    </div>
  </div>
);

export default WeeklyRecommendations;
