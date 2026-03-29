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

const PreviewContent = () => (
  <div className="space-y-6">
    {/* Score Business 360° */}
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
      <div className="flex items-center gap-2 mb-5">
        <Target className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Score Business 360°</h3>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {mockScores.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-3xl font-bold text-foreground mb-1">{s.value}<span className="text-base text-muted-foreground">/100</span></p>
            <div className="h-2 rounded-full bg-secondary overflow-hidden mb-1.5">
              <div className={`h-full rounded-full ${s.color} transition-all`} style={{ width: `${s.value}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Estimation perte */}
    <div className="rounded-2xl border-2 border-destructive/30 bg-destructive/5 p-6">
      <p className="text-sm font-semibold text-destructive mb-1">⚠️ Estimation : vous perdez environ 6 169 €/mois</p>
      <p className="text-xs text-muted-foreground">Pertes d'argent et de temps détectées par l'analyse de vos données.</p>
    </div>

    <div className="grid lg:grid-cols-2 gap-6">
      {/* Pertes détectées */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
        <h3 className="text-sm font-semibold text-foreground mb-4">Pertes détectées</h3>
        <div className="space-y-3">
          {mockPertes.map((p, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl bg-secondary/50 p-3">
              <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${p.color}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{p.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 font-semibold">{p.montant}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top 5 actions rapides */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Top 5 actions rapides</h3>
        </div>
        <div className="space-y-3">
          {mockActions.map((a, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl bg-secondary/50 p-3">
              <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{a.action}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{a.gain} · {a.delai}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Rapport IA */}
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Rapport IA mensuel</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Votre score business global est de 70/100. La rentabilité est correcte mais l'efficacité opérationnelle peut être améliorée. 
        Nous avons détecté 6 169€ de pertes mensuelles évitables. En appliquant les 5 actions prioritaires ci-dessus, 
        vous pouvez récupérer jusqu'à 4 769€/mois et gagner 9h/semaine dès les premières semaines.
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
