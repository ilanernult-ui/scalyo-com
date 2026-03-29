import { Activity, TrendingUp, DollarSign, PiggyBank, Wallet, AlertTriangle, Clock, Zap, FileText, Target } from "lucide-react";
import EmptyStateOverlay from "./EmptyStateOverlay";
import type { Json } from "@/integrations/supabase/types";

const ACCENT = "hsl(211, 100%, 45%)";

const mockScores = [
  { label: "Rentabilité", value: 72, color: "bg-success" },
  { label: "Efficacité", value: 58, color: "bg-warning" },
  { label: "Croissance", value: 81, color: "bg-primary" },
];

const mockPertes = [
  { title: "💸 Doublon facturation client #2847", montant: "4 200 €/mois", type: "argent", color: "text-destructive" },
  { title: "💸 Abonnement outil Y inutilisé", montant: "89 €/mois", type: "argent", color: "text-destructive" },
  { title: "⏳ Relances manuelles clients", montant: "6h/semaine", type: "temps", color: "text-warning" },
  { title: "⏳ Reporting manuel hebdomadaire", montant: "3h/semaine", type: "temps", color: "text-warning" },
  { title: "💸 Écart TVA collectée vs déclarée", montant: "1 800 €/mois", type: "argent", color: "text-destructive" },
];

const mockActions = [
  { action: "Relancer 3 factures impayées > 60 jours", gain: "~4 200€ récupérés", delai: "Cette semaine" },
  { action: "Renégocier contrat sous-traitance poste X", gain: "380€/mois économisés", delai: "2 semaines" },
  { action: "Supprimer abonnement outil Y inutilisé", gain: "89€/mois", delai: "Aujourd'hui" },
  { action: "Réduire délai paiement moyen 45j → 30j", gain: "+12k€ trésorerie", delai: "1 mois" },
  { action: "Automatiser relance client", gain: "6h/semaine gagnées", delai: "2 semaines" },
];

const chartData = [
  { month: "Avr", value: 32 }, { month: "Mai", value: 35 }, { month: "Juin", value: 38 },
  { month: "Juil", value: 36 }, { month: "Août", value: 34 }, { month: "Sep", value: 37 },
  { month: "Oct", value: 40 }, { month: "Nov", value: 42 }, { month: "Déc", value: 39 },
  { month: "Jan", value: 44 }, { month: "Fév", value: 43 }, { month: "Mar", value: 45 },
];

const PreviewContent = () => (
  <div className="space-y-6">
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

const AiResultsContent = ({ data }: { data: Record<string, unknown> }) => {
  const rapport = typeof data.rapport === "string" ? data.rapport : typeof data.analysis === "string" ? data.analysis : JSON.stringify(data, null, 2);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Résultats de l'analyse DataDiag</h3>
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {rapport}
        </div>
      </div>
    </div>
  );
};

interface DataDiagTabProps {
  onConnect?: () => void;
  dataConnected?: boolean;
  aiResults?: Json;
}

const DataDiagTab = ({ onConnect, dataConnected, aiResults }: DataDiagTabProps) => {
  if (dataConnected && aiResults && typeof aiResults === "object" && !Array.isArray(aiResults)) {
    return <AiResultsContent data={aiResults as Record<string, unknown>} />;
  }

  if (dataConnected) return <PreviewContent />;

  return (
    <EmptyStateOverlay
      icon={Activity}
      serviceName="DataDiag"
      description="Analysez vos données financières pour obtenir un diagnostic complet : détection d'anomalies, KPIs clés, alertes automatiques et rapport mensuel généré par IA."
      accentColor={ACCENT}
      onConnect={onConnect}
      buttonLabel={dataConnected ? "Mettre à jour mes données" : "Connecter mes données"}
    >
      <PreviewContent />
    </EmptyStateOverlay>
  );
};

export default DataDiagTab;
