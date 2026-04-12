import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity, AlertTriangle, Zap, FileText, Target,
  TrendingUp, TrendingDown, Download, Clock, CheckCircle2,
  BarChart3, Info
} from "lucide-react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, CategoryScale,
  LinearScale, BarElement, PointElement, LineElement, Filler,
  BarController, LineController, PieController, Legend } from "chart.js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { computeHealthScore } from "@/lib/healthScore";
import type { Json } from "@/integrations/supabase/types";

const ACCENT = "hsl(211, 100%, 45%)";

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

const DATA_DIAG_LOSS_DISTRIBUTION = [
  { label: "Abandon panier non relancé", value: 40 },
  { label: "Stocks immobilisés", value: 22 },
  { label: "Publicité sous-performante", value: 11 },
  { label: "Autres pertes", value: 27 },
] as const;

const DATA_DIAG_TOP_LOSSES = [
  { label: "Abandon panier", value: 3200 },
  { label: "Stocks immobilisés", value: 1800 },
  { label: "Pub sous-perf.", value: 890 },
  { label: "Process manuels", value: 650 },
  { label: "Frais bancaires", value: 420 },
] as const;

const dataDiagPieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
};

const dataDiagBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: "y" as const,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context: any) => `${context.parsed.x.toLocaleString("fr-FR")} €`,
      },
    },
  },
  scales: {
    x: {
      ticks: {
        callback: (value: number | string) => `${Number(value) / 1000}k€`,
      },
      title: {
        display: true,
        text: "Euros",
        color: "var(--color-text-secondary)",
        font: { size: 12 },
      },
    },
    y: {
      ticks: {
        color: "var(--color-text-secondary)",
      },
    },
  },
};

// ─── Benchmarks by sector ─────────────────────────────────────────
const BENCHMARKS: Record<string, { gross_margin: number; net_margin: number; retention: number }> = {
  default: { gross_margin: 45, net_margin: 10, retention: 75 },
  "Tech / SaaS": { gross_margin: 72, net_margin: 18, retention: 88 },
  "E-commerce": { gross_margin: 38, net_margin: 8, retention: 65 },
  "Retail": { gross_margin: 42, net_margin: 6, retention: 60 },
  "Services B2B": { gross_margin: 58, net_margin: 15, retention: 82 },
  "Conseil": { gross_margin: 65, net_margin: 20, retention: 80 },
};

// ─── Criticality Badge ────────────────────────────────────────────
const CriticalityBadge = ({ level }: { level: "critical" | "high" | "medium" }) => {
  const map = {
    critical: { label: "Critique", cls: "bg-red-100 text-red-700 border-red-200" },
    high: { label: "Important", cls: "bg-orange-100 text-orange-700 border-orange-200" },
    medium: { label: "Modéré", cls: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  };
  const { label, cls } = map[level];
  return <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${cls}`}>{label}</span>;
};

// ─── Score Card ───────────────────────────────────────────────────
const ScoreCard = ({ companyData }: { companyData: Record<string, unknown> | null }) => {
  const hs = computeHealthScore(companyData);
  const scores = [
    { label: "Rentabilité", value: hs.financialScore, color: hs.financialScore >= 60 ? "bg-emerald-500" : hs.financialScore >= 40 ? "bg-orange-400" : "bg-red-400" },
    { label: "Efficacité", value: hs.commercialScore, color: hs.commercialScore >= 60 ? "bg-emerald-500" : hs.commercialScore >= 40 ? "bg-orange-400" : "bg-red-400" },
    { label: "Croissance", value: hs.clientScore, color: hs.clientScore >= 60 ? "bg-emerald-500" : hs.clientScore >= 40 ? "bg-orange-400" : "bg-red-400" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Score Business 360°</h3>
        </div>
        <span className="text-2xl font-bold text-foreground">{hs.score}<span className="text-base text-muted-foreground">/100</span></span>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {scores.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-2xl font-bold text-foreground mb-1">{s.value}<span className="text-sm text-muted-foreground">/100</span></p>
            <div className="h-2 rounded-full bg-secondary overflow-hidden mb-1.5">
              <motion.div initial={{ width: 0 }} animate={{ width: `${s.value}%` }} transition={{ duration: 0.8 }}
                className={`h-full rounded-full ${s.color}`} />
            </div>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Benchmark Card ───────────────────────────────────────────────
const BenchmarkCard = ({ companyData }: { companyData: Record<string, unknown> | null }) => {
  const sector = (companyData?.sector as string) ?? "default";
  const bm = BENCHMARKS[sector] ?? BENCHMARKS.default;

  const rows = [
    { label: "Marge brute", yours: companyData?.gross_margin as number | null, bench: bm.gross_margin, unit: "%" },
    { label: "Marge nette", yours: companyData?.net_margin as number | null, bench: bm.net_margin, unit: "%" },
    { label: "Taux de rétention", yours: companyData?.retention_rate as number | null, bench: bm.retention, unit: "%" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Comparaison secteur</h3>
        <span className="text-[10px] text-muted-foreground bg-secondary rounded-full px-2 py-0.5">{sector}</span>
      </div>
      <div className="space-y-3">
        {rows.map((r) => {
          const val = r.yours != null ? Number(r.yours) : null;
          const above = val != null && val >= r.bench;
          return (
            <div key={r.label}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">{r.label}</span>
                <div className="flex items-center gap-2">
                  {val != null ? (
                    <>
                      <span className={`font-semibold ${above ? "text-emerald-600" : "text-orange-500"}`}>
                        {val}{r.unit}
                      </span>
                      {above ? <TrendingUp className="h-3 w-3 text-emerald-500" /> : <TrendingDown className="h-3 w-3 text-orange-400" />}
                    </>
                  ) : <span className="text-muted-foreground">—</span>}
                  <span className="text-muted-foreground">/ moy. {r.bench}{r.unit}</span>
                </div>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden flex gap-0.5">
                {val != null && (
                  <div className={`h-full rounded-full ${above ? "bg-emerald-400" : "bg-orange-400"}`}
                    style={{ width: `${Math.min(100, (val / (r.bench * 1.5)) * 100)}%` }} />
                )}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-muted-foreground mt-3 flex items-center gap-1">
        <Info className="h-3 w-3" /> Benchmarks basés sur les moyennes sectorielles 2024
      </p>
    </div>
  );
};

// ─── Problems Card ────────────────────────────────────────────────
const MOCK_PROBLEMS = [
  { title: "Doublon facturation client détecté", montant: "4 200 €/mois", level: "critical" as const },
  { title: "Abonnements SaaS inutilisés", montant: "89 €/mois", level: "high" as const },
  { title: "Relances manuelles chronophages", montant: "6h/semaine", level: "high" as const },
  { title: "Reporting hebdomadaire manuel", montant: "3h/semaine", level: "medium" as const },
  { title: "Délai moyen de paiement élevé", montant: "45 jours", level: "medium" as const },
];

const ProblemsCard = ({ aiData }: { aiData: Record<string, unknown> | null }) => {
  const problems = (aiData?.problems as typeof MOCK_PROBLEMS | null) ?? MOCK_PROBLEMS;
  const totalLoss = aiData?.total_loss as string | null;

  return (
    <div className="rounded-2xl border-2 border-destructive/20 bg-card p-5">
      {totalLoss && (
        <div className="rounded-xl bg-destructive/8 border border-destructive/20 p-3 mb-4">
          <p className="text-sm font-semibold text-destructive">⚠️ Estimation : vous perdez environ {totalLoss}</p>
        </div>
      )}
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <h3 className="text-sm font-semibold text-foreground">Top 5 problèmes détectés</h3>
      </div>
      <div className="space-y-2">
        {problems.slice(0, 5).map((p, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl bg-secondary/50 p-3">
            <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}.</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{p.title}</p>
              <p className="text-xs font-semibold text-destructive">{p.montant}</p>
            </div>
            <CriticalityBadge level={p.level} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Recommendations Card ─────────────────────────────────────────
const MOCK_RECO = [
  { action: "Relancer 3 factures impayées > 60 jours", gain: "~4 200€ récupérés", delai: "Cette semaine" },
  { action: "Supprimer abonnements SaaS inutilisés", gain: "89€/mois économisés", delai: "Aujourd'hui" },
  { action: "Automatiser les relances clients", gain: "6h/semaine gagnées", delai: "2 semaines" },
];

const RecommendationsCard = ({ aiData }: { aiData: Record<string, unknown> | null }) => {
  const recos = (aiData?.recommendations as typeof MOCK_RECO | null) ?? MOCK_RECO;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">3 recommandations prioritaires</h3>
      </div>
      <div className="space-y-2">
        {recos.slice(0, 3).map((r, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl bg-secondary/50 p-3">
            <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">{r.action}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                <span className="text-emerald-600 font-medium">{r.gain}</span> · {r.delai}
              </p>
            </div>
          </div>
        ))}
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
          <h3 className="text-sm font-semibold text-foreground">Rapport de diagnostic</h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[10px]">
            <Clock className="h-2.5 w-2.5 mr-1" /> J-30
          </Badge>
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
            <Download className="h-3 w-3" /> PDF
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {rapport ?? "Votre score business global est de 70/100. La rentabilité est correcte mais l'efficacité opérationnelle peut être améliorée. Nous avons détecté des pertes mensuelles évitables. En appliquant les 3 recommandations prioritaires, vous pouvez significativement améliorer votre performance."}
      </p>
      {!aiData && (
        <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
          Rapport personnalisé généré après connexion de vos données
        </p>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────
interface DataDiagTabProps {
  onConnect?: () => void;
  dataConnected?: boolean;
  aiResults?: Json;
  companyData?: Record<string, unknown> | null;
}

const DataDiagTab = ({ onConnect, dataConnected, aiResults, companyData }: DataDiagTabProps) => {
  const aiData = (aiResults && typeof aiResults === "object" && !Array.isArray(aiResults))
    ? aiResults as Record<string, unknown>
    : null;

  const content = (
    <div className="space-y-4">
      <ScoreCard companyData={companyData ?? null} />
      <div className="grid lg:grid-cols-2 gap-4">
        <ProblemsCard aiData={aiData} />
        <div className="space-y-4">
          <BenchmarkCard companyData={companyData ?? null} />
          <RecommendationsCard aiData={aiData} />
        </div>
      </div>
      <ReportCard aiData={aiData} />

      <div
        className="rounded-2xl border p-5 mt-6"
        style={{ backgroundColor: "var(--color-background-primary)", borderColor: "var(--color-border-tertiary)" }}
      >
        <h3 className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-secondary)] mb-5">Analyse visuelle</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-[12px] uppercase tracking-[0.24em] text-[var(--color-text-secondary)] mb-3">Répartition des pertes détectées</p>
            <div className="h-[200px]">
              <Pie
                data={{
                  labels: DATA_DIAG_LOSS_DISTRIBUTION.map((item) => item.label),
                  datasets: [
                    {
                      data: DATA_DIAG_LOSS_DISTRIBUTION.map((item) => item.value),
                      backgroundColor: ["#00D4FF", "#0891b2", "#164e63", "#ef4444"],
                      borderWidth: 0,
                    },
                  ],
                }}
                options={dataDiagPieOptions}
              />
            </div>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              {DATA_DIAG_LOSS_DISTRIBUTION.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-[12px] uppercase tracking-[0.24em] text-[var(--color-text-secondary)] mb-3">Top pertes en €/mois</p>
            <div className="h-[200px]">
              <Bar
                data={{
                  labels: DATA_DIAG_TOP_LOSSES.map((item) => item.label),
                  datasets: [
                    {
                      data: DATA_DIAG_TOP_LOSSES.map((item) => item.value),
                      backgroundColor: ["#ef4444", "#f97316", "#0ea5e9", "#0891b2", "#00D4FF"],
                    },
                  ],
                }}
                options={dataDiagBarOptions}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return content;
};

export default DataDiagTab;
