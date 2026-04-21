import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, AlertTriangle, AlertCircle, CheckCircle2, Sparkles, Mail,
  Clock, X, Loader2, History, Filter,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type Severity = "red" | "orange" | "green";

interface Alert {
  id: string;
  severity: Severity;
  category: string;
  title: string;
  description: string;
  impact_estimate: string | null;
  recommended_action: string | null;
  status: string;
  triggered_at: string;
  resolved_at: string | null;
}

const severityConfig: Record<Severity, {
  label: string; bg: string; border: string; text: string; icon: any; dot: string;
}> = {
  red: {
    label: "Urgent", bg: "bg-red-50", border: "border-red-200",
    text: "text-red-700", icon: AlertTriangle, dot: "bg-red-500",
  },
  orange: {
    label: "Attention", bg: "bg-orange-50", border: "border-orange-200",
    text: "text-orange-700", icon: AlertCircle, dot: "bg-orange-500",
  },
  green: {
    label: "Opportunité", bg: "bg-green-50", border: "border-green-200",
    text: "text-green-700", icon: CheckCircle2, dot: "bg-green-500",
  },
};

const categoryLabel: Record<string, string> = {
  finance: "Finance", marketing: "Marketing", operations: "Opérations",
  clients: "Clients", general: "Général",
};

const SmartAlertsTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [emailMin, setEmailMin] = useState<Severity>("orange");
  const [filter, setFilter] = useState<"all" | Severity>("all");
  const [showHistory, setShowHistory] = useState(false);

  /* ── Load alerts + preferences ── */
  const load = async () => {
    if (!user?.id) return;
    setLoading(true);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [{ data: alertRows }, { data: prefs }] = await Promise.all([
      supabase
        .from("smart_alerts")
        .select("*")
        .eq("user_id", user.id)
        .gte("triggered_at", thirtyDaysAgo.toISOString())
        .order("triggered_at", { ascending: false }),
      supabase
        .from("alert_preferences")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);

    setAlerts((alertRows ?? []) as Alert[]);
    if (prefs) {
      setEmailEnabled(prefs.email_alerts_enabled);
      setEmailMin((prefs.email_severity_min ?? "orange") as Severity);
    } else {
      // Seed default prefs
      await supabase.from("alert_preferences").insert({
        user_id: user.id, email_alerts_enabled: true, email_severity_min: "orange",
      });
    }
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user?.id]);

  /* ── Update prefs ── */
  const updatePrefs = async (patch: Partial<{ email_alerts_enabled: boolean; email_severity_min: Severity }>) => {
    if (!user?.id) return;
    await supabase.from("alert_preferences").upsert({
      user_id: user.id,
      email_alerts_enabled: patch.email_alerts_enabled ?? emailEnabled,
      email_severity_min: patch.email_severity_min ?? emailMin,
      updated_at: new Date().toISOString(),
    });
  };

  const handleToggleEmail = async (val: boolean) => {
    setEmailEnabled(val);
    await updatePrefs({ email_alerts_enabled: val });
    toast({
      title: val ? "Alertes email activées" : "Alertes email désactivées",
      description: val ? "Vous recevrez les nouvelles alertes par email." : "Vous ne recevrez plus d'emails d'alertes.",
    });
  };

  const handleChangeMin = async (val: Severity) => {
    setEmailMin(val);
    await updatePrefs({ email_severity_min: val });
  };

  /* ── Generate new alerts via AI ── */
  const handleGenerate = async () => {
    if (!user?.id) return;
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-smart-alerts");
      if (error) throw error;
      toast({
        title: "Analyse IA terminée 🔔",
        description: `${data?.count ?? 0} nouvelle(s) alerte(s) détectée(s).`,
      });
      await load();
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message ?? "Échec de l'analyse IA", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  /* ── Dismiss / resolve ── */
  const updateStatus = async (id: string, status: "dismissed" | "resolved") => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status, resolved_at: new Date().toISOString() } : a));
    await supabase.from("smart_alerts")
      .update({ status, resolved_at: new Date().toISOString() })
      .eq("id", id);
  };

  /* ── Derived ── */
  const activeAlerts = useMemo(
    () => alerts.filter((a) => a.status === "active" && (filter === "all" || a.severity === filter)),
    [alerts, filter],
  );

  const counts = useMemo(() => {
    const active = alerts.filter((a) => a.status === "active");
    return {
      red: active.filter((a) => a.severity === "red").length,
      orange: active.filter((a) => a.severity === "orange").length,
      green: active.filter((a) => a.severity === "green").length,
      total: active.length,
    };
  }, [alerts]);

  const history = useMemo(() => alerts.slice().sort(
    (a, b) => +new Date(b.triggered_at) - +new Date(a.triggered_at),
  ), [alerts]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Alertes Intelligentes</h2>
              <p className="text-sm text-muted-foreground">
                Détection IA des risques et opportunités sur votre business
              </p>
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={generating} className="gap-2">
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {generating ? "Analyse en cours..." : "Analyser maintenant"}
          </Button>
        </div>
      </motion.div>

      {/* Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(["red", "orange", "green"] as Severity[]).map((sev) => {
          const cfg = severityConfig[sev];
          const Icon = cfg.icon;
          return (
            <motion.button
              key={sev}
              onClick={() => setFilter(filter === sev ? "all" : sev)}
              whileHover={{ y: -2 }}
              className={`text-left rounded-2xl border p-4 transition-all ${
                filter === sev ? `${cfg.border} ${cfg.bg}` : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`h-4 w-4 ${cfg.text}`} />
                <Badge variant="outline" className={`text-[10px] ${cfg.text} ${cfg.border}`}>
                  {cfg.label}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-foreground tabular-nums">{counts[sev]}</p>
              <p className="text-[11px] text-muted-foreground">alerte{counts[sev] > 1 ? "s" : ""}</p>
            </motion.button>
          );
        })}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Badge variant="outline" className="text-[10px]">Total actif</Badge>
          </div>
          <p className="text-2xl font-bold text-foreground tabular-nums">{counts.total}</p>
          <p className="text-[11px] text-muted-foreground">à traiter</p>
        </div>
      </div>

      {/* Email preferences */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
              <Mail className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Notifications par email</p>
              <p className="text-xs text-muted-foreground">
                Recevez un email lorsqu'une nouvelle alerte est détectée
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {emailEnabled && (
              <Select value={emailMin} onValueChange={(v) => handleChangeMin(v as Severity)}>
                <SelectTrigger className="w-[170px] h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="red">Urgentes uniquement</SelectItem>
                  <SelectItem value="orange">Attention et plus</SelectItem>
                  <SelectItem value="green">Toutes les alertes</SelectItem>
                </SelectContent>
              </Select>
            )}
            <Switch checked={emailEnabled} onCheckedChange={handleToggleEmail} />
          </div>
        </div>
      </motion.div>

      {/* Active alerts list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground tracking-tight">
            Alertes actives {filter !== "all" && `· ${severityConfig[filter].label}`}
          </h3>
          {filter !== "all" && (
            <button
              onClick={() => setFilter("all")}
              className="text-xs text-primary hover:underline"
            >
              Réinitialiser le filtre
            </button>
          )}
        </div>

        {loading ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
            Chargement des alertes...
          </div>
        ) : activeAlerts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <Bell className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground">Aucune alerte active</p>
            <p className="text-xs text-muted-foreground mt-1">
              Lancez une analyse IA pour détecter les signaux faibles de votre business.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {activeAlerts.map((alert, idx) => {
              const cfg = severityConfig[alert.severity];
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: idx * 0.04 }}
                  className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-5`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`h-10 w-10 rounded-xl bg-white flex items-center justify-center shrink-0 ${cfg.border} border`}>
                      <Icon className={`h-5 w-5 ${cfg.text}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider ${cfg.text}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                          <Badge variant="outline" className="text-[10px] bg-white/60">
                            {categoryLabel[alert.category] ?? alert.category}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(alert.triggered_at).toLocaleDateString("fr-FR", {
                              day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <button
                          onClick={() => updateStatus(alert.id, "dismissed")}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Ignorer"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <h4 className="text-base font-semibold text-foreground tracking-tight">{alert.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        {alert.impact_estimate && (
                          <div className="rounded-xl bg-white/70 border border-border/60 p-3">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-0.5">
                              Impact estimé
                            </p>
                            <p className="text-sm font-semibold text-foreground">{alert.impact_estimate}</p>
                          </div>
                        )}
                        {alert.recommended_action && (
                          <div className="rounded-xl bg-white/70 border border-border/60 p-3">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-0.5">
                              Action recommandée
                            </p>
                            <p className="text-sm font-medium text-foreground">{alert.recommended_action}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => updateStatus(alert.id, "resolved")}
                          className="h-8 text-xs"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          Marquer comme résolue
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(alert.id, "dismissed")}
                          className="h-8 text-xs"
                        >
                          Ignorer
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* History */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full flex items-center justify-between p-5 hover:bg-secondary/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center">
              <History className="h-4 w-4 text-foreground" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">Historique 30 derniers jours</p>
              <p className="text-xs text-muted-foreground">{history.length} alerte{history.length > 1 ? "s" : ""} au total</p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">{showHistory ? "Masquer" : "Afficher"}</span>
        </button>

        {showHistory && (
          <div className="border-t border-border max-h-[480px] overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center p-8">
                Aucun historique sur les 30 derniers jours.
              </p>
            ) : (
              <div className="divide-y divide-border">
                {history.map((alert) => {
                  const cfg = severityConfig[alert.severity];
                  return (
                    <div key={alert.id} className="flex items-start gap-3 p-4 hover:bg-secondary/30 transition-colors">
                      <span className={`h-2 w-2 rounded-full mt-2 shrink-0 ${cfg.dot}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-foreground truncate">{alert.title}</p>
                          <Badge
                            variant="outline"
                            className={`text-[10px] shrink-0 ${
                              alert.status === "resolved" ? "text-green-700 border-green-200" :
                              alert.status === "dismissed" ? "text-muted-foreground" :
                              cfg.text
                            }`}
                          >
                            {alert.status === "resolved" ? "Résolue" :
                             alert.status === "dismissed" ? "Ignorée" : "Active"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{alert.description}</p>
                        <p className="text-[10px] text-muted-foreground/70 mt-1">
                          {new Date(alert.triggered_at).toLocaleDateString("fr-FR", {
                            day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                          })}
                          {" · "}{categoryLabel[alert.category] ?? alert.category}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartAlertsTab;
