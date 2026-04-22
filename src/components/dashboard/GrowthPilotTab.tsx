import { useState } from "react";
import { motion } from "framer-motion";
import {
  Rocket, TrendingUp, TrendingDown, DollarSign, Users, BarChart3,
  Target, MousePointerClick, ShoppingCart, Zap, FileText, Download,
  Clock, Badge as BadgeIcon, AlertTriangle, Flame, CircleDot, Sparkles,
  Loader2, CheckCircle2, ArrowRight
} from "lucide-react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, CategoryScale,
  LinearScale, BarElement, PointElement, LineElement, Filler,
  BarController, LineController, PieController, Legend } from "chart.js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import QuickWinsSection from "./growthpilot/QuickWinsSection";
import type { Json } from "@/integrations/supabase/types";

const ACCENT = "hsl(142, 69%, 49%)";

ChartJS.register(
  ArcElement,
  Tooltip,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  BarController,
  LineController,
  PieController,
  Legend,
);

const GROWTH_PILOT_MONTHS: string[] = ["Nov", "Déc", "Jan", "Fév", "Mar", "Avr"];
const GROWTH_PILOT_REAL: number[] = [52000, 55000, 58000, 62000, 68000, 72000];
const GROWTH_PILOT_TARGET: number[] = [55000, 58000, 62000, 66000, 70000, 75000];
const GROWTH_PILOT_TREND: number[] = [51000, 54000, 56500, 61500, 67500, 71500];

const growthPilotBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context: any) => `${context.dataset.label}: ${context.parsed.y.toLocaleString("fr-FR")} €`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
    },
    y: {
      stacked: false,
      beginAtZero: true,
      grid: { display: false },
      ticks: {
        callback: (value: number | string) => {
          const numericValue = Number(value);
          return Number.isNaN(numericValue) ? String(value) : `${numericValue / 1000}k€`;
        },
      },
    },
  },
};

// ─── Sub-tab navigation ───────────────────────────────────────────
type SubTab = "acquisition" | "revenue" | "produit";

const SUB_TABS: { id: SubTab; label: string }[] = [
  { id: "acquisition", label: "Acquisition" },
  { id: "revenue", label: "Revenue" },
  { id: "produit", label: "Produit" },
];

// ─── Acquisition Dashboard ────────────────────────────────────────
const mockChannels = [
  { name: "SEO / Organique", sessions: 4_200, cpa: 12, conversion: 3.8, trend: "up" as const },
  { name: "Google Ads", sessions: 1_850, cpa: 48, conversion: 2.1, trend: "down" as const },
  { name: "LinkedIn Ads", sessions: 620, cpa: 142, conversion: 1.4, trend: "down" as const },
  { name: "Bouche-à-oreille", sessions: 980, cpa: 0, conversion: 8.2, trend: "up" as const },
  { name: "Email Marketing", sessions: 1_100, cpa: 18, conversion: 5.6, trend: "up" as const },
];

const AcquisitionDashboard = ({ aiData }: { aiData: Record<string, unknown> | null }) => {
  const channels = (aiData?.channels as typeof mockChannels | null) ?? mockChannels;
  const totalSessions = channels.reduce((s, c) => s + c.sessions, 0);

  return (
    <div className="space-y-4">
      {/* KPI strip */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { label: "Sessions totales", value: totalSessions.toLocaleString("fr-FR"), icon: Users },
          { label: "Taux conv. moyen", value: `${(channels.reduce((s, c) => s + c.conversion, 0) / channels.length).toFixed(1)}%`, icon: MousePointerClick },
          { label: "Meilleur canal ROI", value: "SEO", icon: TrendingUp },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">{k.label}</p>
              <k.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xl font-bold text-foreground">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Channels table */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Sources de trafic & CPA par canal</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border">
                <th className="text-left pb-2 font-medium">Canal</th>
                <th className="text-right pb-2 font-medium">Sessions</th>
                <th className="text-right pb-2 font-medium">CPA (€)</th>
                <th className="text-right pb-2 font-medium">Conv. %</th>
                <th className="text-right pb-2 font-medium">Tendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {channels.map((c) => (
                <tr key={c.name} className="text-sm">
                  <td className="py-2.5 font-medium text-foreground">{c.name}</td>
                  <td className="py-2.5 text-right text-muted-foreground">{c.sessions.toLocaleString("fr-FR")}</td>
                  <td className="py-2.5 text-right text-muted-foreground">{c.cpa === 0 ? "—" : `${c.cpa} €`}</td>
                  <td className="py-2.5 text-right font-semibold text-foreground">{c.conversion}%</td>
                  <td className="py-2.5 text-right">
                    {c.trend === "up"
                      ? <TrendingUp className="h-3.5 w-3.5 text-emerald-500 ml-auto" />
                      : <TrendingDown className="h-3.5 w-3.5 text-orange-400 ml-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      <AcquisitionRecommendations />
    </div>
  );
};

// ─── Recommandations acquisition (premium) ────────────────────────
type Priority = "urgent" | "important" | "optionnel";

interface AcqRecommendation {
  id: string;
  title: string;
  description: string;
  impactEur: number;
  impactPct: number;
  priority: Priority;
  delay: string;
  category: string;
}

const ACQ_RECOMMENDATIONS: AcqRecommendation[] = [
  {
    id: "linkedin-cut",
    title: "Réduire le budget LinkedIn Ads de 40%",
    description:
      "Le CPA LinkedIn est 3× supérieur à votre CPA SEO pour une conversion 2× plus faible. Réallouer ce budget vers les canaux à meilleur ROI libère immédiatement de la marge sans impact sur le pipe.",
    impactEur: 3408,
    impactPct: 12,
    priority: "urgent",
    delay: "Résultats sous 2 semaines",
    category: "Budget paid",
  },
  {
    id: "seo-double",
    title: "Doubler l'investissement SEO (3 articles/sem)",
    description:
      "10 mots-clés à fort intent business sont identifiés mais non couverts. Une cadence de 3 articles/semaine avec maillage interne capte ~18% de trafic organique additionnel sur le trimestre.",
    impactEur: 5200,
    impactPct: 18,
    priority: "important",
    delay: "Résultats sous 6 à 8 semaines",
    category: "Acquisition organique",
  },
  {
    id: "referral",
    title: "Lancer un programme de parrainage clients",
    description:
      "Le bouche-à-oreille convertit déjà à 8.2% (×2.2 vs payant). Un programme structuré avec récompense bilatérale active vos clients satisfaits et apporte des leads qualifiés à coût quasi nul.",
    impactEur: 2240,
    impactPct: 8,
    priority: "important",
    delay: "Résultats sous 3 à 4 semaines",
    category: "Croissance virale",
  },
  {
    id: "email-nurture",
    title: "Activer une séquence d'email nurturing 5 étapes",
    description:
      "Vos leads email convertissent à 5.6% mais 62% ne reçoivent aucune relance. Une séquence automatisée sur 14 jours réactive ce stock dormant avec un effort one-shot.",
    impactEur: 1180,
    impactPct: 4,
    priority: "optionnel",
    delay: "Résultats sous 2 semaines",
    category: "Email marketing",
  },
];

const PRIORITY_STYLES: Record<Priority, { label: string; icon: typeof Flame; bg: string; text: string; ring: string }> = {
  urgent: {
    label: "Urgent",
    icon: Flame,
    bg: "bg-red-500/10",
    text: "text-red-600",
    ring: "ring-red-500/30",
  },
  important: {
    label: "Important",
    icon: AlertTriangle,
    bg: "bg-orange-500/10",
    text: "text-orange-600",
    ring: "ring-orange-500/30",
  },
  optionnel: {
    label: "Optionnel",
    icon: CircleDot,
    bg: "bg-sky-500/10",
    text: "text-sky-600",
    ring: "ring-sky-500/30",
  },
};

const fallbackSteps = (reco: AcqRecommendation) => [
  { title: "Cadrer l'objectif", description: `Définir KPI cible et baseline pour : ${reco.title}.` },
  { title: "Identifier les ressources", description: "Lister budget, outils et personne responsable." },
  { title: "Mettre en place le pilote", description: "Lancer une version test sur 2 semaines avec mesure quotidienne." },
  { title: "Analyser & itérer", description: "Comparer aux objectifs, ajuster les leviers et industrialiser." },
];

const AcquisitionRecommendations = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<AcqRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<{ title: string; description: string }[] | null>(null);
  const [applied, setApplied] = useState(false);

  const handleApply = async (reco: AcqRecommendation) => {
    setActive(reco);
    setOpen(true);
    setSteps(null);
    setApplied(false);
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-action-plan", {
        body: { focus: reco.title, context: reco.description },
      });
      if (error) throw error;
      const actions = (data?.actions ?? []) as Array<{ title: string; description?: string }>;
      const mapped = actions.slice(0, 6).map((a) => ({
        title: a.title,
        description: a.description ?? "",
      }));
      setSteps(mapped.length ? mapped : fallbackSteps(reco));
      setApplied(true);
      toast.success("Plan d'action IA généré et ajouté à votre Kanban");
    } catch (e) {
      console.error(e);
      setSteps(fallbackSteps(reco));
      toast.error("Génération IA indisponible — plan type affiché");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Recommandations acquisition</h3>
          <Badge variant="secondary" className="text-[10px] ml-auto">{ACQ_RECOMMENDATIONS.length} priorités</Badge>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {ACQ_RECOMMENDATIONS.map((reco, i) => {
            const p = PRIORITY_STYLES[reco.priority];
            const PIcon = p.icon;
            return (
              <motion.div
                key={reco.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="rounded-xl border border-border bg-secondary/30 p-4 flex flex-col gap-3 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground truncate">
                    {reco.category}
                  </span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${p.bg} ${p.text} ${p.ring}`}>
                    <PIcon className="h-2.5 w-2.5" /> {p.label}
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-foreground leading-snug">{reco.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{reco.description}</p>

                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="rounded-lg bg-emerald-500/10 px-2.5 py-1.5">
                    <p className="text-[9px] uppercase text-emerald-700/70 font-medium">Impact €</p>
                    <p className="text-sm font-bold text-emerald-700">+{reco.impactEur.toLocaleString("fr-FR")} €/mois</p>
                  </div>
                  <div className="rounded-lg bg-emerald-500/10 px-2.5 py-1.5">
                    <p className="text-[9px] uppercase text-emerald-700/70 font-medium">Impact %</p>
                    <p className="text-sm font-bold text-emerald-700">+{reco.impactPct}%</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" /> {reco.delay}
                </div>

                <Button
                  size="sm"
                  className="w-full mt-1 gap-1.5 h-8 text-xs"
                  onClick={() => handleApply(reco)}
                >
                  <Sparkles className="h-3.5 w-3.5" /> Appliquer cette recommandation
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Plan d'action IA — {active?.title}
            </DialogTitle>
            <DialogDescription>
              Étapes opérationnelles générées par l'IA et ajoutées automatiquement à votre Kanban.
            </DialogDescription>
          </DialogHeader>

          {loading && (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">L'IA construit votre plan étape par étape…</p>
            </div>
          )}

          {!loading && steps && (
            <div className="space-y-3 mt-2">
              {steps.map((s, i) => (
                <div key={i} className="flex gap-3 rounded-xl border border-border bg-secondary/30 p-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{s.title}</p>
                    {s.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{s.description}</p>
                    )}
                  </div>
                </div>
              ))}
              {applied && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 text-emerald-700 px-3 py-2 text-xs font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  Étapes ajoutées à votre Plan d'action — onglet Kanban
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Fermer</Button>
            <Button onClick={() => setOpen(false)} className="gap-1.5">
              Voir le Kanban <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// ─── Revenue Dashboard ─────────────────────────────────────────────
const mockRevenueMonths = [
  { month: "Oct", mrr: 28_400 }, { month: "Nov", mrr: 31_200 },
  { month: "Déc", mrr: 29_800 }, { month: "Jan", mrr: 34_600 },
  { month: "Fév", mrr: 37_100 }, { month: "Mar", mrr: 41_500 },
];

const RevenueDashboard = ({ aiData }: { aiData: Record<string, unknown> | null }) => {
  const months = (aiData?.revenue_months as typeof mockRevenueMonths | null) ?? mockRevenueMonths;
  const latestMrr = months[months.length - 1]?.mrr ?? 0;
  const prevMrr = months[months.length - 2]?.mrr ?? 0;
  const growth = prevMrr > 0 ? (((latestMrr - prevMrr) / prevMrr) * 100).toFixed(1) : "—";
  const arr = latestMrr * 12;
  const objective = (aiData?.monthly_objective as number | null) ?? 50_000;
  const progressPct = Math.min(100, Math.round((latestMrr / objective) * 100));
  const maxMrr = Math.max(...months.map((m) => m.mrr));

  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { label: "MRR actuel", value: `${(latestMrr / 1000).toFixed(1)}k €`, icon: DollarSign },
          { label: "ARR projeté", value: `${(arr / 1000).toFixed(0)}k €`, icon: TrendingUp },
          { label: "Croissance MoM", value: `+${growth}%`, icon: BarChart3 },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">{k.label}</p>
              <k.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xl font-bold text-foreground">{k.value}</p>
          </div>
        ))}
      </div>

      {/* MRR chart */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Évolution du MRR (6 mois)</h3>
          <Badge variant="secondary" className="text-[10px]">
            <Clock className="h-2.5 w-2.5 mr-1" /> 6 mois
          </Badge>
        </div>
        <div className="flex items-end gap-2 h-32">
          {months.map((m) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] font-medium text-foreground">{(m.mrr / 1000).toFixed(0)}k</span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(m.mrr / maxMrr) * 96}px` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="w-full rounded-t-lg"
                style={{ backgroundColor: ACCENT, opacity: m.mrr === latestMrr ? 1 : 0.55 }}
              />
              <span className="text-[10px] text-muted-foreground">{m.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Objectif mensuel */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Target className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Objectif mensuel</h3>
          <span className="text-xs text-muted-foreground ml-auto">{progressPct}% atteint</span>
        </div>
        <div className="h-3 rounded-full bg-secondary overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.9 }}
            className={`h-full rounded-full ${progressPct >= 80 ? "bg-emerald-500" : progressPct >= 50 ? "bg-orange-400" : "bg-red-400"}`}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{latestMrr.toLocaleString("fr-FR")} € réalisés</span>
          <span>Objectif : {objective.toLocaleString("fr-FR")} €</span>
        </div>
      </div>
    </div>
  );
};

// ─── Produit Dashboard ─────────────────────────────────────────────
const mockFeatures = [
  { name: "Dashboard principal", usage: 94, status: "top" as const },
  { name: "Export PDF", usage: 71, status: "top" as const },
  { name: "Connecteurs données", usage: 48, status: "normal" as const },
  { name: "Recommandations IA", usage: 63, status: "top" as const },
  { name: "Paramètres avancés", usage: 22, status: "low" as const },
  { name: "API Webhooks", usage: 11, status: "low" as const },
];

const ProduitDashboard = ({ aiData }: { aiData: Record<string, unknown> | null }) => {
  const features = (aiData?.features as typeof mockFeatures | null) ?? mockFeatures;
  const nps = (aiData?.nps as number | null) ?? 38;
  const npsColor = nps >= 50 ? "text-emerald-600" : nps >= 20 ? "text-orange-500" : "text-red-500";

  return (
    <div className="space-y-4">
      {/* NPS card */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Net Promoter Score</p>
            <p className={`text-4xl font-bold ${npsColor}`}>{nps}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Interprétation</p>
            <p className={`text-sm font-semibold ${npsColor}`}>
              {nps >= 50 ? "Excellent" : nps >= 20 ? "Bon" : "À améliorer"}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Moyenne SaaS B2B : 31</p>
          </div>
        </div>
      </div>

      {/* Feature usage */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Features les plus utilisées</h3>
        </div>
        <div className="space-y-3">
          {features.map((f) => (
            <div key={f.name}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">{f.name}</span>
                <span className={`font-semibold ${f.usage >= 60 ? "text-emerald-600" : f.usage >= 30 ? "text-orange-500" : "text-red-500"}`}>
                  {f.usage}%
                </span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${f.usage}%` }}
                  transition={{ duration: 0.7 }}
                  className={`h-full rounded-full ${f.usage >= 60 ? "bg-emerald-400" : f.usage >= 30 ? "bg-orange-400" : "bg-red-400"}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Insights produit IA</h3>
        </div>
        <div className="space-y-2">
          {[
            { text: "API Webhooks sous-utilisée — documenter et promouvoir le cas d'usage", gain: "+12% adoption avancée" },
            { text: "Connecteurs données à 48% : tutoriel in-app pour les 5 premiers jours", gain: "+23% activation" },
            { text: "NPS en-dessous de 50 : lancer enquête satisfaction cible segment <3 mois", gain: "Identifier frictions onboarding" },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl bg-secondary/50 p-3">
              <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
              <div>
                <p className="text-sm font-medium text-foreground">{r.text}</p>
                <p className="text-xs text-emerald-600 font-medium mt-0.5">{r.gain}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Report Card ──────────────────────────────────────────────────
const ReportCard = ({ aiData }: { aiData: Record<string, unknown> | null }) => {
  const rapport = aiData
    ? (typeof aiData.rapport === "string" ? aiData.rapport
      : typeof aiData.analysis === "string" ? aiData.analysis
        : null)
    : null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Rapport GrowthPilot</h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[10px]">
            <Clock className="h-2.5 w-2.5 mr-1" /> 7 derniers jours
          </Badge>
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
            <Download className="h-3 w-3" /> PDF
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {rapport ?? "Cette semaine, concentrez-vous sur la réduction du budget LinkedIn Ads (CPA x3 vs SEO) et le déploiement d'un programme de parrainage. Votre MRR est en croissance constante (+12% MoM). Objectif 50k€/mois atteignable en 6 semaines selon la tendance actuelle."}
      </p>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────
interface GrowthPilotTabProps {
  onConnect?: () => void;
  dataConnected?: boolean;
  aiResults?: Json;
}

const GrowthPilotTab = ({ onConnect, dataConnected, aiResults }: GrowthPilotTabProps) => {
  const [subTab, setSubTab] = useState<SubTab>("acquisition");

  const aiData = (aiResults && typeof aiResults === "object" && !Array.isArray(aiResults))
    ? aiResults as Record<string, unknown>
    : null;

  const content = (
    <div className="space-y-4">
      {/* Sub-tab pills */}
      <div className="flex gap-1.5 bg-secondary/50 rounded-xl p-1 w-fit">
        {SUB_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              subTab === t.id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Sub-dashboard */}
      {subTab === "acquisition" && <AcquisitionDashboard aiData={aiData} />}
      {subTab === "revenue" && <RevenueDashboard aiData={aiData} />}
      {subTab === "produit" && <ProduitDashboard aiData={aiData} />}

      <ReportCard aiData={aiData} />

      <div
        className="rounded-2xl border p-5 mt-6"
        style={{ backgroundColor: "var(--color-background-primary)", borderColor: "var(--color-border-tertiary)" }}
      >
        <h3 className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-secondary)] mb-5">Performance</h3>
        <div className="h-[320px]">
          <Bar
            data={{
              labels: GROWTH_PILOT_MONTHS,
              datasets: [
                {
                  type: "bar" as const,
                  label: "CA réel",
                  data: GROWTH_PILOT_REAL,
                  backgroundColor: "#00FF88",
                  borderRadius: 10,
                },
                {
                  type: "bar" as const,
                  label: "Objectif +15%",
                  data: GROWTH_PILOT_TARGET,
                  backgroundColor: "rgba(0,255,136,0.25)",
                  borderRadius: 10,
                },
                {
                  type: "line",
                  label: "Tendance",
                  data: GROWTH_PILOT_TREND,
                  borderColor: "#0D6E3A",
                  borderWidth: 2,
                  pointRadius: 3,
                  fill: false,
                  tension: 0.35,
                } as any,
              ],
            }}
            options={growthPilotBarOptions}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#00FF88]" /> CA réel
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[rgba(0,255,136,0.25)] border border-current" /> Objectif +15%
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#0D6E3A]" /> Tendance
          </span>
        </div>
      </div>
    </div>
  );

  return content;
};

export default GrowthPilotTab;
