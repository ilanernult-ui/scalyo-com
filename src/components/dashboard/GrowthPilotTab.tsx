import { Rocket, TrendingUp, ShoppingCart, UserPlus, BarChart3, Target, Lightbulb, FileText } from "lucide-react";
import EmptyStateOverlay from "./EmptyStateOverlay";

const ACCENT = "hsl(142, 69%, 49%)";

const mockKpis = [
  { label: "Taux de conversion", value: "3.2%", change: "+0.4 pts", icon: TrendingUp },
  { label: "Panier moyen", value: "2 400 €", change: "+180 €", icon: ShoppingCart },
  { label: "Nouveaux clients", value: "47", change: "+12%", icon: UserPlus },
  { label: "Taux de croissance", value: "14.8%", change: "+2.1 pts", icon: BarChart3 },
];

const mockActions = [
  { action: "Optimiser les pages de conversion (CTA, formulaire)", delai: "2 semaines", impact: "Élevé", priorite: 1 },
  { action: "Lancer campagne de nurturing email sur les leads tièdes", delai: "1 semaine", impact: "Élevé", priorite: 2 },
  { action: "Tester un pricing tier intermédiaire", delai: "1 mois", impact: "Moyen", priorite: 3 },
  { action: "Développer un programme de parrainage", delai: "3 semaines", impact: "Moyen", priorite: 4 },
  { action: "Automatiser la qualification des leads entrants", delai: "2 semaines", impact: "Élevé", priorite: 5 },
];

const mockOpportunities = [
  { titre: "Segment PME Tech non adressé", potentiel: "Élevé", description: "Marché de 12 000 entreprises en France, penetration actuelle < 1%." },
  { titre: "Upsell sur la base clients existante", potentiel: "Élevé", description: "68% des clients n'utilisent qu'un seul module. Potentiel de +40% ARPU." },
  { titre: "Partenariats intégrateurs", potentiel: "Moyen", description: "3 intégrateurs CRM intéressés par un programme partenaire." },
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

    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
      <h3 className="text-sm font-semibold text-foreground mb-6">Ventes & conversions sur 6 mois</h3>
      <div className="flex items-end gap-3 h-40">
        {chartData.map((d) => (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
            <span className="text-[10px] font-medium text-foreground">{d.ventes}</span>
            <div className="w-full rounded-t-lg bg-success/80" style={{ height: `${(d.ventes / 40) * 120}px` }} />
            <span className="text-[10px] text-muted-foreground">{d.month}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="grid lg:grid-cols-2 gap-6">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-4 w-4 text-success" />
          <h3 className="text-sm font-semibold text-foreground">Plan d'action IA — 5 priorités</h3>
        </div>
        <div className="space-y-3">
          {mockActions.map((a) => (
            <div key={a.priorite} className="flex items-start gap-3 rounded-xl bg-secondary/50 p-3">
              <span className="w-5 h-5 rounded-full bg-success/15 text-success text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {a.priorite}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{a.action}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Délai : {a.delai} · Impact : {a.impact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-4 w-4 text-success" />
          <h3 className="text-sm font-semibold text-foreground">Opportunités de croissance</h3>
        </div>
        <div className="space-y-3">
          {mockOpportunities.map((o, i) => (
            <div key={i} className="rounded-xl bg-secondary/50 p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-foreground">{o.titre}</p>
                <span className={`text-[11px] font-medium ${potentielColors[o.potentiel]}`}>{o.potentiel}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">{o.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="h-4 w-4 text-success" />
        <h3 className="text-sm font-semibold text-foreground">Rapport hebdomadaire synthèse</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Cette semaine, votre taux de conversion a progressé de 0.4 points grâce à l'optimisation des landing pages. 
        Le pipeline commercial est en hausse avec 47 nouveaux clients. Focus recommandé sur le segment PME Tech 
        qui représente une opportunité de croissance significative avec un potentiel de +15% de chiffre d'affaires additionnel…
      </p>
    </div>
  </div>
);

const GrowthPilotTab = ({ onConnect }: { onConnect?: () => void }) => (
  <EmptyStateOverlay
    icon={Rocket}
    serviceName="GrowthPilot"
    description="Analysez vos ventes et votre profil entreprise pour recevoir un plan d'action IA personnalisé, identifier les opportunités de croissance et suivre vos performances."
    accentColor={ACCENT}
    onConnect={onConnect}
  >
    <PreviewContent />
  </EmptyStateOverlay>
);

export default GrowthPilotTab;
