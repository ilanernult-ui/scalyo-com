import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart, ShieldCheck, TrendingDown, Users, AlertTriangle,
  Gift, Star, ArrowUpRight, FileText, Download, Clock, Zap
} from "lucide-react";
import { Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, CategoryScale,
  LinearScale, BarElement, PointElement, LineElement, Filler,
  BarController, LineController, PieController, Legend } from "chart.js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Json } from "@/integrations/supabase/types";

const ACCENT = "hsl(262, 60%, 55%)";
const ACCENT_BG = "hsl(262, 60%, 55%, 0.12)";

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

const LOYALTY_LOOP_SEGMENTS = [
  { label: "Clients VIP fidèles", value: 62, count: 773 },
  { label: "Clients réguliers", value: 24, count: 299 },
  { label: "Clients à risque", value: 10, count: 125 },
  { label: "Churn ce mois", value: 4, count: 48 },
] as const;

const LOYALTY_LOOP_CHURN_HISTORY = [
  { month: "Nov", value: 5.8 },
  { month: "Déc", value: 5.4 },
  { month: "Jan", value: 5.0 },
  { month: "Fév", value: 4.7 },
  { month: "Mar", value: 4.5 },
  { month: "Avr", value: 4.2 },
] as const;

const loyaltyLoopPieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
};

const loyaltyLoopLineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context: any) => `${context.parsed.y}%`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "var(--color-text-secondary)" },
    },
    y: {
      reverse: true,
      grid: { display: false },
      ticks: {
        callback: (value: number | string) => `${value}%`,
        color: "var(--color-text-secondary)",
      },
      min: 3,
      max: 6,
    },
  },
};

// ─── Sub-tab navigation ───────────────────────────────────────────
type SubTab = "retention" | "fidelisation";

const SUB_TABS: { id: SubTab; label: string }[] = [
  { id: "retention", label: "Rétention" },
  { id: "fidelisation", label: "Fidélisation" },
];

// ─── Rétention Dashboard ──────────────────────────────────────────
const mockChurnSegments = [
  { segment: "Grands comptes", churnScore: 18, clients: 45, risk: "low" as const },
  { segment: "PME Tech", churnScore: 42, clients: 120, risk: "medium" as const },
  { segment: "TPE / Indépendants", churnScore: 67, clients: 89, risk: "high" as const },
  { segment: "Nouveaux clients (<3 mois)", churnScore: 54, clients: 86, risk: "medium" as const },
];

const mockChurnHistory = [
  { month: "Oct", rate: 5.8 }, { month: "Nov", rate: 5.4 },
  { month: "Déc", rate: 5.0 }, { month: "Jan", rate: 4.7 },
  { month: "Fév", rate: 4.5 }, { month: "Mar", rate: 4.2 },
];

const mockAlerts = [
  { client: "Dupont & Associés", lastActivity: "68 jours", score: 74, action: "Appel CSM urgent" },
  { client: "TechStart SAS", lastActivity: "45 jours", score: 61, action: "Email de réactivation" },
  { client: "Innova Corp", lastActivity: "32 jours", score: 52, action: "Offre de renouvellement" },
];

const riskConfig = {
  low: { label: "Faible", color: "text-emerald-600", bar: "bg-emerald-400" },
  medium: { label: "Moyen", color: "text-orange-500", bar: "bg-orange-400" },
  high: { label: "Élevé", color: "text-red-500", bar: "bg-red-400" },
};

const RetentionDashboard = ({ aiData }: { aiData: Record<string, unknown> | null }) => {
  const segments = (aiData?.churn_segments as typeof mockChurnSegments | null) ?? mockChurnSegments;
  const history = (aiData?.churn_history as typeof mockChurnHistory | null) ?? mockChurnHistory;
  const alerts = (aiData?.churn_alerts as typeof mockAlerts | null) ?? mockAlerts;
  const maxRate = Math.max(...history.map((h) => h.rate));
  const latestRate = history[history.length - 1]?.rate ?? 0;
  const retentionScore = Math.round(100 - latestRate * 10);

  return (
    <div className="space-y-4">
      {/* Score rétention */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { label: "Score rétention", value: `${retentionScore}/100`, sub: "Excellent si > 85" },
          { label: "Taux de churn", value: `${latestRate}%`, sub: "Moy. SaaS B2B : 5%" },
          { label: "Clients à risque", value: `${alerts.length}`, sub: "Action requise" },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground mb-1">{k.label}</p>
            <p className="text-xl font-bold text-foreground">{k.value}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Churn evolution bar chart */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Évolution du churn (%)</h3>
        <div className="flex items-end gap-2 h-28">
          {history.map((h, i) => (
            <div key={h.month} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] font-medium text-foreground">{h.rate}%</span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(h.rate / maxRate) * 80}px` }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="w-full rounded-t-lg"
                style={{ backgroundColor: ACCENT, opacity: i === history.length - 1 ? 1 : 0.5 }}
              />
              <span className="text-[10px] text-muted-foreground">{h.month}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-emerald-600 font-medium mt-2 flex items-center gap-1">
          <TrendingDown className="h-3 w-3" /> Churn en baisse de {((mockChurnHistory[0].rate - latestRate) / mockChurnHistory[0].rate * 100).toFixed(0)}% sur 6 mois
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Churn par segment */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4" style={{ color: ACCENT }} />
            <h3 className="text-sm font-semibold text-foreground">Risque churn par segment</h3>
          </div>
          <div className="space-y-3">
            {segments.map((s) => {
              const rc = riskConfig[s.risk];
              return (
                <div key={s.segment}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{s.segment}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-medium ${rc.color}`}>{rc.label}</span>
                      <span className="font-bold text-foreground">{s.churnScore}</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.churnScore}%` }}
                      transition={{ duration: 0.7 }}
                      className={`h-full rounded-full ${rc.bar}`}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{s.clients} clients</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alertes prédictives */}
        <div className="rounded-2xl border-2 border-destructive/20 bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <h3 className="text-sm font-semibold text-foreground">Alertes prédictives</h3>
          </div>
          <div className="space-y-2">
            {alerts.map((a, i) => (
              <div key={i} className="rounded-xl bg-destructive/5 border border-destructive/10 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.client}</p>
                    <p className="text-[11px] text-muted-foreground">Inactif depuis {a.lastActivity}</p>
                  </div>
                  <span className="text-[10px] font-bold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded-full">{a.score}</span>
                </div>
                <p className="text-xs text-primary font-medium mt-1.5 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" /> {a.action}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Fidélisation Dashboard ───────────────────────────────────────
const mockPrograms = [
  { name: "Programme Ambassadeur", members: 34, upsellRate: 42, status: "active" as const },
  { name: "Early Access Beta", members: 87, upsellRate: 28, status: "active" as const },
  { name: "Club Premium (>24 mois)", members: 19, upsellRate: 61, status: "active" as const },
];

const mockUpsells = [
  { from: "DataDiag", to: "GrowthPilot", opportunities: 28, revenue: "5 292 €/mois" },
  { from: "GrowthPilot", to: "LoyaltyLoop", opportunities: 14, revenue: "2 240 €/mois" },
];

const mockCrossells = [
  { product: "Module Reporting PDF", targetClients: 45, conversionRate: 18, gain: "+15 min par rapport" },
  { product: "Connecteur Shopify", targetClients: 23, conversionRate: 31, gain: "+28% données e-comm" },
];

const FidelisationDashboard = ({ aiData }: { aiData: Record<string, unknown> | null }) => {
  const programs = (aiData?.loyalty_programs as typeof mockPrograms | null) ?? mockPrograms;
  const upsells = (aiData?.upsell_opportunities as typeof mockUpsells | null) ?? mockUpsells;
  const crossells = (aiData?.crosssell_opportunities as typeof mockCrossells | null) ?? mockCrossells;
  const totalUpsellRevenue = upsells.reduce((s, u) => s + parseInt(u.revenue.replace(/[^0-9]/g, "")), 0);

  return (
    <div className="space-y-4">
      {/* Programmes fidélité */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Gift className="h-4 w-4" style={{ color: ACCENT }} />
          <h3 className="text-sm font-semibold text-foreground">Programmes de fidélité actifs</h3>
        </div>
        <div className="space-y-3">
          {programs.map((p) => (
            <div key={p.name} className="flex items-center gap-4 rounded-xl bg-secondary/50 p-3">
              <Star className="h-4 w-4 text-yellow-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.members} membres</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-600">{p.upsellRate}%</p>
                <p className="text-[10px] text-muted-foreground">taux upsell</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upsell opportunities */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Opportunités upsell</h3>
          </div>
          <Badge variant="secondary" className="text-[10px] text-emerald-600">
            ~{(totalUpsellRevenue / 1000).toFixed(1)}k€/mois potentiels
          </Badge>
        </div>
        <div className="space-y-2">
          {upsells.map((u, i) => (
            <div key={i} className="rounded-xl bg-secondary/50 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-muted-foreground">{u.from}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
                  <span className="font-semibold text-foreground">{u.to}</span>
                </div>
                <span className="text-xs font-bold text-emerald-600">{u.revenue}</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">{u.opportunities} clients éligibles identifiés</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-sell */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="h-4 w-4" style={{ color: ACCENT }} />
          <h3 className="text-sm font-semibold text-foreground">Cross-sell recommandé</h3>
        </div>
        <div className="space-y-2">
          {crossells.map((c, i) => (
            <div key={i} className="rounded-xl bg-secondary/50 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{c.product}</p>
                  <p className="text-[11px] text-muted-foreground">{c.targetClients} clients cibles · {c.conversionRate}% conv. estimée</p>
                </div>
                <span className="text-[10px] text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full shrink-0">{c.gain}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Actions fidélisation prioritaires</h3>
        </div>
        <div className="space-y-2">
          {[
            { text: "Contacter 28 clients DataDiag éligibles GrowthPilot (usage élevé)", gain: "+5 292€/mois" },
            { text: "Déployer programme ambassadeur sur segment 12–18 mois d'ancienneté", gain: "+42% upsell taux" },
            { text: "Proposer module Reporting PDF aux 45 clients sans export actif", gain: "+8 clients add-on" },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl bg-secondary/50 p-3">
              <span className="w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: ACCENT_BG, color: ACCENT }}>{i + 1}</span>
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
          <h3 className="text-sm font-semibold text-foreground">Rapport LoyaltyLoop</h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[10px]">
            <Clock className="h-2.5 w-2.5 mr-1" /> Ce mois
          </Badge>
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
            <Download className="h-3 w-3" /> PDF
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {rapport ?? "Votre taux de churn est en baisse constante (-28% sur 6 mois). 3 clients à risque immédiat ont été identifiés et nécessitent une intervention CSM. Le potentiel upsell non exploité représente ~7 500€/mois. Priorité : contacter les 28 clients DataDiag éligibles GrowthPilot."}
      </p>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────
interface LoyaltyLoopTabProps {
  onConnect?: () => void;
  dataConnected?: boolean;
  aiResults?: Json;
}

const LoyaltyLoopTab = ({ onConnect, dataConnected, aiResults }: LoyaltyLoopTabProps) => {
  const [subTab, setSubTab] = useState<SubTab>("retention");

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
      {subTab === "retention" && <RetentionDashboard aiData={aiData} />}
      {subTab === "fidelisation" && <FidelisationDashboard aiData={aiData} />}

      <ReportCard aiData={aiData} />

      <div
        className="rounded-2xl border p-5 mt-6"
        style={{ backgroundColor: "var(--color-background-primary)", borderColor: "var(--color-border-tertiary)" }}
      >
        <h3 className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-secondary)] mb-5">Analyse clients</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-[12px] uppercase tracking-[0.24em] text-[var(--color-text-secondary)] mb-3">Segmentation clients</p>
            <div className="h-[200px]">
              <Pie
                data={{
                  labels: LOYALTY_LOOP_SEGMENTS.map((item) => item.label),
                  datasets: [
                    {
                      data: LOYALTY_LOOP_SEGMENTS.map((item) => item.value),
                      backgroundColor: ["#FFD700", "#9B59B6", "#f97316", "#ef4444"],
                      borderWidth: 0,
                    },
                  ],
                }}
                options={loyaltyLoopPieOptions}
              />
            </div>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              {LOYALTY_LOOP_SEGMENTS.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span>{item.label}</span>
                  <span>{item.count} clients</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-[12px] uppercase tracking-[0.24em] text-[var(--color-text-secondary)] mb-3">Évolution du churn — 6 mois</p>
            <div className="h-[200px]">
              <Line
                data={{
                  labels: LOYALTY_LOOP_CHURN_HISTORY.map((item) => item.month),
                  datasets: [
                    {
                      label: "Churn",
                      data: LOYALTY_LOOP_CHURN_HISTORY.map((item) => item.value),
                      borderColor: "#FFD700",
                      backgroundColor: "rgba(255,215,0,0.1)",
                      fill: true,
                      tension: 0.35,
                      pointRadius: 3,
                      pointBackgroundColor: "#FFD700",
                    },
                  ],
                }}
                options={loyaltyLoopLineOptions}
              />
            </div>
            <div className="mt-3 rounded-xl border border-dashed border-red-500 bg-red-50/40 p-3 text-xs text-red-700">
              Objectif : <strong>&lt;3%</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return content;
};

export default LoyaltyLoopTab;
