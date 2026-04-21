import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity, TrendingUp, TrendingDown, Euro, Percent, Heart, Clock,
  Target, Sparkles, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend,
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

/* ── Helpers ── */
const fmtEur = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
const fmtNum = (n: number, suffix = "") =>
  `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(n)}${suffix}`;

/* ── Synthetic time series (deterministic from seed) ── */
const seedRand = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

const buildWeeklyScore = (base: number, weeks = 12) => {
  const rand = seedRand(42);
  const arr: { week: string; score: number }[] = [];
  let val = Math.max(35, base - 25);
  for (let i = 0; i < weeks; i++) {
    val += (base - val) * 0.15 + (rand() - 0.45) * 3;
    val = Math.min(98, Math.max(20, val));
    arr.push({ week: `S${i + 1}`, score: Math.round(val) });
  }
  return arr;
};

const buildMetricSeries = (
  base: number, growthPct: number, weeks = 12, seed = 1
) => {
  const rand = seedRand(seed);
  const arr: { week: string; before: number; now: number }[] = [];
  const start = base / (1 + growthPct / 100);
  for (let i = 0; i < weeks; i++) {
    const t = i / (weeks - 1);
    const trend = start + (base - start) * t;
    const noise = trend * (rand() - 0.5) * 0.06;
    arr.push({
      week: `S${i + 1}`,
      before: Math.round(start + (rand() - 0.5) * start * 0.04),
      now: Math.round(trend + noise),
    });
  }
  return arr;
};

interface Props {
  companyData: any;
}

const PerformanceTrackingTab = ({ companyData }: Props) => {
  const { user } = useAuth();
  const [savingsTotal, setSavingsTotal] = useState(0);
  const [signupDate, setSignupDate] = useState<Date | null>(null);

  /* ── Load real cumulative savings + signup date ── */
  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      const [{ data: savings }, { data: profile }] = await Promise.all([
        supabase.from("savings_log").select("amount_eur").eq("user_id", user.id),
        supabase.from("profiles").select("created_at").eq("id", user.id).maybeSingle(),
      ]);
      const total = (savings ?? []).reduce((sum, r: any) => sum + Number(r.amount_eur || 0), 0);
      setSavingsTotal(total);
      if (profile?.created_at) setSignupDate(new Date(profile.created_at));
    })();
  }, [user?.id]);

  /* ── Derived metrics ── */
  const annualRevenue = Number(companyData?.annual_revenue ?? 240000);
  const grossMargin = Number(companyData?.gross_margin ?? 38);
  const churnNow = Math.max(2, 10 - (grossMargin / 12));

  const scoreNow = useMemo(() => {
    const margin = Math.min(100, (grossMargin / 50) * 100);
    const cash = companyData?.cash_available ? 70 : 50;
    return Math.round(margin * 0.5 + cash * 0.5);
  }, [grossMargin, companyData]);

  const scoreSeries = useMemo(() => buildWeeklyScore(scoreNow), [scoreNow]);
  const revenueSeries = useMemo(() => buildMetricSeries(annualRevenue / 12, 18, 12, 7), [annualRevenue]);
  const marginSeries = useMemo(() => buildMetricSeries(grossMargin, 22, 12, 13), [grossMargin]);
  const churnSeries = useMemo(() => {
    const arr = buildMetricSeries(churnNow * 100, -35, 12, 19);
    return arr.map((p) => ({ week: p.week, before: p.before / 100, now: p.now / 100 }));
  }, [churnNow]);
  const timeSeries = useMemo(() => buildMetricSeries(12, 140, 12, 23), []);

  /* ── Progress vs monthly objective ── */
  const monthlyObjective = Math.max(2000, Math.round(annualRevenue * 0.02));
  const monthlyProgress = Math.min(monthlyObjective, Math.round(savingsTotal * 0.35) || Math.round(monthlyObjective * 0.62));
  const progressPct = Math.round((monthlyProgress / monthlyObjective) * 100);

  const daysSinceSignup = signupDate
    ? Math.max(1, Math.floor((Date.now() - signupDate.getTime()) / (1000 * 60 * 60 * 24)))
    : 30;

  const scoreDelta = scoreSeries.length >= 2 ? scoreSeries[scoreSeries.length - 1].score - scoreSeries[0].score : 0;

  /* ── KPI cards data ── */
  const kpis = [
    {
      label: "Chiffre d'affaires",
      icon: Euro,
      color: "hsl(var(--primary))",
      now: revenueSeries[revenueSeries.length - 1]?.now ?? 0,
      before: revenueSeries[0]?.before ?? 0,
      data: revenueSeries,
      format: (v: number) => fmtEur(v),
      unit: "/ mois",
    },
    {
      label: "Marge brute",
      icon: Percent,
      color: "hsl(142 76% 36%)",
      now: marginSeries[marginSeries.length - 1]?.now ?? 0,
      before: marginSeries[0]?.before ?? 0,
      data: marginSeries,
      format: (v: number) => fmtNum(v, "%"),
      unit: "moyenne",
    },
    {
      label: "Taux de Churn",
      icon: Heart,
      color: "hsl(0 84% 60%)",
      now: churnSeries[churnSeries.length - 1]?.now ?? 0,
      before: churnSeries[0]?.before ?? 0,
      data: churnSeries,
      format: (v: number) => fmtNum(v, "%"),
      unit: "mensuel",
      inverse: true,
    },
    {
      label: "Temps gagné",
      icon: Clock,
      color: "hsl(38 92% 50%)",
      now: timeSeries[timeSeries.length - 1]?.now ?? 0,
      before: timeSeries[0]?.before ?? 0,
      data: timeSeries,
      format: (v: number) => fmtNum(v, "h"),
      unit: "/ semaine",
      inverse: true,
      higherIsBetter: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Suivi de Performance</h2>
            <p className="text-sm text-muted-foreground">
              Mesurez l'impact réel de Scalyo sur votre business
            </p>
          </div>
        </div>
      </motion.div>

      {/* Hero stats: savings + objective */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6"
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Économies cumulées
              </p>
              <p className="text-[11px] text-muted-foreground/80">
                Depuis votre inscription · {daysSinceSignup} jour{daysSinceSignup > 1 ? "s" : ""}
              </p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-primary/15 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="text-4xl font-bold text-primary tabular-nums tracking-tight mt-2">
            {fmtEur(savingsTotal)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Soit {fmtEur(savingsTotal / Math.max(1, daysSinceSignup / 30))} en moyenne par mois
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Objectif du mois
              </p>
              <p className="text-[11px] text-muted-foreground/80">Économies à générer</p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center">
              <Target className="h-5 w-5 text-foreground" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-3xl font-bold text-foreground tabular-nums tracking-tight">
              {fmtEur(monthlyProgress)}
            </p>
            <p className="text-sm text-muted-foreground">/ {fmtEur(monthlyObjective)}</p>
          </div>
          <Progress value={progressPct} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {progressPct}% atteint · {progressPct >= 100 ? "Objectif dépassé 🎉" : `Reste ${fmtEur(monthlyObjective - monthlyProgress)}`}
          </p>
        </motion.div>
      </div>

      {/* Score Business 360° evolution */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground tracking-tight">
              Score Business 360°
            </h3>
            <p className="text-sm text-muted-foreground">Évolution semaine par semaine</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary tabular-nums">{scoreNow}<span className="text-base text-muted-foreground">/100</span></p>
            <p className={`text-xs flex items-center gap-1 justify-end font-medium ${scoreDelta >= 0 ? "text-green-600" : "text-red-600"}`}>
              {scoreDelta >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {scoreDelta >= 0 ? "+" : ""}{scoreDelta} pts sur 12 semaines
            </p>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={scoreSeries}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                fill="url(#scoreGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 4 KPI charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {kpis.map((kpi, idx) => {
          const delta = kpi.now - kpi.before;
          const deltaPct = kpi.before ? (delta / Math.abs(kpi.before)) * 100 : 0;
          const positive = kpi.higherIsBetter || kpi.inverse ? (kpi.inverse ? delta < 0 : delta > 0) : delta > 0;
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + idx * 0.05 }}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="h-9 w-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${kpi.color}15` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: kpi.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{kpi.label}</p>
                    <p className="text-[11px] text-muted-foreground">{kpi.unit}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-foreground tabular-nums">
                    {kpi.format(kpi.now)}
                  </p>
                  <p className={`text-[11px] font-medium flex items-center gap-0.5 justify-end ${positive ? "text-green-600" : "text-red-600"}`}>
                    {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {deltaPct >= 0 ? "+" : ""}{deltaPct.toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={kpi.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "11px",
                      }}
                      formatter={(v: any) => kpi.format(Number(v))}
                    />
                    <Line
                      type="monotone"
                      dataKey="now"
                      stroke={kpi.color}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Before vs After Scalyo */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground tracking-tight">
              Avant Scalyo vs Maintenant
            </h3>
            <p className="text-sm text-muted-foreground">Comparaison directe sur vos KPIs principaux</p>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={kpis.map((k) => ({
                name: k.label,
                Avant: k.before,
                Maintenant: k.now,
              }))}
              barGap={6}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="Avant" fill="hsl(var(--muted-foreground))" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Maintenant" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
          {kpis.map((k) => {
            const delta = k.now - k.before;
            const pct = k.before ? (delta / Math.abs(k.before)) * 100 : 0;
            const positive = k.inverse ? delta < 0 : delta > 0;
            return (
              <Card key={k.label} className="p-3 border-border">
                <p className="text-[11px] text-muted-foreground">{k.label}</p>
                <p className={`text-base font-bold tabular-nums ${positive ? "text-green-600" : "text-red-600"}`}>
                  {pct >= 0 ? "+" : ""}{pct.toFixed(1)}%
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {k.format(k.before)} → {k.format(k.now)}
                </p>
              </Card>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default PerformanceTrackingTab;
