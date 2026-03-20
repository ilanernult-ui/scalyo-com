import { Heart, ShieldCheck, TrendingDown, Users, Activity, AlertCircle, UserCheck, FileText } from "lucide-react";
import EmptyStateOverlay from "./EmptyStateOverlay";

const ACCENT = "hsl(262, 60%, 55%)";

const mockKpis = [
  { label: "Score de rétention", value: "78/100", change: "+4 pts", icon: ShieldCheck },
  { label: "Taux de churn", value: "4.2%", change: "-0.8 pts", icon: TrendingDown },
  { label: "Clients à risque", value: "23", change: "-5", icon: AlertCircle },
  { label: "LTV moyenne", value: "18 400 €", change: "+2 200 €", icon: Activity },
];

const churnSegments = [
  { segment: "Grands comptes", score: 18, clients: 45, urgence: "Faible" },
  { segment: "PME Tech", score: 42, clients: 120, urgence: "Moyenne" },
  { segment: "TPE / Indépendants", score: 67, clients: 89, urgence: "Haute" },
  { segment: "Nouveaux clients (<3 mois)", score: 54, clients: 86, urgence: "Moyenne" },
];

const mockStrategies = [
  { profil: "Client dormant (>60 jours sans activité)", strategie: "Campagne de réactivation personnalisée", actions: "Email séquence + offre exclusive + appel CSM" },
  { profil: "Client à risque (score churn >60)", strategie: "Intervention proactive du CSM", actions: "Audit satisfaction + plan de rétention sur mesure" },
  { profil: "Client fidèle (>12 mois, usage élevé)", strategie: "Programme ambassadeur", actions: "Récompenses, accès bêta, co-marketing" },
];

const mockCrmActions = [
  { action: "Relancer 23 clients à risque immédiat", priorite: "Haute", impact: "Prévenir 38k€ de churn potentiel" },
  { action: "Déployer enquête NPS sur segment PME Tech", priorite: "Moyenne", impact: "Identifier les irritants clés" },
  { action: "Automatiser l'onboarding des nouveaux clients", priorite: "Haute", impact: "Réduire le churn des 90 premiers jours de 20%" },
];

const chartData = [
  { month: "Oct", churn: 5.8 }, { month: "Nov", churn: 5.4 },
  { month: "Déc", churn: 5.0 }, { month: "Jan", churn: 4.7 },
  { month: "Fév", churn: 4.5 }, { month: "Mar", churn: 4.2 },
];

const urgenceColors: Record<string, string> = {
  "Haute": "text-destructive",
  "Moyenne": "text-warning",
  "Faible": "text-success",
};

const getGaugeColor = (score: number) => {
  if (score >= 60) return "bg-destructive";
  if (score >= 40) return "bg-warning";
  return "bg-success";
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
      <h3 className="text-sm font-semibold text-foreground mb-6">Évolution du churn sur 6 mois (%)</h3>
      <div className="flex items-end gap-3 h-40">
        {chartData.map((d) => (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
            <span className="text-[10px] font-medium text-foreground">{d.churn}%</span>
            <div className="w-full rounded-t-lg" style={{ height: `${(d.churn / 8) * 120}px`, backgroundColor: "hsl(262, 60%, 55%)" }} />
            <span className="text-[10px] text-muted-foreground">{d.month}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="grid lg:grid-cols-2 gap-6">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-4 w-4" style={{ color: "hsl(262, 60%, 55%)" }} />
          <h3 className="text-sm font-semibold text-foreground">Prédiction Churn par segment</h3>
        </div>
        <div className="space-y-4">
          {churnSegments.map((s) => (
            <div key={s.segment}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-foreground">{s.segment}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-medium ${urgenceColors[s.urgence]}`}>{s.urgence}</span>
                  <span className="text-sm font-bold text-foreground">{s.score}</span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div className={`h-full rounded-full ${getGaugeColor(s.score)} transition-all`} style={{ width: `${s.score}%` }} />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">{s.clients} clients</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
        <div className="flex items-center gap-2 mb-4">
          <UserCheck className="h-4 w-4" style={{ color: "hsl(262, 60%, 55%)" }} />
          <h3 className="text-sm font-semibold text-foreground">Stratégies de rétention IA</h3>
        </div>
        <div className="space-y-3">
          {mockStrategies.map((s, i) => (
            <div key={i} className="rounded-xl bg-secondary/50 p-3">
              <p className="text-[11px] font-medium text-muted-foreground mb-1">{s.profil}</p>
              <p className="text-sm font-medium text-foreground">{s.strategie}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{s.actions}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-4 w-4" style={{ color: "hsl(262, 60%, 55%)" }} />
        <h3 className="text-sm font-semibold text-foreground">Recommandations CRM</h3>
      </div>
      <div className="space-y-3">
        {mockCrmActions.map((a, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl bg-secondary/50 p-3">
            <span className="w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: "hsl(262, 60%, 55%, 0.12)", color: "hsl(262, 60%, 55%)" }}>
              {i + 1}
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{a.action}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Priorité : {a.priorite} · {a.impact}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
      <h3 className="text-sm font-semibold text-foreground mb-3">Suivi 360° — Santé du portefeuille client</h3>
      <div className="grid sm:grid-cols-4 gap-4">
        <div className="text-center p-3 rounded-xl bg-secondary/50">
          <p className="text-2xl font-bold text-foreground">78</p>
          <p className="text-[11px] text-muted-foreground">Score global</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-secondary/50">
          <p className="text-sm font-medium text-success">↑ En hausse</p>
          <p className="text-[11px] text-muted-foreground">Tendance</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-secondary/50">
          <p className="text-sm font-medium text-foreground">Satisfaction, Engagement</p>
          <p className="text-[11px] text-muted-foreground">Points forts</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-secondary/50">
          <p className="text-sm font-medium text-foreground">Onboarding, Support</p>
          <p className="text-[11px] text-muted-foreground">Points faibles</p>
        </div>
      </div>
    </div>
  </div>
);

const LoyaltyLoopTab = ({ onConnect, dataConnected }: { onConnect?: () => void; dataConnected?: boolean }) => {
  if (dataConnected) return <PreviewContent />;
  return (
    <EmptyStateOverlay
      icon={Heart}
      serviceName="LoyaltyLoop"
      description="Prédisez le churn, identifiez vos clients à risque et déployez des stratégies de rétention personnalisées grâce à l'IA pour maximiser la valeur vie client."
      accentColor={ACCENT}
      onConnect={onConnect}
    >
      <PreviewContent />
    </EmptyStateOverlay>
  );
};

export default LoyaltyLoopTab;
