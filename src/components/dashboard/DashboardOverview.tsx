import { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign, TrendingUp, Users, ShoppingCart, Activity,
  Zap, Database, ChevronRight, BarChart3, Wallet, Pencil, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedNumber from "@/components/ui/animated-number";
import type { PlanType } from "@/contexts/AuthContext";
import type { Json } from "@/integrations/supabase/types";
import SavingsWidget from "./SavingsWidget";
import TopProblemsCard from "./TopProblemsCard";
import LossesSection from "./LossesSection";
import type { DetectedProblem, LossPoint, SavingsSummary } from "@/hooks/useDashboardEnrichment";

interface DashboardOverviewProps {
  plan: PlanType;
  dataConnected: boolean;
  companyData: Record<string, unknown> | null;
  onConnect: () => void;
  onGenerate: () => void;
  generatingAnalysis: boolean;
  problems?: DetectedProblem[];
  losses?: LossPoint[];
  savings?: SavingsSummary;
}

const planKpis: Record<PlanType, { label: string; key: string; icon: typeof DollarSign; format: (v: unknown) => string }[]> = {
  datadiag: [
    { label: "Chiffre d'affaires", key: "current_month_revenue", icon: DollarSign, format: (v) => v ? `${Number(v).toLocaleString("fr-FR")} €` : "—" },
    { label: "Marge brute", key: "gross_margin", icon: TrendingUp, format: (v) => v ? `${v}%` : "—" },
    { label: "Trésorerie", key: "cash_available", icon: Wallet, format: (v) => v ? `${Number(v).toLocaleString("fr-FR")} €` : "—" },
    { label: "Factures impayées", key: "unpaid_invoices", icon: Activity, format: (v) => v ? String(v) : "0" },
  ],
  growthpilot: [
    { label: "Chiffre d'affaires", key: "current_month_revenue", icon: DollarSign, format: (v) => v ? `${Number(v).toLocaleString("fr-FR")} €` : "—" },
    { label: "Taux de conversion", key: "conversion_rates", icon: TrendingUp, format: (v) => { if (Array.isArray(v) && v.length) return `${v[0]}%`; return "—"; } },
    { label: "Panier moyen", key: "avg_basket", icon: ShoppingCart, format: (v) => v ? `${Number(v).toLocaleString("fr-FR")} €` : "—" },
    { label: "CAC", key: "cac", icon: BarChart3, format: (v) => v ? `${Number(v).toLocaleString("fr-FR")} €` : "—" },
  ],
  loyaltyloop: [
    { label: "Chiffre d'affaires", key: "current_month_revenue", icon: DollarSign, format: (v) => v ? `${Number(v).toLocaleString("fr-FR")} €` : "—" },
    { label: "Taux de rétention", key: "retention_rate", icon: Users, format: (v) => v ? `${v}%` : "—" },
    { label: "NPS", key: "nps_score", icon: Activity, format: (v) => v ? String(v) : "—" },
    { label: "Clients VIP", key: "vip_clients", icon: Zap, format: (v) => v ? String(v) : "0" },
  ],
};

const dataTabs: Record<PlanType, { id: string; label: string }[]> = {
  datadiag: [{ id: "financier", label: "Financier" }],
  growthpilot: [{ id: "financier", label: "Financier" }, { id: "commercial", label: "Commercial" }],
  loyaltyloop: [{ id: "financier", label: "Financier" }, { id: "commercial", label: "Commercial" }, { id: "clients", label: "Clients" }],
};

const dataFields: Record<string, { label: string; key: string; format: (v: unknown) => string }[]> = {
  financier: [
    { label: "Revenus MRR", key: "current_month_revenue", format: (v) => v ? `${Number(v).toLocaleString("fr-FR")} €` : "—" },
    { label: "Charges fixes", key: "fixed_costs", format: (v) => v ? `${Number(v).toLocaleString("fr-FR")} €` : "—" },
    { label: "Marge brute", key: "gross_margin", format: (v) => v ? `${v}%` : "—" },
    { label: "Trésorerie", key: "cash_available", format: (v) => v ? `${Number(v).toLocaleString("fr-FR")} €` : "—" },
    { label: "Impayés", key: "unpaid_amount", format: (v) => v ? `${Number(v).toLocaleString("fr-FR")} €` : "—" },
  ],
  commercial: [
    { label: "Clients actifs", key: "active_clients", format: (v) => v ? String(v) : "—" },
    { label: "Panier moyen", key: "avg_basket", format: (v) => v ? `${Number(v).toLocaleString("fr-FR")} €` : "—" },
    { label: "Coût d'acquisition", key: "cac", format: (v) => v ? `${Number(v).toLocaleString("fr-FR")} €` : "—" },
    { label: "LTV", key: "ltv", format: (v) => v ? `${Number(v).toLocaleString("fr-FR")} €` : "—" },
    { label: "Budget marketing", key: "marketing_budget", format: (v) => v ? `${Number(v).toLocaleString("fr-FR")} €` : "—" },
  ],
  clients: [
    { label: "Total clients", key: "total_clients", format: (v) => v ? String(v) : "—" },
    { label: "Actifs 30j", key: "active_clients_30d", format: (v) => v ? String(v) : "—" },
    { label: "Taux rétention", key: "retention_rate", format: (v) => v ? `${v}%` : "—" },
    { label: "NPS", key: "nps_score", format: (v) => v ? String(v) : "—" },
    { label: "Clients VIP", key: "vip_clients", format: (v) => v ? String(v) : "—" },
  ],
};

const currentMonth = () => {
  const d = new Date();
  return d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
};

const DashboardOverview = ({
  plan, dataConnected, companyData, onConnect, onGenerate, generatingAnalysis,
  problems = [], losses = [], savings = { thisMonth: 0, total: 0, recent: [] },
}: DashboardOverviewProps) => {
  const [activeDataTab, setActiveDataTab] = useState(dataTabs[plan][0].id);
  const kpis = planKpis[plan];
  const tabs = dataTabs[plan];

  return (
    <div className="space-y-6">
      {/* Économies réalisées */}
      <SavingsWidget thisMonth={savings.thisMonth} total={savings.total} />

      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground tracking-tight">
            Vue d'ensemble — {currentMonth().charAt(0).toUpperCase() + currentMonth().slice(1)}
          </h2>
          {companyData?.company_name ? (
            <p className="text-sm text-muted-foreground mt-0.5">{String(companyData.company_name)}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            size="lg"
            onClick={onConnect}
            className="gap-2 px-6 py-3 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-pill"
          >
            <Pencil className="h-4 w-4" />
            Mettre à jour mes données
          </Button>
          {dataConnected && (
            <Button
              size="lg"
              onClick={onGenerate}
              disabled={generatingAnalysis}
              className="gap-2 px-6 py-3 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded-pill"
            >
              <Sparkles className="h-4 w-4" />
              {generatingAnalysis ? "Analyse en cours…" : "Générer mon analyse"}
            </Button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi, i) => {
          const val = companyData ? companyData[kpi.key] : undefined;
          const numeric = typeof val === "number" ? val : Number(val);
          const animatable = dataConnected && Number.isFinite(numeric) && numeric !== 0;
          const formatted = dataConnected && companyData ? kpi.format(val) : "—";
          const isCurrency = formatted.includes("€");
          const isPercent = formatted.includes("%");
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -2 }}
              className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-[var(--shadow-sm)] transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] sm:text-xs text-muted-foreground">{kpi.label}</p>
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-lg sm:text-2xl font-bold text-foreground tracking-tight">
                {animatable ? (
                  <AnimatedNumber
                    value={numeric}
                    duration={1400}
                    delay={i * 80}
                    suffix={isCurrency ? " €" : isPercent ? "%" : ""}
                  />
                ) : (
                  formatted
                )}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Top 5 problèmes détectés */}
      {dataConnected && problems.length > 0 && (
        <TopProblemsCard problems={problems} onFix={() => onGenerate()} />
      )}

      {/* Pertes détectées */}
      {dataConnected && losses.length > 0 && (
        <LossesSection losses={losses} onGeneratePlan={onGenerate} generating={generatingAnalysis} />
      )}

      {/* Data prompt removed (redundant with header) */}

      {!dataConnected && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border bg-secondary/50 p-8 text-center"
        >
          <Database className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">Connectez vos données pour commencer</p>
          <p className="text-xs text-muted-foreground mb-4">
            Importez vos fichiers CSV, Excel ou saisissez vos données manuellement.
          </p>
          <Button onClick={onConnect} className="gap-2">
            <Database className="h-4 w-4" />
            Connecter mes données
          </Button>
        </motion.div>
      )}

      {/* Mes données section */}
      {dataConnected && companyData && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-border bg-card shadow-[var(--shadow-sm)] overflow-hidden"
        >
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Mes données</h3>
            <Button size="sm" onClick={onConnect} className="gap-1.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-pill">
              <Pencil className="h-3.5 w-3.5" />
              Ajouter des données
            </Button>
          </div>

          {/* Tabs */}
          <div className="px-5 flex gap-1 border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveDataTab(tab.id)}
                className={`px-3 py-2 text-xs font-medium rounded-t-lg transition-colors ${
                  activeDataTab === tab.id
                    ? "bg-secondary text-foreground border border-border border-b-transparent -mb-px"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Data rows */}
          <div className="p-5">
            <div className="space-y-2">
              {(dataFields[activeDataTab] || []).map((field) => {
                const val = companyData[field.key];
                return (
                  <div key={field.key} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-secondary/50 transition-colors">
                    <span className="text-sm text-muted-foreground">{field.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{field.format(val)}</span>
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardOverview;
