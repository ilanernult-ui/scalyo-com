import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Clipboard,
  Clock,
  Loader2,
  Sparkles,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  type RecommendationImpactType,
  type RecommendationPriority,
  type RecommendationStatus,
} from "@/hooks/useRecommendations";

const STORAGE_KEY = "scalyo-action-plan";

type ActionPlanCategory = "DataDiag" | "GrowthPilot" | "LoyaltyLoop";

interface ActionPlanItem {
  id: string;
  title: string;
  description: string;
  priority: RecommendationPriority;
  plan: ActionPlanCategory;
  status: RecommendationStatus;
  impact_label: string;
  impact_type: RecommendationImpactType | null;
  due: string;
  created_at: string;
  completed_at: string | null;
  financial_value: number;
  hours_value: number;
  growth_value: number;
}

const PRIORITY_CONFIG: Record<RecommendationPriority, { label: string; cls: string; dotCls: string }> = {
  P0: { label: "Critique", cls: "bg-red-100 text-red-700 border-red-200", dotCls: "bg-red-500" },
  P1: { label: "Important", cls: "bg-orange-100 text-orange-700 border-orange-200", dotCls: "bg-orange-500" },
  P2: { label: "Modéré", cls: "bg-amber-100 text-amber-800 border-amber-200", dotCls: "bg-amber-500" },
  P3: { label: "Faible", cls: "bg-slate-100 text-slate-600 border-slate-200", dotCls: "bg-slate-400" },
};

const PLAN_CONFIG: Record<ActionPlanCategory, { label: string; cls: string }> = {
  DataDiag: { label: "DataDiag", cls: "bg-sky-100 text-sky-700" },
  GrowthPilot: { label: "GrowthPilot", cls: "bg-emerald-100 text-emerald-700" },
  LoyaltyLoop: { label: "LoyaltyLoop", cls: "bg-amber-100 text-amber-700" },
};

const INITIAL_ACTION_PLAN: ActionPlanItem[] = [
  {
    id: "datadiag-1",
    title: "Relancer 3 factures impayées > 60 jours",
    description: "Vos impayés représentent 15 200€. Commencez par les 3 plus anciennes.",
    priority: "P0",
    plan: "DataDiag",
    status: "pending",
    impact_label: "~4 200€ récupérés",
    impact_type: "revenue",
    due: "Cette semaine",
    created_at: new Date().toISOString(),
    completed_at: null,
    financial_value: 4200,
    hours_value: 0,
    growth_value: 0,
  },
  {
    id: "datadiag-2",
    title: "Supprimer abonnements SaaS inutilisés",
    description: "Audit rapide de vos 12 abonnements actifs. 3 non utilisés détectés.",
    priority: "P0",
    plan: "DataDiag",
    status: "pending",
    impact_label: "89€/mois économisés",
    impact_type: "savings",
    due: "Aujourd'hui",
    created_at: new Date().toISOString(),
    completed_at: null,
    financial_value: 89,
    hours_value: 0,
    growth_value: 0,
  },
  {
    id: "datadiag-3",
    title: "Automatiser les relances clients",
    description: "Mise en place d'une séquence email automatique pour les retards de paiement.",
    priority: "P1",
    plan: "DataDiag",
    status: "pending",
    impact_label: "6h/semaine gagnées",
    impact_type: "time",
    due: "2 semaines",
    created_at: new Date().toISOString(),
    completed_at: null,
    financial_value: 0,
    hours_value: 6,
    growth_value: 0,
  },
  {
    id: "growth-1",
    title: "Réduire budget LinkedIn Ads de 40%",
    description: "CPA LinkedIn (142€) est 3x plus élevé que SEO (12€). Réallouez le budget.",
    priority: "P0",
    plan: "GrowthPilot",
    status: "pending",
    impact_label: "284€/mois économisés",
    impact_type: "savings",
    due: "Cette semaine",
    created_at: new Date().toISOString(),
    completed_at: null,
    financial_value: 284,
    hours_value: 0,
    growth_value: 0,
  },
  {
    id: "growth-2",
    title: "Doubler investissement SEO",
    description: "3 articles/semaine sur vos mots-clés cibles. ROI > 10x vs paid.",
    priority: "P1",
    plan: "GrowthPilot",
    status: "pending",
    impact_label: "+18% trafic organique",
    impact_type: "other",
    due: "Ce mois",
    created_at: new Date().toISOString(),
    completed_at: null,
    financial_value: 0,
    hours_value: 0,
    growth_value: 18,
  },
  {
    id: "growth-3",
    title: "Déployer programme de parrainage",
    description: "Conversion parrainage (x2.2) bien supérieure au payant. Lancez rapidement.",
    priority: "P1",
    plan: "GrowthPilot",
    status: "pending",
    impact_label: "+8 leads qualifiés/mois",
    impact_type: "other",
    due: "2 semaines",
    created_at: new Date().toISOString(),
    completed_at: null,
    financial_value: 0,
    hours_value: 0,
    growth_value: 8,
  },
  {
    id: "loyalty-1",
    title: "Appel CSM urgent — Dupont & Associés",
    description: "Client inactif depuis 68 jours. Score churn : 74/100. Action immédiate requise.",
    priority: "P0",
    plan: "LoyaltyLoop",
    status: "pending",
    impact_label: "4 200€ revenu protégé",
    impact_type: "revenue",
    due: "Aujourd'hui",
    created_at: new Date().toISOString(),
    completed_at: null,
    financial_value: 4200,
    hours_value: 0,
    growth_value: 0,
  },
  {
    id: "loyalty-2",
    title: "Email réactivation — TechStart SAS",
    description: "Inactif 45 jours. Offrez un audit gratuit de 30 min pour le réengager.",
    priority: "P0",
    plan: "LoyaltyLoop",
    status: "pending",
    impact_label: "2 900€ revenu protégé",
    impact_type: "revenue",
    due: "Cette semaine",
    created_at: new Date().toISOString(),
    completed_at: null,
    financial_value: 2900,
    hours_value: 0,
    growth_value: 0,
  },
  {
    id: "loyalty-3",
    title: "Lancer programme fidélité VIP",
    description: "Vos 45 clients VIP génèrent 62% du CA. Un programme dédié maximise leur valeur.",
    priority: "P1",
    plan: "LoyaltyLoop",
    status: "pending",
    impact_label: "+15% panier moyen",
    impact_type: "other",
    due: "Ce mois",
    created_at: new Date().toISOString(),
    completed_at: null,
    financial_value: 0,
    hours_value: 0,
    growth_value: 15,
  },
];

type QuickFilter = RecommendationPriority | "all" | "done";

const QUICK_FILTERS: { id: QuickFilter; label: string }[] = [
  { id: "all", label: "Toutes" },
  { id: "P0", label: "🔴 Critiques" },
  { id: "P1", label: "🟠 Importantes" },
  { id: "P2", label: "🟡 Modérées" },
  { id: "done", label: "✅ Complétées" },
];

const PLAN_FILTERS: { id: ActionPlanCategory | "all"; label: string }[] = [
  { id: "all", label: "Toutes les actions" },
  { id: "DataDiag", label: "DataDiag" },
  { id: "GrowthPilot", label: "GrowthPilot" },
  { id: "LoyaltyLoop", label: "LoyaltyLoop" },
];

const getSavedPlan = (): ActionPlanItem[] | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
};

const savePlan = (items: ActionPlanItem[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const getProgressColor = (progress: number) => {
  if (progress >= 70) return "bg-emerald-500";
  if (progress >= 30) return "bg-orange-500";
  return "bg-red-500";
};

const ActionCard = ({
  action,
  onToggleDone,
}: {
  action: ActionPlanItem;
  onToggleDone: (id: string) => void;
}) => {
  const isDone = action.status === "done";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className={`rounded-3xl border p-5 transition ${
        isDone ? "border-emerald-200 bg-emerald-50" : "border-border bg-card"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[11px] font-semibold px-2 py-1 rounded-full border ${PRIORITY_CONFIG[action.priority].cls}`}>
              {PRIORITY_CONFIG[action.priority].label}
            </span>
            <span className={`text-[11px] font-semibold px-2 py-1 rounded-full border ${PLAN_CONFIG[action.plan].cls}`}>
              {PLAN_CONFIG[action.plan].label}
            </span>
            <span className="text-[11px] text-muted-foreground">{action.due}</span>
          </div>
          <p className={`text-sm font-semibold ${isDone ? "text-emerald-900 line-through" : "text-foreground"}`}>
            {action.title}
          </p>
          <p className="text-sm leading-6 text-slate-600">{action.description}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {action.impact_label && (
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700">
                {action.impact_label}
              </span>
            )}
            {isDone && action.completed_at && (
              <span className="rounded-full bg-emerald-200 px-2 py-1 text-emerald-900">
                ✅ Complété le {new Date(action.completed_at).toLocaleDateString("fr-FR")}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 shrink-0 sm:items-end">
          {!isDone ? (
            <Button size="sm" variant="secondary" onClick={() => onToggleDone(action.id)}>
              ✓ Marquer comme fait
            </Button>
          ) : null}
          <Button
            size="sm"
            variant="outline"
            onClick={() => void navigator.clipboard.writeText(`${action.title} — ${action.description}`)}
          >
            📋 Copier
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const RecommendationsTab = () => {
  const { toast } = useToast();
  const [actions, setActions] = useState<ActionPlanItem[]>([]);
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");
  const [planFilter, setPlanFilter] = useState<ActionPlanCategory | "all">("all");

  useEffect(() => {
    const saved = getSavedPlan();
    if (saved) {
      setActions(saved);
    } else {
      setActions(INITIAL_ACTION_PLAN);
      savePlan(INITIAL_ACTION_PLAN);
    }

    const handlePlanUpdate = () => {
      const latest = getSavedPlan();
      if (latest) setActions(latest);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scalyo-action-plan-updated", handlePlanUpdate);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scalyo-action-plan-updated", handlePlanUpdate);
      }
    };
  }, []);

  const handleToggleDone = (id: string) => {
    const next = actions.map((action) => {
      if (action.id !== id) return action;
      const done = action.status !== "done";
      return {
        ...action,
        status: done ? "done" : "pending",
        completed_at: done ? new Date().toISOString() : null,
      };
    });
    setActions(next);
    savePlan(next);
    if (quickFilter === "done" && next.filter((item) => item.status === "done").length === 0) {
      setQuickFilter("all");
    }
  };

  const selectedActions = useMemo(() => {
    const priorityFilter = quickFilter === "all" || quickFilter === "done" ? "all" : quickFilter;
    const statusFilter = quickFilter === "done" ? "done" : "all";

    return actions.filter((action) => {
      if (planFilter !== "all" && action.plan !== planFilter) return false;
      if (statusFilter === "done" && action.status !== "done") return false;
      if (priorityFilter !== "all" && action.priority !== priorityFilter) return false;
      return true;
    });
  }, [actions, planFilter, quickFilter]);

  const pendingActions = selectedActions
    .filter((action) => action.status !== "done")
    .sort((a, b) => a.priority.localeCompare(b.priority) || a.created_at.localeCompare(b.created_at));

  const completedActions = selectedActions
    .filter((action) => action.status === "done")
    .sort((a, b) => Number(new Date(b.completed_at || "")) - Number(new Date(a.completed_at || "")));

  const totalActions = actions.length;
  const completedCount = actions.filter((action) => action.status === "done").length;
  const progress = totalActions > 0 ? Math.round((completedCount / totalActions) * 100) : 0;
  const progressColor = getProgressColor(progress);

  const totalRevenue = actions.reduce((sum, action) => sum + action.financial_value, 0);
  const totalHours = actions.reduce((sum, action) => sum + action.hours_value, 0);
  const totalGrowth = actions.reduce((sum, action) => sum + action.growth_value, 0);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">Mon Plan d'Action</h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Vos recommandations IA sauvegardées automatiquement — suivez votre progression.
            </p>
          </div>
          <Badge className="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-800">
            Score d'exécution : {progress}%
          </Badge>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Progression globale</p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {completedCount} actions complétées sur {totalActions} recommandations IA
              </p>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 sm:w-72">
              <div className={`${progressColor} h-full rounded-full`} style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {QUICK_FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setQuickFilter(filter.id)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                quickFilter === filter.id ?
                  "border-slate-900 bg-slate-900 text-white" :
                  "border-border bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {PLAN_FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setPlanFilter(filter.id)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                planFilter === filter.id ?
                  "border-slate-900 bg-slate-900 text-white" :
                  "border-border bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4">
          {pendingActions.length > 0 ? (
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Actions à réaliser</h2>
                  <p className="text-sm text-muted-foreground">
                    {pendingActions.length} recommandation{pendingActions.length > 1 ? "s" : ""} en attente.
                  </p>
                </div>
              </div>
              <div className="grid gap-4">
                <AnimatePresence mode="popLayout">
                  {pendingActions.map((action) => (
                    <ActionCard key={action.id} action={action} onToggleDone={handleToggleDone} />
                  ))}
                </AnimatePresence>
              </div>
            </section>
          ) : (
            <div className="rounded-3xl border border-border bg-card p-5 text-sm text-muted-foreground">
              Aucune action en attente pour ces filtres.
            </div>
          )}

          {completedActions.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">Complétées</h2>
              <div className="grid gap-4">
                <AnimatePresence mode="popLayout">
                  {completedActions.map((action) => (
                    <ActionCard key={action.id} action={action} onToggleDone={handleToggleDone} />
                  ))}
                </AnimatePresence>
              </div>
            </section>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-border bg-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <Target className="h-4 w-4 text-emerald-600" />
            <p className="text-sm font-semibold text-foreground">Revenus récupérables</p>
          </div>
          <p className="text-2xl font-semibold text-foreground">{totalRevenue.toLocaleString("fr-FR")}€</p>
        </div>
        <div className="rounded-3xl border border-border bg-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-4 w-4 text-sky-600" />
            <p className="text-sm font-semibold text-foreground">Heures économisables</p>
          </div>
          <p className="text-2xl font-semibold text-foreground">{totalHours}h / semaine</p>
        </div>
        <div className="rounded-3xl border border-border bg-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-4 w-4 text-orange-600" />
            <p className="text-sm font-semibold text-foreground">Potentiel de croissance</p>
          </div>
          <p className="text-2xl font-semibold text-foreground">+{totalGrowth}%</p>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsTab;
