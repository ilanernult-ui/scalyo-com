import { useMemo } from "react";
import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingDown, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LossPoint } from "@/hooks/useDashboardEnrichment";

interface Props {
  losses: LossPoint[];
  onGeneratePlan?: () => void;
  generating?: boolean;
}

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  cash: { label: "Trésorerie", color: "hsl(0,72%,55%)" },
  churn: { label: "Churn clients", color: "hsl(25,90%,55%)" },
  ops: { label: "Opérations", color: "hsl(45,90%,55%)" },
  marketing: { label: "Marketing", color: "hsl(220,70%,55%)" },
  other: { label: "Autres", color: "hsl(260,50%,55%)" },
};

const fmtMonth = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });

const LossesSection = ({ losses, onGeneratePlan, generating }: Props) => {
  // Aggregate by category for current bar chart
  const byCategory = useMemo(() => {
    const m = new Map<string, { amount: number; explanation: string | null }>();
    losses.forEach((l) => {
      const prev = m.get(l.category) ?? { amount: 0, explanation: l.explanation };
      m.set(l.category, { amount: prev.amount + Number(l.amount_eur), explanation: prev.explanation ?? l.explanation });
    });
    return Array.from(m.entries()).map(([category, v]) => ({
      category,
      label: CATEGORY_LABELS[category]?.label ?? category,
      color: CATEGORY_LABELS[category]?.color ?? "hsl(220,15%,55%)",
      amount: v.amount,
      explanation: v.explanation,
    })).sort((a, b) => b.amount - a.amount);
  }, [losses]);

  // 6 months timeline (sum across categories)
  const timeline = useMemo(() => {
    const m = new Map<string, number>();
    losses.forEach((l) => {
      m.set(l.period_month, (m.get(l.period_month) ?? 0) + Number(l.amount_eur));
    });
    return Array.from(m.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6)
      .map(([period, amount]) => ({ period: fmtMonth(period), amount: Math.round(amount) }));
  }, [losses]);

  // Projection: average monthly loss × 6
  const projection6m = useMemo(() => {
    if (timeline.length === 0) return 0;
    const avg = timeline.reduce((s, t) => s + t.amount, 0) / timeline.length;
    return Math.round(avg * 6);
  }, [timeline]);

  if (losses.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-secondary/40 p-8 text-center">
        <TrendingDown className="h-7 w-7 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm font-medium text-foreground mb-1">Aucune perte enregistrée</p>
        <p className="text-xs text-muted-foreground">Lancez une analyse IA pour estimer vos pertes par catégorie.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-red-500" />
            Pertes détectées
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Estimation chiffrée par catégorie + évolution 6 mois</p>
        </div>
        <Button size="sm" onClick={onGeneratePlan} disabled={generating} className="gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          {generating ? "Génération…" : "Plan de récupération IA"}
        </Button>
      </div>

      {/* Bar chart par catégorie */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-sm)]"
      >
        <p className="text-xs font-medium text-muted-foreground mb-3">Pertes par catégorie (mensuel)</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byCategory} margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                cursor={{ fill: "hsl(var(--secondary))" }}
                contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
                formatter={(v: number) => [`${v.toLocaleString("fr-FR")} €`, "Perte"]}
              />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                {byCategory.map((d) => <Cell key={d.category} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Explanations under each bar */}
        <div className="grid sm:grid-cols-2 gap-2 mt-4">
          {byCategory.map((d) => (
            <div key={d.category} className="flex items-start gap-2 rounded-xl border border-border/60 px-3 py-2">
              <span className="h-2 w-2 rounded-full mt-1.5 shrink-0" style={{ background: d.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-foreground">{d.label}</p>
                  <p className="text-xs font-bold text-red-500 tabular-nums">
                    −{d.amount.toLocaleString("fr-FR")} €
                  </p>
                </div>
                {d.explanation && (
                  <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{d.explanation}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Timeline 6 mois + projection */}
      <div className="grid lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-sm)]"
        >
          <p className="text-xs font-medium text-muted-foreground mb-3">Évolution des pertes (6 derniers mois)</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeline} margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
                  formatter={(v: number) => [`${v.toLocaleString("fr-FR")} €`, "Perte"]}
                />
                <Line type="monotone" dataKey="amount" stroke="hsl(0,72%,55%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(0,72%,55%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-5 flex flex-col justify-center"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">Si vous ne faites rien</p>
          </div>
          <p className="text-3xl font-bold text-red-500 tabular-nums">
            −{projection6m.toLocaleString("fr-FR")} €
          </p>
          <p className="text-xs text-muted-foreground mt-1">de pertes projetées d'ici 6 mois</p>
          <p className="text-[11px] text-muted-foreground/80 mt-2 leading-relaxed">
            Basé sur la moyenne de vos pertes mensuelles. Lancez un plan de récupération IA pour stopper l'hémorragie.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LossesSection;
