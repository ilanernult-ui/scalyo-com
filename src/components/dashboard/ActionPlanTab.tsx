import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Loader2,
  Trash2,
  Euro,
  Clock,
  CheckCircle2,
  ListTodo,
  PlayCircle,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

type ActionStatus = "todo" | "in_progress" | "done";
type Category = "finance" | "marketing" | "operations" | "rh";
type Difficulty = "facile" | "moyen" | "difficile";
type Delay = "aujourd_hui" | "cette_semaine" | "ce_mois";

interface ActionRow {
  id: string;
  title: string;
  description: string | null;
  category: Category;
  difficulty: Difficulty;
  delay: Delay;
  status: ActionStatus;
  impact_eur: number;
  impact_hours_weekly: number;
  position: number;
  completed_at: string | null;
  created_at: string;
}

const COLUMNS: { id: ActionStatus; label: string; icon: React.ComponentType<{ className?: string }>; accent: string }[] = [
  { id: "todo", label: "À faire", icon: ListTodo, accent: "border-l-slate-400" },
  { id: "in_progress", label: "En cours", icon: PlayCircle, accent: "border-l-blue-500" },
  { id: "done", label: "Terminé", icon: CheckCircle2, accent: "border-l-emerald-500" },
];

const CATEGORY_META: Record<Category, { label: string; cls: string }> = {
  finance: { label: "Finance", cls: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" },
  marketing: { label: "Marketing", cls: "bg-violet-500/10 text-violet-700 border-violet-500/20" },
  operations: { label: "Opérations", cls: "bg-blue-500/10 text-blue-700 border-blue-500/20" },
  rh: { label: "RH", cls: "bg-amber-500/10 text-amber-700 border-amber-500/20" },
};

const DIFFICULTY_META: Record<Difficulty, { label: string; cls: string }> = {
  facile: { label: "Facile", cls: "bg-green-500/10 text-green-700" },
  moyen: { label: "Moyen", cls: "bg-amber-500/10 text-amber-700" },
  difficile: { label: "Difficile", cls: "bg-red-500/10 text-red-700" },
};

const DELAY_META: Record<Delay, string> = {
  aujourd_hui: "Aujourd'hui",
  cette_semaine: "Cette semaine",
  ce_mois: "Ce mois",
};

const ActionPlanTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [actions, setActions] = useState<ActionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("action_plan")
      .select("*")
      .eq("user_id", user.id)
      .order("position", { ascending: true });
    if (error) {
      console.error("[ActionPlanTab] load error", error);
      toast({ title: "Erreur de chargement", description: error.message, variant: "destructive" });
    } else {
      setActions((data ?? []) as ActionRow[]);
    }
    setLoading(false);
  }, [user?.id, toast]);

  useEffect(() => {
    reload();
  }, [reload]);

  // ── Stats du mois ──
  const stats = useMemo(() => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const doneThisMonth = actions.filter(
      (a) => a.status === "done" && a.completed_at && new Date(a.completed_at) >= startOfMonth,
    );
    const savings = doneThisMonth.reduce((s, a) => s + Number(a.impact_eur || 0), 0);
    const hours = doneThisMonth.reduce((s, a) => s + Number(a.impact_hours_weekly || 0), 0);
    return { count: doneThisMonth.length, savings, hours };
  }, [actions]);

  const grouped = useMemo(() => {
    return COLUMNS.reduce<Record<ActionStatus, ActionRow[]>>(
      (acc, c) => {
        acc[c.id] = actions.filter((a) => a.status === c.id);
        return acc;
      },
      { todo: [], in_progress: [], done: [] },
    );
  }, [actions]);

  // ── Generate via AI edge function ──
  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-action-plan", { body: {} });
      if (error) throw error;
      const generated = (data as { actions?: ActionRow[] })?.actions ?? [];
      toast({
        title: "Plan d'action mis à jour",
        description: `${generated.length} nouvelles actions générées par l'IA.`,
      });
      await reload();
    } catch (err) {
      console.error("[ActionPlanTab] generate error", err);
      toast({
        title: "Génération impossible",
        description: err instanceof Error ? err.message : "Réessayez plus tard.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  // ── Move card across columns (drag & drop) ──
  const moveAction = async (id: string, newStatus: ActionStatus) => {
    const current = actions.find((a) => a.id === id);
    if (!current || current.status === newStatus) return;

    const completed_at = newStatus === "done" ? new Date().toISOString() : null;

    // Optimistic
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus, completed_at } : a)),
    );

    const { error } = await supabase
      .from("action_plan")
      .update({ status: newStatus, completed_at })
      .eq("id", id);

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      reload();
    }
  };

  const deleteAction = async (id: string) => {
    setActions((prev) => prev.filter((a) => a.id !== id));
    const { error } = await supabase.from("action_plan").delete().eq("id", id);
    if (error) {
      toast({ title: "Suppression échouée", description: error.message, variant: "destructive" });
      reload();
    }
  };

  // ── Render ──
  return (
    <div className="space-y-5">
      {/* Header + stats */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Plan d'action IA
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Organisez vos actions priorisées par l'IA dans un Kanban. Glissez les cartes entre colonnes.
            </p>
          </div>
          <Button onClick={handleGenerate} disabled={generating} className="gap-2 shrink-0">
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Générer de nouvelles actions IA
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          <StatCard
            icon={CheckCircle2}
            label="Actions complétées ce mois"
            value={stats.count.toString()}
            tone="emerald"
          />
          <StatCard
            icon={Euro}
            label="Économies générées"
            value={`${stats.savings.toLocaleString("fr-FR")} €`}
            tone="primary"
          />
          <StatCard
            icon={Clock}
            label="Heures récupérées / sem."
            value={`${stats.hours.toLocaleString("fr-FR")} h`}
            tone="amber"
          />
        </div>
      </div>

      {/* Kanban */}
      {loading ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
          Chargement de votre plan d'action…
        </div>
      ) : actions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <Sparkles className="h-6 w-6 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            Aucune action générée pour le moment.<br />
            Cliquez sur « Générer de nouvelles actions IA » pour commencer.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {COLUMNS.map((col) => {
            const items = grouped[col.id];
            return (
              <div
                key={col.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData("text/plain");
                  if (id) moveAction(id, col.id);
                  setDraggingId(null);
                }}
                className={`rounded-2xl border border-border bg-secondary/30 p-3 min-h-[300px] flex flex-col ${draggingId ? "ring-1 ring-primary/30" : ""}`}
              >
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <col.icon className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-foreground">{col.label}</h3>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">
                    {items.length}
                  </Badge>
                </div>

                <div className="space-y-2 flex-1">
                  <AnimatePresence>
                    {items.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-8 px-2 leading-relaxed">
                        Aucune action générée pour le moment.<br />
                        Cliquez sur « Générer de nouvelles actions IA » pour commencer.
                      </p>
                    )}
                    {items.map((a) => (
                      <ActionCard
                        key={a.id}
                        action={a}
                        accent={col.accent}
                        onDragStart={() => setDraggingId(a.id)}
                        onDragEnd={() => setDraggingId(null)}
                        onDelete={() => deleteAction(a.id)}
                        onMove={(s) => moveAction(a.id, s)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && actions.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
          <Sparkles className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground mb-1">Aucune action pour le moment</p>
          <p className="text-xs text-muted-foreground mb-4">
            Cliquez sur « Générer de nouvelles actions IA » pour démarrer.
          </p>
        </div>
      )}
    </div>
  );
};

// ── Sous-composants ──
const StatCard = ({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: "emerald" | "primary" | "amber";
}) => {
  const toneCls = {
    emerald: "text-emerald-600 bg-emerald-500/10",
    primary: "text-primary bg-primary/10",
    amber: "text-amber-600 bg-amber-500/10",
  }[tone];
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-3 flex items-center gap-3">
      <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${toneCls}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-base font-bold text-foreground tabular-nums truncate">{value}</p>
      </div>
    </div>
  );
};

const ActionCard = ({
  action,
  accent,
  onDragStart,
  onDragEnd,
  onDelete,
  onMove,
}: {
  action: ActionRow;
  accent: string;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDelete: () => void;
  onMove: (s: ActionStatus) => void;
}) => {
  const cat = CATEGORY_META[action.category];
  const diff = DIFFICULTY_META[action.difficulty];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      draggable
      onDragStart={(e) => {
        (e as unknown as DragEvent).dataTransfer?.setData("text/plain", action.id);
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      className={`group rounded-xl border border-border bg-card border-l-4 ${accent} p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h4 className="text-sm font-semibold text-foreground leading-snug flex-1">
          {action.title}
        </h4>
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity shrink-0"
          aria-label="Supprimer"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {action.description && (
        <p className="text-xs text-muted-foreground leading-relaxed mb-2 line-clamp-3">
          {action.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cat.cls}`}>
          {cat.label}
        </span>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${diff.cls}`}>
          {diff.label}
        </span>
        <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
          {DELAY_META[action.delay]}
        </span>
      </div>

      <div className="flex items-center gap-3 text-xs border-t border-border/50 pt-2">
        {Number(action.impact_eur) > 0 && (
          <span className="flex items-center gap-1 text-emerald-600 font-semibold tabular-nums">
            <Euro className="h-3 w-3" />
            {Number(action.impact_eur).toLocaleString("fr-FR")} €
          </span>
        )}
        {Number(action.impact_hours_weekly) > 0 && (
          <span className="flex items-center gap-1 text-amber-600 font-semibold tabular-nums">
            <Clock className="h-3 w-3" />
            {Number(action.impact_hours_weekly).toLocaleString("fr-FR")} h/sem
          </span>
        )}
        {Number(action.impact_eur) === 0 && Number(action.impact_hours_weekly) === 0 && (
          <span className="flex items-center gap-1 text-muted-foreground">
            <TrendingUp className="h-3 w-3" /> Impact à mesurer
          </span>
        )}
      </div>

      {/* Quick move buttons (mobile-friendly fallback) */}
      <div className="flex gap-1 mt-2 lg:hidden">
        {action.status !== "todo" && (
          <Button size="sm" variant="ghost" className="h-6 text-[10px] px-2" onClick={() => onMove("todo")}>
            ← À faire
          </Button>
        )}
        {action.status !== "in_progress" && (
          <Button size="sm" variant="ghost" className="h-6 text-[10px] px-2" onClick={() => onMove("in_progress")}>
            En cours
          </Button>
        )}
        {action.status !== "done" && (
          <Button size="sm" variant="ghost" className="h-6 text-[10px] px-2" onClick={() => onMove("done")}>
            Terminé →
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default ActionPlanTab;
