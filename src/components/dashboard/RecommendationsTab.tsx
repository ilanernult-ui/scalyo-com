import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, CheckCircle2, Clock, PlayCircle, RefreshCw,
  TrendingUp, DollarSign, Timer, Sparkles, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useRecommendations,
  type Recommendation,
  type RecommendationPriority,
  type RecommendationStatus,
} from "@/hooks/useRecommendations";
import { useAuth } from "@/contexts/AuthContext";
import { analytics } from "@/lib/analytics";

// ─── Priority config ──────────────────────────────────────────────
const PRIORITY_CONFIG: Record<RecommendationPriority, { label: string; cls: string; dotCls: string }> = {
  P0: { label: "Critique", cls: "bg-red-100 text-red-700 border-red-200", dotCls: "bg-red-500" },
  P1: { label: "Important", cls: "bg-orange-100 text-orange-700 border-orange-200", dotCls: "bg-orange-500" },
  P2: { label: "Modéré", cls: "bg-yellow-100 text-yellow-700 border-yellow-200", dotCls: "bg-yellow-500" },
  P3: { label: "Faible", cls: "bg-slate-100 text-slate-600 border-slate-200", dotCls: "bg-slate-400" },
};

const STATUS_CONFIG: Record<RecommendationStatus, { label: string; icon: typeof CheckCircle2; cls: string }> = {
  pending: { label: "À faire", icon: Clock, cls: "text-muted-foreground" },
  in_progress: { label: "En cours", icon: PlayCircle, cls: "text-blue-600" },
  done: { label: "Terminée", icon: CheckCircle2, cls: "text-emerald-600" },
};

const IMPACT_ICONS: Record<string, typeof DollarSign> = {
  revenue: DollarSign,
  savings: DollarSign,
  time: Timer,
  other: TrendingUp,
};

// ─── Reco Card ────────────────────────────────────────────────────
const RecoCard = ({ reco, onStatusChange }: {
  reco: Recommendation;
  onStatusChange: (id: string, status: RecommendationStatus) => void;
}) => {
  const { label: prioLabel, cls: prioCls } = PRIORITY_CONFIG[reco.priority];
  const { label: statusLabel, icon: StatusIcon, cls: statusCls } = STATUS_CONFIG[reco.status];
  const ImpactIcon = reco.impact_type ? (IMPACT_ICONS[reco.impact_type] ?? TrendingUp) : TrendingUp;
  const isDone = reco.status === "done";

  const cycleStatus = () => {
    const next: Record<RecommendationStatus, RecommendationStatus> = {
      pending: "in_progress",
      in_progress: "done",
      done: "pending",
    };
    onStatusChange(reco.id, next[reco.status]);
    analytics.track("recommendation_completed", { priority: reco.priority, impact_type: reco.impact_type ?? "other" });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: isDone ? 0.6 : 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className={`rounded-2xl border bg-card p-4 transition-opacity ${isDone ? "border-emerald-200" : "border-border"}`}
    >
      <div className="flex items-start gap-3">
        {/* Priority dot */}
        <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${PRIORITY_CONFIG[reco.priority].dotCls}`} />

        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className={`text-sm font-medium ${isDone ? "line-through text-muted-foreground" : "text-foreground"}`}>
              {reco.title}
            </p>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${prioCls}`}>{prioLabel}</span>
            </div>
          </div>

          {/* Description */}
          {reco.description && (
            <p className="text-xs text-muted-foreground leading-relaxed mb-2">{reco.description}</p>
          )}

          {/* Footer row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              {reco.impact_label && (
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <ImpactIcon className="h-3 w-3" /> {reco.impact_label}
                </span>
              )}
              <button
                onClick={cycleStatus}
                className={`flex items-center gap-1 text-xs font-medium transition-colors hover:opacity-70 ${statusCls}`}
              >
                <StatusIcon className="h-3 w-3" /> {statusLabel}
              </button>
            </div>
            {reco.completed_at && (
              <span className="text-[10px] text-muted-foreground">
                {new Date(reco.completed_at).toLocaleDateString("fr-FR")}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Empty state ──────────────────────────────────────────────────
const EmptyState = ({ onGenerate, generating }: { onGenerate: () => void; generating: boolean }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
      <Sparkles className="h-6 w-6 text-primary" />
    </div>
    <p className="text-sm font-semibold text-foreground mb-1">Aucune recommandation pour l'instant</p>
    <p className="text-xs text-muted-foreground mb-4 max-w-xs">
      Générez vos premières recommandations IA basées sur vos données business.
    </p>
    <Button onClick={onGenerate} disabled={generating} className="gap-2">
      {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
      Générer mes recommandations
    </Button>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────
const PRIORITY_FILTERS: { id: RecommendationPriority | "all"; label: string }[] = [
  { id: "all", label: "Toutes" },
  { id: "P0", label: "P0 Critique" },
  { id: "P1", label: "P1 Important" },
  { id: "P2", label: "P2 Modéré" },
  { id: "P3", label: "P3 Faible" },
];

const STATUS_FILTERS: { id: RecommendationStatus | "all"; label: string }[] = [
  { id: "all", label: "Tous statuts" },
  { id: "pending", label: "À faire" },
  { id: "in_progress", label: "En cours" },
  { id: "done", label: "Terminées" },
];

const RecommendationsTab = () => {
  const { user } = useAuth();
  const { recommendations, loading, updateStatus, generateWeekly, generating } = useRecommendations(user?.id);

  const [priorityFilter, setPriorityFilter] = useState<RecommendationPriority | "all">("all");
  const [statusFilter, setStatusFilter] = useState<RecommendationStatus | "all">("all");

  const filtered = recommendations.filter((r) => {
    if (priorityFilter !== "all" && r.priority !== priorityFilter) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    return true;
  });

  // Stats
  const totalPotential = recommendations
    .filter((r) => r.status !== "done" && r.impact_type === "revenue")
    .length;
  const doneCount = recommendations.filter((r) => r.status === "done").length;
  const inProgressCount = recommendations.filter((r) => r.status === "in_progress").length;
  const p0Count = recommendations.filter((r) => r.priority === "P0" && r.status !== "done").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground tracking-tight">Recommandations IA</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Actions prioritaires pour améliorer votre performance business
          </p>
        </div>
        <Button onClick={generateWeekly} disabled={generating} className="gap-2 shrink-0">
          {generating
            ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Génération…</>
            : <><RefreshCw className="h-3.5 w-3.5" /> Générer cette semaine</>
          }
        </Button>
      </div>

      {/* Stats strip */}
      {recommendations.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Actions critiques (P0)", value: p0Count, icon: Zap, cls: p0Count > 0 ? "text-red-600" : "text-emerald-600" },
            { label: "En cours", value: inProgressCount, icon: PlayCircle, cls: "text-blue-600" },
            { label: "Terminées", value: doneCount, icon: CheckCircle2, cls: "text-emerald-600" },
            { label: "Revenus potentiels", value: `${totalPotential} actions`, icon: DollarSign, cls: "text-primary" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
                <s.icon className={`h-3.5 w-3.5 ${s.cls}`} />
              </div>
              <p className={`text-lg font-bold ${s.cls}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      {recommendations.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex gap-1.5 flex-wrap">
            {PRIORITY_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setPriorityFilter(f.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  priorityFilter === f.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === f.id
                    ? "bg-foreground text-background"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* List */}
      {recommendations.length === 0 ? (
        <EmptyState onGenerate={generateWeekly} generating={generating} />
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          Aucune recommandation ne correspond aux filtres sélectionnés.
        </p>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((reco) => (
              <RecoCard key={reco.id} reco={reco} onStatusChange={updateStatus} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Weekly info */}
      {recommendations.length > 0 && (
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          Nouvelles recommandations générées automatiquement chaque lundi matin
        </div>
      )}
    </div>
  );
};

export default RecommendationsTab;
