import { Rocket, TrendingUp, ShoppingCart, UserPlus, BarChart3, Target, FileText } from "lucide-react";
import EmptyStateOverlay from "./EmptyStateOverlay";
import type { Json } from "@/integrations/supabase/types";

const ACCENT = "hsl(142, 69%, 49%)";

const mockKpis = [
  { label: "Croissance estimée", value: "+15%", change: "sur 90 jours", icon: TrendingUp },
  { label: "Temps gagné", value: "10h", change: "/semaine", icon: BarChart3 },
  { label: "Revenus additionnels", value: "+4 650 €", change: "/mois estimés", icon: ShoppingCart },
  { label: "Actions en cours", value: "5", change: "cette semaine", icon: UserPlus },
];

const mockActions = [
  { action: "Relancer les paniers abandonnés avec séquence email", gain: "+2 400€/mois", delai: "Cette semaine", priorite: 1 },
  { action: "Automatiser le suivi post-vente", gain: "3h/semaine gagnées", delai: "2 semaines", priorite: 2 },
  { action: "Optimiser page de paiement (3 frictions détectées)", gain: "+8% conversion", delai: "1 semaine", priorite: 3 },
  { action: "Lancer offre bundle sur 2 produits phares", gain: "+1 800€/mois", delai: "2 semaines", priorite: 4 },
  { action: "Supprimer 2 canaux d'acquisition non rentables", gain: "450€/mois économisés", delai: "Aujourd'hui", priorite: 5 },
];

const mockAutomations = [
  { titre: "Relance panier abandonné → email J+1, J+3, J+7", impact: "+2 400€/mois", status: "Prêt à déployer" },
  { titre: "Suivi post-vente automatique → NPS + upsell", impact: "3h/semaine gagnées", status: "Recommandé" },
  { titre: "Qualification leads entrants → scoring automatique", impact: "+12% conversion", status: "Recommandé" },
];

const chartData = [
  { month: "Oct", ventes: 18, conv: 2.4 }, { month: "Nov", ventes: 22, conv: 2.7 },
  { month: "Déc", ventes: 19, conv: 2.5 }, { month: "Jan", ventes: 26, conv: 3.0 },
  { month: "Fév", ventes: 30, conv: 3.1 }, { month: "Mar", ventes: 35, conv: 3.2 },
];

const potentielColors: Record<string, string> = {
  "Élevé": "text-success",
  "Moyen": "text-warning",
  "Faible": "text-muted-foreground",
};

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

    {/* Gains estimés banner */}
    <div className="rounded-2xl border-2 border-success/30 bg-success/5 p-6">
      <p className="text-sm font-semibold text-success mb-1">🚀 Gains estimés : +4 650€/mois et +10h/semaine</p>
      <p className="text-xs text-muted-foreground">En appliquant le plan d'action priorisé ci-dessous sur 90 jours.</p>
    </div>

    <div className="grid lg:grid-cols-2 gap-6">
      {/* Plan d'action priorisé */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-4 w-4 text-success" />
          <h3 className="text-sm font-semibold text-foreground">Plan d'action PRIORISÉ par ROI</h3>
        </div>
        <div className="space-y-3">
          {mockActions.map((a) => (
            <div key={a.priorite} className="flex items-start gap-3 rounded-xl bg-secondary/50 p-3">
              <span className="w-5 h-5 rounded-full bg-success/15 text-success text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {a.priorite}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{a.action}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{a.gain} · {a.delai}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Automatisations recommandées */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
        <div className="flex items-center gap-2 mb-4">
          <Rocket className="h-4 w-4 text-success" />
          <h3 className="text-sm font-semibold text-foreground">Automatisations recommandées</h3>
        </div>
        <div className="space-y-3">
          {mockAutomations.map((a, i) => (
            <div key={i} className="rounded-xl bg-secondary/50 p-3">
              <p className="text-sm font-medium text-foreground">{a.titre}</p>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[11px] text-success font-medium">{a.impact}</span>
                <span className="text-[10px] bg-success/10 text-success px-2 py-0.5 rounded-full font-medium">{a.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Rapport */}
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="h-4 w-4 text-success" />
        <h3 className="text-sm font-semibold text-foreground">Rapport hebdomadaire — l'IA vous explique COMMENT</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Cette semaine, concentrez-vous sur la relance des paniers abandonnés : voici les 4 étapes exactes pour mettre en place la séquence email. 
        Résultat attendu : +2 400€/mois. Ensuite, supprimez les 2 canaux d'acquisition non rentables identifiés (Google Display et LinkedIn Ads organiques) 
        pour économiser 450€/mois immédiatement. Votre croissance estimée sur 90 jours : +15%.
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
          <FileText className="h-4 w-4 text-success" />
          <h3 className="text-sm font-semibold text-foreground">Résultats de l'analyse GrowthPilot</h3>
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {rapport}
        </div>
      </div>
    </div>
  );
};

interface GrowthPilotTabProps {
  onConnect?: () => void;
  dataConnected?: boolean;
  aiResults?: Json;
}

const GrowthPilotTab = ({ onConnect, dataConnected, aiResults }: GrowthPilotTabProps) => {
  if (dataConnected && aiResults && typeof aiResults === "object" && !Array.isArray(aiResults)) {
    return <AiResultsContent data={aiResults as Record<string, unknown>} />;
  }

  if (dataConnected) return <PreviewContent />;

  return (
    <EmptyStateOverlay
      icon={Rocket}
      serviceName="GrowthPilot"
      description="Votre co-pilote IA : plan d'action priorisé par ROI, quick wins avec gains estimés en €, automatisations recommandées. Résultat moyen : +15% de croissance et +10h gagnées/semaine."
      accentColor={ACCENT}
      onConnect={onConnect}
      buttonLabel={dataConnected ? "Mettre à jour mes données" : "Connecter mes données"}
    >
      <PreviewContent />
    </EmptyStateOverlay>
  );
};

export default GrowthPilotTab;
