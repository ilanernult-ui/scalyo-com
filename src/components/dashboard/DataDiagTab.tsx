import { Activity, TrendingUp, DollarSign, PiggyBank, Wallet, AlertTriangle, Bell, FileText } from "lucide-react";
import EmptyStateOverlay from "./EmptyStateOverlay";

const ACCENT = "hsl(211, 100%, 45%)";

const mockKpis = [
  { label: "Chiffre d'affaires", value: "450 000 €", change: "+8.2%", icon: DollarSign },
  { label: "Marge brute", value: "28.9%", change: "+1.4 pts", icon: TrendingUp },
  { label: "Charges fixes", value: "320 000 €", change: "-2.1%", icon: PiggyBank },
  { label: "Trésorerie disponible", value: "85 000 €", change: "+12%", icon: Wallet },
];

const mockAnomalies = [
  { title: "Doublon facturation client #2847", criticite: "haute", color: "text-destructive" },
  { title: "Écart TVA collectée vs déclarée", criticite: "moyenne", color: "text-warning" },
  { title: "Charge inhabituelle poste « Sous-traitance »", criticite: "haute", color: "text-destructive" },
  { title: "Délai de paiement fournisseur allongé", criticite: "faible", color: "text-success" },
];

const mockAlerts = [
  { title: "Trésorerie sous seuil critique dans 15 jours", priorite: "Haute", action: "Relancer créances > 60 jours" },
  { title: "Marge brute en baisse de 3 pts sur 3 mois", priorite: "Moyenne", action: "Auditer les coûts matières" },
  { title: "Nouveau crédit d'impôt disponible (CII)", priorite: "Faible", action: "Vérifier l'éligibilité" },
];

const chartData = [
  { month: "Avr", value: 32 }, { month: "Mai", value: 35 }, { month: "Juin", value: 38 },
  { month: "Juil", value: 36 }, { month: "Août", value: 34 }, { month: "Sep", value: 37 },
  { month: "Oct", value: 40 }, { month: "Nov", value: 42 }, { month: "Déc", value: 39 },
  { month: "Jan", value: 44 }, { month: "Fév", value: 43 }, { month: "Mar", value: 45 },
];

const PreviewContent = () => (
  <div className="space-y-6">
    {/* KPIs */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {mockKpis.map((kpi) => (
        <div key={kpi.label} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted-foreground">{kpi.label}</p>
            <kpi.icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground tracking-tight">{kpi.value}</p>
          <p className="text-xs font-medium mt-1 text-success">{kpi.change}</p>
        </div>
      ))}
    </div>

    {/* Chart */}
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
      <h3 className="text-sm font-semibold text-foreground mb-6">Évolution du CA sur 12 mois (k€)</h3>
      <div className="flex items-end gap-2 h-40">
        {chartData.map((d) => (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
            <span className="text-[10px] font-medium text-foreground">{d.value}k</span>
            <div className="w-full rounded-t-lg bg-primary" style={{ height: `${(d.value / 50) * 130}px` }} />
            <span className="text-[10px] text-muted-foreground">{d.month}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="grid lg:grid-cols-2 gap-6">
      {/* Anomalies */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
        <h3 className="text-sm font-semibold text-foreground mb-4">Anomalies détectées</h3>
        <div className="space-y-3">
          {mockAnomalies.map((a, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl bg-secondary/50 p-3">
              <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${a.color}`} />
              <div>
                <p className="text-sm font-medium text-foreground">{a.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 capitalize">Criticité : {a.criticite}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alertes */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
        <h3 className="text-sm font-semibold text-foreground mb-4">Alertes automatiques</h3>
        <div className="space-y-3">
          {mockAlerts.map((a, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl bg-secondary/50 p-3">
              <Bell className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">{a.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Priorité : {a.priorite} · {a.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Rapport */}
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Rapport de diagnostic mensuel</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        La santé financière de votre entreprise est globalement stable avec un chiffre d'affaires en croissance de 8.2% sur le trimestre. 
        Cependant, deux anomalies critiques nécessitent une attention immédiate : un doublon de facturation et un écart de TVA. 
        La trésorerie reste sous surveillance avec un seuil critique prévu dans 15 jours si les créances ne sont pas relancées…
      </p>
    </div>
  </div>
);

const DataDiagTab = () => (
  <EmptyStateOverlay
    icon={Activity}
    serviceName="DataDiag"
    description="Analysez vos données financières pour obtenir un diagnostic complet : détection d'anomalies, KPIs clés, alertes automatiques et rapport mensuel généré par IA."
    accentColor={ACCENT}
  >
    <PreviewContent />
  </EmptyStateOverlay>
);

export default DataDiagTab;
