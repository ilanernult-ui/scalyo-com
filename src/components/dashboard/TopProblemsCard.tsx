import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Clock, Euro, Lightbulb, Sparkles, Minus, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { DetectedProblem } from "@/hooks/useDashboardEnrichment";

interface Props {
  problems?: DetectedProblem[];
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

// ── Fallback démonstratif (utilisé tant qu'aucun problème n'est en BD) ──
const MOCK_PROBLEMS: DetectedProblem[] = [
  {
    id: "mock-1",
    title: "Doublon de facturation client détecté",
    description: "Plusieurs factures identiques ont été émises au même client sur les 30 derniers jours, indiquant un dysfonctionnement du process de facturation automatique. Sans correction, le risque de litige client et d'avoirs en chaîne augmente fortement.",
    criticality: "critical",
    category: "facturation",
    monthly_loss_eur: 4200,
    weekly_hours_lost: 3,
    probable_cause: "Synchronisation défaillante entre votre CRM et l'outil de facturation : un même événement déclenche deux factures.",
    trend: "up",
    trend_delta_pct: 18,
    resolved: false,
    rank: 1,
  },
  {
    id: "mock-2",
    title: "Abandon de panier non relancé",
    description: "Près de 68% de vos visiteurs ajoutent un produit au panier sans finaliser l'achat, et aucune séquence de relance automatique n'est active. Une grande partie de ces ventes est récupérable en quelques heures.",
    criticality: "critical",
    category: "ventes",
    monthly_loss_eur: 3200,
    weekly_hours_lost: 0,
    probable_cause: "Aucune séquence email de relance configurée dans votre outil marketing : les paniers expirent sans rappel.",
    trend: "up",
    trend_delta_pct: 12,
    resolved: false,
    rank: 2,
  },
  {
    id: "mock-3",
    title: "Relances manuelles de factures impayées",
    description: "Vos relances clients sont effectuées manuellement par email, ce qui consomme du temps et entraîne des oublis. Le délai moyen de paiement s'allonge mois après mois.",
    criticality: "important",
    category: "tresorerie",
    monthly_loss_eur: 1800,
    weekly_hours_lost: 6,
    probable_cause: "Absence d'automatisation des relances : chaque facture est suivie à la main, sans rappel programmé.",
    trend: "stable",
    trend_delta_pct: 2,
    resolved: false,
    rank: 3,
  },
  {
    id: "mock-4",
    title: "Abonnements SaaS inutilisés",
    description: "Plusieurs licences logicielles sont facturées chaque mois sans être utilisées par vos équipes. Une revue mensuelle des accès permettrait de couper l'hémorragie immédiatement.",
    criticality: "moderate",
    category: "couts",
    monthly_loss_eur: 890,
    weekly_hours_lost: 0,
    probable_cause: "Aucun process de revue trimestrielle des outils SaaS, ni alerte sur les comptes inactifs depuis 30 jours.",
    trend: "down",
    trend_delta_pct: 5,
    resolved: false,
    rank: 4,
  },
  {
    id: "mock-5",
    title: "Reporting hebdomadaire saisi à la main",
    description: "La consolidation des KPIs est faite manuellement dans un tableur chaque lundi, avec un risque d'erreur élevé. L'automatisation libérerait plusieurs heures par semaine pour des tâches à forte valeur.",
    criticality: "important",
    category: "operations",
    monthly_loss_eur: 650,
    weekly_hours_lost: 4,
    probable_cause: "Pas de connexion directe entre vos sources de données et un dashboard centralisé : tout passe par un export manuel.",
    trend: "up",
    trend_delta_pct: 8,
    resolved: false,
    rank: 5,
  },
];

const TopProblemsCard = ({ problems: incoming, onFix }: Props) => {
  const { toast } = useToast();
  const [openProblem, setOpenProblem] = useState<DetectedProblem | null>(null);
  const [aiAnswer, setAiAnswer] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);

  // Si aucun problème réel détecté → on affiche les exemples enrichis (mode démo).
  const problems = incoming && incoming.length > 0 ? incoming : MOCK_PROBLEMS;

  const handleFix = async (p: DetectedProblem) => {
    onFix?.(p);
    setOpenProblem(p);
    setAiAnswer("");
    setAiLoading(true);

    try {
      const prompt = `Problème détecté : "${p.title}".
Description : ${p.description}
Cause probable : ${p.probable_cause ?? "non précisée"}
Impact estimé : ${Number(p.monthly_loss_eur).toLocaleString("fr-FR")} €/mois et ${Number(p.weekly_hours_lost).toLocaleString("fr-FR")} h/semaine.
Tendance vs mois dernier : ${p.trend === "up" ? "+" : p.trend === "down" ? "-" : ""}${Math.abs(Number(p.trend_delta_pct))}%.

Fournis un plan d'action concret et actionnable en 5 étapes maximum pour corriger ce problème : étapes pas-à-pas, outils recommandés, gain attendu en € et en heures, et délai réaliste de mise en œuvre. Réponds en Markdown.`;

      const { data, error } = await supabase.functions.invoke("scalyo-chat", {
        body: {
          messages: [{ role: "user", content: prompt }],
          activeTab: "datadiag",
        },
      });

      if (error) throw error;
      const text = (data as { text?: string })?.text;
      if (!text) throw new Error("Réponse IA vide");
      setAiAnswer(text);
    } catch (err) {
      console.error("[TopProblemsCard] fix error:", err);
      toast({
        title: "Impossible de générer la recommandation",
        description: err instanceof Error ? err.message : "Réessayez dans un instant.",
        variant: "destructive",
      });
      setOpenProblem(null);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Top {problems.length} problèmes détectés
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Détectés et priorisés par l'IA Scalyo · tendance vs mois dernier
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
                  <span className="text-muted-foreground">vs M-1 :</span>
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
                      <span className="font-semibold text-foreground">Cause probable (IA) :</span> {p.probable_cause}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-3 pl-10 flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs gap-1.5"
                  onClick={() => handleFix(p)}
                  disabled={aiLoading && openProblem?.id === p.id}
                >
                  {aiLoading && openProblem?.id === p.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                  )}
                  Corriger maintenant
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Dialog open={!!openProblem} onOpenChange={(o) => !o && setOpenProblem(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-primary" />
              Plan d'action IA — {openProblem?.title}
            </DialogTitle>
            <DialogDescription>
              Recommandation générée par l'IA Scalyo en fonction de votre contexte business.
            </DialogDescription>
          </DialogHeader>
          {aiLoading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Génération de la recommandation…
            </div>
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{aiAnswer}</ReactMarkdown>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TopProblemsCard;
