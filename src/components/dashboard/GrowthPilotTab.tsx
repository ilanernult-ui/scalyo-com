import { useState } from "react";
import { motion } from "framer-motion";
import {
  Rocket, TrendingUp, TrendingDown, DollarSign, Users, BarChart3,
  Target, MousePointerClick, ShoppingCart, Zap, FileText, Download,
  Clock, Badge as BadgeIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EmptyStateOverlay from "./EmptyStateOverlay";
import type { Json } from "@/integrations/supabase/types";

const ACCENT = "hsl(142, 69%, 49%)";

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
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Recommandations acquisition</h3>
        </div>
        <div className="space-y-2">
          {[
            { text: "Réduire budget LinkedIn Ads de 40% (CPA x3 vs SEO)", gain: "−284€/mois économisés" },
            { text: "Doubler investissement SEO : 3 articles/semaine cibles identifiées", gain: "+18% de trafic organique" },
            { text: "Déployer programme de parrainage (conversion x2.2 vs payant)", gain: "+8 leads qualifiés/mois" },
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
    </div>
  );

  if (dataConnected) return content;

  return (
    <EmptyStateOverlay
      icon={Rocket}
      serviceName="GrowthPilot"
      description="Votre co-pilote IA : acquisition multi-canal, suivi MRR/ARR, analyse produit et NPS. Résultat moyen : +15% de croissance et +10h gagnées/semaine."
      accentColor={ACCENT}
      onConnect={onConnect}
      buttonLabel="Connecter mes données"
    >
      {content}
    </EmptyStateOverlay>
  );
};

export default GrowthPilotTab;
