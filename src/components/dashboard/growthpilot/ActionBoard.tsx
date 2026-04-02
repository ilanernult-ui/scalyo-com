import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const columns = [
  {
    title: "Cette semaine",
    color: "#f59e0b",
    cards: [
      { id: 1, priority: "P1", pColor: "#ff4d4d", title: "Relancer les paniers abandonnés", gain: "+680€/mois", time: "2h", progress: 0 },
      { id: 2, priority: "P2", pColor: "#f59e0b", title: "Créer séquence email onboarding", gain: "+420€/mois", time: "3h", progress: 0 },
    ],
  },
  {
    title: "En cours",
    color: "#2979ff",
    cards: [
      { id: 3, priority: "P1", pColor: "#ff4d4d", title: "Optimiser page pricing", gain: "+1 200€/mois", time: "4h", progress: 45 },
      { id: 4, priority: "P3", pColor: "#00e676", title: "A/B test CTA principal", gain: "+350€/mois", time: "1h", progress: 70 },
    ],
  },
  {
    title: "Complété ✓",
    color: "#00e676",
    cards: [
      { id: 5, priority: "P2", pColor: "#f59e0b", title: "Automatiser factures récurrentes", gain: "+3h30/sem", time: "2h", progress: 100 },
    ],
  },
];

const howToSteps = [
  { step: 1, title: "Identifier les paniers abandonnés", desc: "Exportez la liste des paniers non convertis des 30 derniers jours depuis votre CRM ou plateforme e-commerce. Filtrez ceux > 50€." },
  { step: 2, title: "Créer la séquence de relance", desc: "Configurez 3 emails automatiques : J+1 (rappel), J+3 (offre -10%), J+7 (urgence stock limité). Utilisez des objets personnalisés." },
  { step: 3, title: "Activer et mesurer", desc: "Lancez la séquence et suivez le taux de conversion. Objectif : récupérer 15-25% des paniers abandonnés sous 14 jours." },
];

interface ActionBoardProps {}

const ActionBoard = ({}: ActionBoardProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const card = "rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 hover:border-white/[0.12] transition-all duration-300";

  return (
    <>
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00e676]" />
          <h2 className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
            Plan d'Action Hebdomadaire
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {columns.map((col, ci) => (
            <div key={col.title}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {col.title}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.06] text-white/40">
                  {col.cards.length}
                </span>
              </div>
              <div className="space-y-3">
                {col.cards.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (ci * 0.1) + (i * 0.08), duration: 0.4 }}
                    className={card}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                        style={{ background: `${c.pColor}20`, color: c.pColor }}
                      >
                        {c.priority}
                      </span>
                      <span className="text-sm font-medium text-white/90 flex-1">{c.title}</span>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-semibold text-[#00e676]">💰 {c.gain}</span>
                      <span className="text-xs text-white/30">⏱ {c.time}</span>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1 w-full rounded-full bg-white/[0.04] mb-2">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: c.progress === 100 ? "#00e676" : "#2979ff" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${c.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                    {c.progress < 100 && (
                      <button
                        onClick={() => setDrawerOpen(true)}
                        className="flex items-center gap-1 text-[10px] font-medium text-[#2979ff] hover:text-[#2979ff]/80 transition-colors"
                      >
                        <Zap className="w-3 h-3" />
                        IA explique le COMMENT →
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0f1117] border-l border-white/[0.08] z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                      Comment faire ?
                    </h3>
                    <p className="text-xs text-white/40 mt-0.5">Guide étape par étape par l'IA</p>
                  </div>
                  <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-lg hover:bg-white/[0.05] text-white/40 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {howToSteps.map((s, i) => (
                    <motion.div
                      key={s.step}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="w-7 h-7 rounded-full bg-[#2979ff]/20 text-[#2979ff] text-xs font-bold flex items-center justify-center">
                          {s.step}
                        </span>
                        <h4 className="text-sm font-semibold text-white/90">{s.title}</h4>
                      </div>
                      <p className="text-xs leading-relaxed text-white/50 pl-10">{s.desc}</p>
                    </motion.div>
                  ))}
                </div>

                <Button className="w-full mt-6 gap-2 bg-[#00e676] hover:bg-[#00e676]/90 text-black font-semibold">
                  <Zap className="w-4 h-4" />
                  Commencer maintenant
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ActionBoard;
