import { motion } from "framer-motion";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Clock, Euro, Lightbulb, Sparkles, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DetectedProblem } from "@/hooks/useDashboardEnrichment";

interface Props {
  problems: DetectedProblem[];
  onFix?: (problem: DetectedProblem) => void;
}

const critConfig = {
  critical: { label: "Critique", className: "bg-red-500/10 text-red-600 border-red-500/20" },
  important: { label: "Important", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  moderate: { label: "Modéré", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
};

const TrendIcon = ({ trend }: { trend: DetectedProblem["trend"] }) => {
  if (trend === "up") return <ArrowUpRight className="h-3.5 w-3.5 text-red-500" />;
  if (trend === "down") return <ArrowDownRight className="h-3.5 w-3.5 text-emerald-500" />;
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
};

const TopProblemsCard = ({ problems, onFix }: Props) => {
  if (problems.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-secondary/40 p-8 text-center">
        <Sparkles className="h-7 w-7 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm font-medium text-foreground mb-1">Aucun problème détecté</p>
        <p className="text-xs text-muted-foreground">Lancez une analyse IA pour identifier vos pertes cachées.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Top {problems.length} problèmes détectés
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Détectés et priorisés par l'IA Scalyo
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {problems.map((p, i) => {
          const crit = critConfig[p.criticality] ?? critConfig.important;
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-[var(--shadow-sm)] hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="h-7 w-7 rounded-lg bg-secondary text-muted-foreground flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-semibold text-foreground">{p.title}</h4>
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${crit.className}`}>
                        {crit.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.description}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pl-10">
                <div className="flex items-center gap-1.5 text-xs">
                  <Euro className="h-3.5 w-3.5 text-red-500" />
                  <span className="text-muted-foreground">Perte :</span>
                  <span className="font-semibold text-foreground tabular-nums">
                    {Number(p.monthly_loss_eur).toLocaleString("fr-FR")} €/mois
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <Clock className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-muted-foreground">Temps :</span>
                  <span className="font-semibold text-foreground tabular-nums">
                    {Number(p.weekly_hours_lost).toLocaleString("fr-FR")} h/sem
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <TrendIcon trend={p.trend} />
                  <span className="text-muted-foreground">Tendance :</span>
                  <span className={`font-semibold tabular-nums ${
                    p.trend === "up" ? "text-red-500" : p.trend === "down" ? "text-emerald-500" : "text-foreground"
                  }`}>
                    {p.trend === "up" ? "+" : p.trend === "down" ? "−" : ""}
                    {Math.abs(Number(p.trend_delta_pct))}%
                  </span>
                </div>
              </div>

              {p.probable_cause && (
                <div className="mt-3 pl-10">
                  <div className="flex items-start gap-2 rounded-xl bg-secondary/60 border border-border/60 px-3 py-2">
                    <Lightbulb className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <span className="font-semibold text-foreground">Cause probable :</span> {p.probable_cause}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-3 pl-10 flex justify-end">
                <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={() => onFix?.(p)}>
                  <Sparkles className="h-3.5 w-3.5" />
                  Corriger maintenant
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TopProblemsCard;
