import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Filter,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Loader2,
  Lightbulb,
  Users,
  UserPlus,
  Target,
  Trophy,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FunnelStage {
  id: string;
  label: string;
  icon: typeof Users;
  count: number;
  benchmarkConvPct: number; // benchmark conversion rate from previous stage (%)
  frictionTitle: string;
  frictionExplanation: string;
  aiRecommendations: string[];
}

const STAGES: FunnelStage[] = [
  {
    id: "visiteurs",
    label: "Visiteurs",
    icon: Users,
    count: 8750,
    benchmarkConvPct: 100,
    frictionTitle: "Trafic non qualifié",
    frictionExplanation:
      "27% des visiteurs viennent de canaux à faible intent (LinkedIn Ads froids, display). Le bounce rate atteint 68% sur la home.",
    aiRecommendations: [
      "Réorienter 40% du budget LinkedIn vers du SEO long-tail à intention transactionnelle",
      "A/B tester un nouveau hero avec preuve sociale chiffrée (logos clients + ROI)",
      "Activer un exit-intent popup avec lead magnet sectoriel téléchargeable",
    ],
  },
  {
    id: "leads",
    label: "Leads",
    icon: UserPlus,
    count: 612,
    benchmarkConvPct: 9, // visiteurs -> leads benchmark sectoriel
    frictionTitle: "Formulaire trop long",
    frictionExplanation:
      "Le formulaire demande 7 champs alors que le standard sectoriel est 3-4. 41% d'abandon constaté à l'étape email.",
    aiRecommendations: [
      "Réduire le formulaire à 3 champs (email + entreprise + besoin) — gain attendu +35% de leads",
      "Ajouter une option « Connexion Google » pour pré-remplir les données entreprise",
      "Mettre en place un chatbot conversationnel pour qualifier en parallèle (Intercom, Crisp)",
    ],
  },
  {
    id: "prospects",
    label: "Prospects qualifiés",
    icon: Target,
    count: 184,
    benchmarkConvPct: 35, // leads -> prospects qualifiés benchmark
    frictionTitle: "Délai de qualification trop long",
    frictionExplanation:
      "Délai moyen de qualification : 4,2 jours vs 1,5 jour benchmark. 28% des leads passent au concurrent avant le 1er contact.",
    aiRecommendations: [
      "Mettre en place un scoring automatique des leads (HubSpot/Pipedrive) pour prioriser le top 20%",
      "Créer une séquence email automatique J+0, J+1, J+3 avec call-to-book Calendly",
      "Définir un SLA de rappel sous 1h pour tout lead score > 60/100",
    ],
  },
  {
    id: "clients",
    label: "Clients",
    icon: Trophy,
    count: 47,
    benchmarkConvPct: 30, // prospects -> clients benchmark
    frictionTitle: "Closing en perte de vitesse",
    frictionExplanation:
      "Taux de closing à 25,5% vs 30% benchmark. 4 deals perdus ce mois sur objection prix, sans contre-proposition structurée.",
    aiRecommendations: [
      "Construire 3 paliers de pricing avec ancrage psychologique (ex: starter / pro / enterprise)",
      "Préparer un battle-card concurrent avec réponses aux 5 objections les plus fréquentes",
      "Proposer un essai gratuit 14j avec accompagnement onboarding pour lever le risque perçu",
    ],
  },
];

const ConversionFunnelSection = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<FunnelStage | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const stagesWithRates = useMemo(() => {
    return STAGES.map((stage, i) => {
      if (i === 0) {
        return { ...stage, convPct: 100, vsBenchmark: 0 };
      }
      const prev = STAGES[i - 1];
      const convPct = (stage.count / prev.count) * 100;
      const vsBenchmark = convPct - stage.benchmarkConvPct;
      return { ...stage, convPct, vsBenchmark };
    });
  }, []);

  const globalConv = useMemo(() => {
    const last = STAGES[STAGES.length - 1].count;
    const first = STAGES[0].count;
    return (last / first) * 100;
  }, []);

  const openAiExplanation = async (stage: FunnelStage) => {
    setActive(stage);
    setOpen(true);
    setAiAnalysis(null);
    setLoading(true);

    const stageData = stagesWithRates.find((s) => s.id === stage.id);
    const prompt = `Analyse approfondie de l'étape "${stage.label}" du tunnel de conversion.

Données :
- Volume actuel : ${stage.count.toLocaleString("fr-FR")}
- Taux de conversion depuis l'étape précédente : ${stageData?.convPct.toFixed(1)}%
- Benchmark sectoriel : ${stage.benchmarkConvPct}%
- Écart vs benchmark : ${(stageData?.vsBenchmark ?? 0).toFixed(1)} pts
- Friction principale détectée : ${stage.frictionTitle} — ${stage.frictionExplanation}

Génère une analyse experte structurée en Markdown :

## Diagnostic IA
3-4 lignes expliquant POURQUOI cette friction existe (causes racines probables, leviers psychologiques ou techniques en jeu).

## Plan d'action (3 actions concrètes)
Liste numérotée. Pour chaque action : **titre en gras**, description opérationnelle (2 lignes), gain attendu chiffré (% ou €), délai de mise en place.

## Mesure du succès
3 KPIs à suivre avec valeur cible et fréquence de mesure.

## Risques à anticiper
2 pièges courants à éviter lors de l'implémentation.

Sois concret, chiffré, et 100% actionnable. Pas de blabla générique.`;

    try {
      const { data, error } = await supabase.functions.invoke("scalyo-chat", {
        body: {
          messages: [{ role: "user", content: prompt }],
          activeTab: "growthpilot",
        },
      });
      if (error) throw error;
      const text = (data as { text?: string })?.text;
      if (!text) throw new Error("Réponse IA vide");
      setAiAnalysis(text);
    } catch (err) {
      console.error("[Funnel] AI error:", err);
      toast.error("Analyse IA indisponible — affichage des recommandations standards");
      setAiAnalysis(
        `## Diagnostic IA\n${stage.frictionExplanation}\n\n## Plan d'action\n${stage.aiRecommendations
          .map((r, i) => `${i + 1}. **${r}**`)
          .join("\n")}`
      );
    } finally {
      setLoading(false);
    }
  };

  const maxCount = STAGES[0].count;

  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary/15 flex items-center justify-center">
              <Filter className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Analyse du tunnel de conversion
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Visiteurs → Leads → Prospects → Clients · taux global{" "}
                <span className="font-semibold text-foreground">
                  {globalConv.toFixed(2)}%
                </span>
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-[10px]">
            <Sparkles className="h-2.5 w-2.5 mr-1" /> Benchmark sectoriel inclus
          </Badge>
        </div>

        {/* Visual funnel */}
        <div className="space-y-2 mb-5">
          {stagesWithRates.map((stage, i) => {
            const widthPct = Math.max(20, (stage.count / maxCount) * 100);
            const Icon = stage.icon;
            const isFirst = i === 0;
            const beatsBenchmark = stage.vsBenchmark >= 0;
            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="space-y-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                    <span className="font-semibold text-foreground">{stage.label}</span>
                    <span className="text-muted-foreground">
                      {stage.count.toLocaleString("fr-FR")}
                    </span>
                  </div>
                  {!isFirst && (
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-bold">
                        {stage.convPct.toFixed(1)}%
                      </span>
                      <span className="text-muted-foreground text-[10px]">
                        vs {stage.benchmarkConvPct}%
                      </span>
                      <span
                        className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ring-1 ${
                          beatsBenchmark
                            ? "bg-emerald-500/10 text-emerald-700 ring-emerald-500/30"
                            : "bg-rose-500/10 text-rose-700 ring-rose-500/30"
                        }`}
                      >
                        {beatsBenchmark ? (
                          <TrendingUp className="h-2.5 w-2.5" />
                        ) : (
                          <TrendingDown className="h-2.5 w-2.5" />
                        )}
                        {beatsBenchmark ? "+" : ""}
                        {stage.vsBenchmark.toFixed(1)}pts
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex justify-center">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPct}%` }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                    className={`h-9 rounded-lg flex items-center justify-center text-xs font-semibold text-white shadow-sm ${
                      isFirst
                        ? "bg-gradient-to-r from-primary to-primary/70"
                        : beatsBenchmark
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                        : "bg-gradient-to-r from-orange-500 to-rose-500"
                    }`}
                  >
                    {stage.count.toLocaleString("fr-FR")}
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Friction points + recommendations grid */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <AlertTriangle className="h-3 w-3 text-orange-500" />
            Points de friction & recommandations IA
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {stagesWithRates.map((stage, i) => {
              if (i === 0) return null; // skip first stage (no prior conversion)
              const Icon = stage.icon;
              const beatsBenchmark = stage.vsBenchmark >= 0;
              return (
                <div
                  key={stage.id}
                  className={`rounded-xl border p-3.5 flex flex-col gap-2.5 ${
                    beatsBenchmark
                      ? "border-border bg-card"
                      : "border-orange-500/30 bg-orange-500/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          Étape {stage.label}
                        </p>
                        <p className="text-sm font-semibold text-foreground leading-snug">
                          {stage.frictionTitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {stage.frictionExplanation}
                  </p>

                  <div className="rounded-lg bg-muted/40 p-2.5 space-y-1.5">
                    <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                      <Lightbulb className="h-3 w-3" /> 3 reco IA
                    </div>
                    <ul className="space-y-1">
                      {stage.aiRecommendations.map((reco, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-foreground/80 leading-snug flex gap-1.5"
                        >
                          <span className="text-primary font-bold shrink-0">
                            {idx + 1}.
                          </span>
                          <span>{reco}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full h-7 text-[11px] gap-1.5 mt-1"
                    onClick={() => openAiExplanation(stage)}
                  >
                    <Sparkles className="h-3 w-3" /> Analyse IA approfondie
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Analyse IA — {active?.label}
            </DialogTitle>
            <DialogDescription>
              Diagnostic approfondi et plan d'action chiffré pour cette étape du tunnel.
            </DialogDescription>
          </DialogHeader>

          {loading && (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                L'IA analyse votre tunnel de conversion…
              </p>
            </div>
          )}

          {!loading && aiAnalysis && (
            <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground/80 prose-strong:text-foreground prose-li:text-foreground/80">
              <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConversionFunnelSection;
