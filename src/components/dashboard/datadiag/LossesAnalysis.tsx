import { useState } from "react";
import { motion } from "framer-motion";
import { Bar } from "react-chartjs-2";
import {
  AlertTriangle,
  TrendingUp,
  Loader2,
  Sparkles,
  Calendar,
  Target,
} from "lucide-react";
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

// ── Sources de pertes (avec explications détaillées) ──
interface LossSource {
  label: string;
  monthly: number;
  color: string;
  explanation: string;
  why: string;
}

const LOSS_SOURCES: LossSource[] = [
  {
    label: "Abandon panier",
    monthly: 3200,
    color: "#ef4444",
    explanation: "68% des visiteurs ajoutent au panier sans finaliser. Aucune séquence de relance automatique active.",
    why: "Une séquence email de relance à H+1 / H+24 / H+72 récupère en moyenne 12 à 18% des paniers abandonnés.",
  },
  {
    label: "Stocks immobilisés",
    monthly: 1800,
    color: "#f97316",
    explanation: "Plusieurs références à rotation lente bloquent du cash et génèrent des coûts de stockage évitables.",
    why: "Un déstockage ciblé (-20% sur 4 semaines) libère du BFR sans dégrader la marge globale.",
  },
  {
    label: "Pub sous-perf.",
    monthly: 890,
    color: "#0ea5e9",
    explanation: "Plusieurs campagnes ads tournent avec un ROAS < 1,5 depuis 30 jours sans alerte automatique.",
    why: "Couper les jeux d'annonces sous-performants et réallouer le budget aux top-3 audiences = +25% ROAS.",
  },
  {
    label: "Process manuels",
    monthly: 650,
    color: "#0891b2",
    explanation: "Reporting hebdo et relances factures sont saisis à la main, multipliant erreurs et oublis.",
    why: "Automatisation via Zapier/Make ou un dashboard centralisé : 4-6h/semaine récupérées immédiatement.",
  },
  {
    label: "Frais bancaires",
    monthly: 420,
    color: "#00D4FF",
    explanation: "Commissions cartes & virements internationaux supérieurs aux pratiques du secteur.",
    why: "Renégociation annuelle ou bascule partielle vers Wise/Revolut Business : -30 à -40% sur ces frais.",
  },
];

const totalMonthly = LOSS_SOURCES.reduce((s, l) => s + l.monthly, 0);
const projection6m = totalMonthly * 6;

// ── Historique 6 mois (dernières pertes mensuelles) ──
const HISTORY_LABELS = ["M-5", "M-4", "M-3", "M-2", "M-1", "Mois actuel"];
const HISTORY_DATA = [4800, 5100, 5400, 5900, 6450, totalMonthly];

import type { ChartOptions } from "chart.js";

const barOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: "y",
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => `${Number(ctx.parsed.x ?? 0).toLocaleString("fr-FR")} €/mois`,
      },
    },
  },
  scales: {
    x: { ticks: { callback: (v) => `${Number(v) / 1000}k€` } },
    y: { ticks: { color: "var(--color-text-secondary)" } },
  },
};

const trendOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => `${Number(ctx.parsed.y ?? 0).toLocaleString("fr-FR")} €`,
      },
    },
  },
  scales: {
    y: { ticks: { callback: (v) => `${Number(v) / 1000}k€` } },
  },
};

const LossesAnalysis = () => {
  const { toast } = useToast();
  const [planOpen, setPlanOpen] = useState(false);
  const [planText, setPlanText] = useState("");
  const [planLoading, setPlanLoading] = useState(false);

  const handleGeneratePlan = async () => {
    setPlanOpen(true);
    setPlanText("");
    setPlanLoading(true);

    try {
      const sourcesSummary = LOSS_SOURCES
        .map((l) => `- ${l.label} : ${l.monthly.toLocaleString("fr-FR")} €/mois — ${l.explanation}`)
        .join("\n");

      const prompt = `Voici l'analyse des pertes mensuelles d'une PME française :

${sourcesSummary}

Total des pertes actuelles : ${totalMonthly.toLocaleString("fr-FR")} €/mois.
Tendance 6 derniers mois : pertes en hausse (de 4 800 € à ${totalMonthly.toLocaleString("fr-FR")} €).
Projection si rien n'est fait sur 6 mois : ${projection6m.toLocaleString("fr-FR")} € perdus.

Génère un **plan de récupération priorisé sur 90 jours** :
1. Pour chaque source de perte, propose 1 à 2 actions concrètes avec outil recommandé, responsable type (CEO, marketing, finance…) et délai.
2. Indique pour chaque action le gain mensuel récupérable estimé en €.
3. Termine par un récap : € récupérables sur 90 jours, % de la perte totale couverte.
Formate la réponse en Markdown clair avec titres, listes et chiffres en gras.`;

      const { data, error } = await supabase.functions.invoke("scalyo-chat", {
        body: {
          messages: [{ role: "user", content: prompt }],
          activeTab: "datadiag",
        },
      });

      if (error) throw error;
      const text = (data as { text?: string })?.text;
      if (!text) throw new Error("Réponse IA vide");
      setPlanText(text);
    } catch (err) {
      console.error("[LossesAnalysis] generate plan error:", err);
      toast({
        title: "Génération impossible",
        description: err instanceof Error ? err.message : "Réessayez dans un instant.",
        variant: "destructive",
      });
      setPlanOpen(false);
    } finally {
      setPlanLoading(false);
    }
  };

  return (
    <div
      className="rounded-2xl border p-5 mt-6 space-y-6"
      style={{
        backgroundColor: "var(--color-background-primary)",
        borderColor: "var(--color-border-tertiary)",
      }}
    >
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-secondary)] mb-1">
            Analyse approfondie des pertes
          </h3>
          <p className="text-sm text-muted-foreground">
            Sources, historique et projection si aucune action n'est prise.
          </p>
        </div>
        <Button onClick={handleGeneratePlan} disabled={planLoading} className="gap-2">
          {planLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Générer un plan de récupération
        </Button>
      </div>

      {/* ── Top pertes avec explications détaillées ── */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="text-[12px] uppercase tracking-[0.24em] text-[var(--color-text-secondary)] mb-3">
          Top pertes en €/mois
        </p>
        <div className="h-[200px]">
          <Bar
            data={{
              labels: LOSS_SOURCES.map((l) => l.label),
              datasets: [{ data: LOSS_SOURCES.map((l) => l.monthly), backgroundColor: LOSS_SOURCES.map((l) => l.color) }],
            }}
            options={barOptions}
          />
        </div>

        <div className="mt-5 space-y-3">
          {LOSS_SOURCES.map((l, i) => (
            <motion.div
              key={l.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border/60 bg-secondary/40 p-3"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
                  <span className="text-sm font-semibold text-foreground truncate">{l.label}</span>
                </div>
                <span className="text-sm font-bold text-destructive tabular-nums shrink-0">
                  {l.monthly.toLocaleString("fr-FR")} €/mois
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{l.explanation}</p>
              <p className="text-xs text-foreground/80 mt-1.5 leading-relaxed">
                <span className="font-semibold text-emerald-600">Levier :</span> {l.why}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Historique 6 mois + Projection ── */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-[12px] uppercase tracking-[0.24em] text-[var(--color-text-secondary)]">
              Évolution des pertes — 6 derniers mois
            </p>
          </div>
          <div className="h-[200px]">
            <Bar
              data={{
                labels: HISTORY_LABELS,
                datasets: [
                  {
                    data: HISTORY_DATA,
                    backgroundColor: HISTORY_DATA.map((_, i) =>
                      i === HISTORY_DATA.length - 1 ? "#ef4444" : "#f97316"
                    ),
                    borderRadius: 6,
                  },
                ],
              }}
              options={trendOptions}
            />
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5 text-red-500" />
            <span>
              Pertes mensuelles en hausse de{" "}
              <span className="font-semibold text-red-500">
                +{Math.round(((totalMonthly - HISTORY_DATA[0]) / HISTORY_DATA[0]) * 100)}%
              </span>{" "}
              sur 6 mois.
            </span>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-destructive/30 bg-destructive/5 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <p className="text-[12px] uppercase tracking-[0.24em] text-destructive font-semibold">
                Projection 6 mois
              </p>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              Si vous ne prenez aucune action d'ici 6 mois, vous perdrez environ :
            </p>
            <p className="text-4xl font-bold text-destructive mt-3 tabular-nums">
              {projection6m.toLocaleString("fr-FR")} €
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Calcul : {totalMonthly.toLocaleString("fr-FR")} €/mois × 6 mois (tendance actuelle).
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-foreground/80 rounded-xl bg-background/60 border border-border/60 p-3">
            <Target className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>
              Plan de récupération IA :{" "}
              <span className="font-semibold text-emerald-600">jusqu'à 60% récupérables sur 90 jours.</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Dialog plan IA ── */}
      <Dialog open={planOpen} onOpenChange={(o) => !o && setPlanOpen(false)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-primary" />
              Plan de récupération IA — 90 jours
            </DialogTitle>
            <DialogDescription>
              Plan priorisé généré par l'IA Scalyo à partir de vos pertes détectées.
            </DialogDescription>
          </DialogHeader>
          {planLoading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Génération du plan en cours…
            </div>
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{planText}</ReactMarkdown>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LossesAnalysis;
