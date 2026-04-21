import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, TrendingUp, TrendingDown, Minus, Sparkles, Loader2, Trophy,
} from "lucide-react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Legend, Tooltip,
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import ReactMarkdown from "react-markdown";

type SectorKey = "ecommerce" | "saas" | "retail" | "services" | "restauration";

const sectorLabels: Record<SectorKey, string> = {
  ecommerce: "E-commerce",
  saas: "SaaS",
  retail: "Retail",
  services: "Services",
  restauration: "Restauration",
};

/* ── Reference benchmarks: { sector: { metric: { avg, top10 } } } ── */
type BenchmarkRow = {
  key: string;
  label: string;
  unit: string;
  higherIsBetter: boolean;
  /* Scaling: divide raw value to map to 0-100 for radar */
  radarMax: number;
  format: (v: number) => string;
};

const metrics: BenchmarkRow[] = [
  { key: "gross_margin", label: "Marge brute", unit: "%", higherIsBetter: true, radarMax: 80, format: (v) => `${v.toFixed(1)}%` },
  { key: "net_margin", label: "Marge nette", unit: "%", higherIsBetter: true, radarMax: 35, format: (v) => `${v.toFixed(1)}%` },
  { key: "retention_rate", label: "Rétention", unit: "%", higherIsBetter: true, radarMax: 100, format: (v) => `${v.toFixed(1)}%` },
  { key: "churn", label: "Churn (inversé)", unit: "%", higherIsBetter: false, radarMax: 30, format: (v) => `${v.toFixed(1)}%` },
  { key: "avg_basket", label: "Panier moyen", unit: "€", higherIsBetter: true, radarMax: 250, format: (v) => `${Math.round(v)}€` },
  { key: "conversion", label: "Conversion", unit: "%", higherIsBetter: true, radarMax: 12, format: (v) => `${v.toFixed(1)}%` },
];

const sectorBenchmarks: Record<SectorKey, Record<string, { avg: number; top10: number }>> = {
  ecommerce: {
    gross_margin: { avg: 42, top10: 58 },
    net_margin: { avg: 8, top10: 18 },
    retention_rate: { avg: 28, top10: 55 },
    churn: { avg: 12, top10: 4 },
    avg_basket: { avg: 65, top10: 140 },
    conversion: { avg: 2.1, top10: 5.5 },
  },
  saas: {
    gross_margin: { avg: 72, top10: 85 },
    net_margin: { avg: 12, top10: 30 },
    retention_rate: { avg: 85, top10: 96 },
    churn: { avg: 6, top10: 1.5 },
    avg_basket: { avg: 89, top10: 220 },
    conversion: { avg: 3.2, top10: 8.0 },
  },
  retail: {
    gross_margin: { avg: 38, top10: 52 },
    net_margin: { avg: 5, top10: 12 },
    retention_rate: { avg: 35, top10: 62 },
    churn: { avg: 15, top10: 6 },
    avg_basket: { avg: 48, top10: 110 },
    conversion: { avg: 1.8, top10: 4.5 },
  },
  services: {
    gross_margin: { avg: 55, top10: 72 },
    net_margin: { avg: 14, top10: 28 },
    retention_rate: { avg: 62, top10: 88 },
    churn: { avg: 9, top10: 3 },
    avg_basket: { avg: 180, top10: 480 },
    conversion: { avg: 2.8, top10: 7.0 },
  },
  restauration: {
    gross_margin: { avg: 65, top10: 75 },
    net_margin: { avg: 6, top10: 15 },
    retention_rate: { avg: 30, top10: 58 },
    churn: { avg: 18, top10: 7 },
    avg_basket: { avg: 28, top10: 72 },
    conversion: { avg: 1.5, top10: 4.0 },
  },
};

const guessSector = (sector?: string | null): SectorKey => {
  if (!sector) return "services";
  const s = sector.toLowerCase();
  if (s.includes("commerce") || s.includes("e-com")) return "ecommerce";
  if (s.includes("saas") || s.includes("software") || s.includes("tech")) return "saas";
  if (s.includes("retail") || s.includes("magasin") || s.includes("boutique")) return "retail";
  if (s.includes("restau") || s.includes("food")) return "restauration";
  return "services";
};

interface Props {
  companyData: any;
}

const BenchmarksTab = ({ companyData }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sector, setSector] = useState<SectorKey>(guessSector(companyData?.sector));
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    setSector(guessSector(companyData?.sector));
  }, [companyData?.sector]);

  /* ── Compute user metric values (with reasonable fallbacks) ── */
  const userMetrics: Record<string, number> = useMemo(() => {
    const rev = Number(companyData?.annual_revenue ?? 240000);
    const trans = Number(companyData?.monthly_transactions ?? 0) || (rev / 12 / 80);
    const grossMargin = Number(companyData?.gross_margin ?? sectorBenchmarks[sector].gross_margin.avg * 0.85);
    const netMargin = Number(companyData?.net_margin ?? sectorBenchmarks[sector].net_margin.avg * 0.7);
    const retention = Number(companyData?.retention_rate ?? sectorBenchmarks[sector].retention_rate.avg * 0.9);
    const churnFromHist = retention ? Math.max(1, 100 - retention) / 6 : sectorBenchmarks[sector].churn.avg;
    const basket = Number(companyData?.avg_basket ?? sectorBenchmarks[sector].avg_basket.avg * 0.8);
    const conv = sectorBenchmarks[sector].conversion.avg * 0.85;

    return {
      gross_margin: grossMargin,
      net_margin: netMargin,
      retention_rate: retention,
      churn: churnFromHist,
      avg_basket: basket,
      conversion: conv,
    };
  }, [companyData, sector]);

  const benchmark = sectorBenchmarks[sector];

  /* ── Score competitive (0-100) ── */
  const competitivenessScore = useMemo(() => {
    let total = 0;
    metrics.forEach((m) => {
      const user = userMetrics[m.key];
      const avg = benchmark[m.key].avg;
      const top = benchmark[m.key].top10;
      let pct: number;
      if (m.higherIsBetter) {
        pct = ((user - avg) / Math.max(0.01, top - avg)) * 50 + 50;
      } else {
        pct = ((avg - user) / Math.max(0.01, avg - top)) * 50 + 50;
      }
      total += Math.max(0, Math.min(100, pct));
    });
    return Math.round(total / metrics.length);
  }, [userMetrics, benchmark]);

  const scoreColor = competitivenessScore >= 70 ? "text-green-600" :
                     competitivenessScore >= 50 ? "text-orange-500" : "text-red-600";
  const scoreBg = competitivenessScore >= 70 ? "from-green-500/15 to-green-500/5 border-green-200" :
                  competitivenessScore >= 50 ? "from-orange-500/15 to-orange-500/5 border-orange-200" :
                  "from-red-500/15 to-red-500/5 border-red-200";
  const scoreLabel = competitivenessScore >= 70 ? "Excellent" :
                     competitivenessScore >= 50 ? "Dans la moyenne" : "À améliorer";

  /* ── Radar data (normalized 0-100) ── */
  const radarData = metrics.map((m) => {
    const norm = (v: number) =>
      m.higherIsBetter
        ? Math.min(100, (v / m.radarMax) * 100)
        : Math.max(0, 100 - (v / m.radarMax) * 100);
    return {
      metric: m.label,
      Vous: Math.round(norm(userMetrics[m.key])),
      Moyenne: Math.round(norm(benchmark[m.key].avg)),
      "Top 10%": Math.round(norm(benchmark[m.key].top10)),
    };
  });

  /* ── AI analysis ── */
  const handleAiAnalysis = async () => {
    setLoadingAi(true);
    setAiAnalysis("");
    try {
      const summary = metrics.map((m) => {
        const u = userMetrics[m.key];
        const a = benchmark[m.key].avg;
        const t = benchmark[m.key].top10;
        return `- ${m.label}: vous=${m.format(u)} | moyenne=${m.format(a)} | top10%=${m.format(t)}`;
      }).join("\n");

      const prompt = `Tu es un consultant business expert du secteur ${sectorLabels[sector]}. Analyse cette comparaison benchmark de PME française :

${summary}

Score de compétitivité sectorielle : ${competitivenessScore}/100

Fournis une analyse synthétique en français (markdown) avec :
1. **Top 3 forces** vs marché (avec pourcentage d'écart)
2. **Top 3 faiblesses** à corriger en priorité (avec impact estimé)
3. **Recommandation stratégique** principale (1 phrase) pour atteindre le top 10%

Sois concret, factuel et actionnable. Maximum 250 mots.`;

      const { data, error } = await supabase.functions.invoke("scalyo-chat", {
        body: { messages: [{ role: "user", content: prompt }], activeTab: "datadiag" },
      });
      if (error) throw error;
      setAiAnalysis(data?.message ?? data?.response ?? "Aucune réponse IA.");
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message ?? "Échec de l'analyse IA", variant: "destructive" });
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Benchmarks Sectoriels</h2>
              <p className="text-sm text-muted-foreground">
                Comparez vos performances à la moyenne et au top 10% de votre secteur
              </p>
            </div>
          </div>

          <Select value={sector} onValueChange={(v) => setSector(v as SectorKey)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(sectorLabels) as SectorKey[]).map((k) => (
                <SelectItem key={k} value={k}>{sectorLabels[k]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Score card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl border bg-gradient-to-br ${scoreBg} p-6`}
      >
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center shadow-sm">
              <Trophy className={`h-7 w-7 ${scoreColor}`} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Compétitivité sectorielle
              </p>
              <p className="text-sm text-foreground font-medium">
                Secteur : {sectorLabels[sector]} · {scoreLabel}
              </p>
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <p className={`text-5xl font-bold tabular-nums ${scoreColor}`}>{competitivenessScore}</p>
            <p className="text-lg text-muted-foreground font-medium">/100</p>
          </div>
        </div>
      </motion.div>

      {/* Radar + Comparison */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Radar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border bg-card p-5"
        >
          <h3 className="text-base font-semibold text-foreground tracking-tight mb-1">
            Cartographie des performances
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            Vue radar : vos métriques vs marché vs top 10%
          </p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} />
                <Radar name="Top 10%" dataKey="Top 10%" stroke="hsl(38 92% 50%)" fill="hsl(38 92% 50%)" fillOpacity={0.15} />
                <Radar name="Moyenne secteur" dataKey="Moyenne" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground))" fillOpacity={0.1} />
                <Radar name="Vous" dataKey="Vous" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.35} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-border bg-card p-5"
        >
          <h3 className="text-base font-semibold text-foreground tracking-tight mb-1">
            Tableau comparatif détaillé
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            Vos métriques face au marché
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-[11px] text-muted-foreground uppercase tracking-wider">
                  <th className="text-left font-medium py-2 pr-2">Métrique</th>
                  <th className="text-right font-medium py-2 px-2">Vous</th>
                  <th className="text-right font-medium py-2 px-2">Moyenne</th>
                  <th className="text-right font-medium py-2 px-2">Top 10%</th>
                  <th className="text-right font-medium py-2 pl-2">Écart</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {metrics.map((m) => {
                  const u = userMetrics[m.key];
                  const a = benchmark[m.key].avg;
                  const t = benchmark[m.key].top10;
                  const delta = m.higherIsBetter ? ((u - a) / a) * 100 : ((a - u) / a) * 100;
                  const positive = delta > 5;
                  const negative = delta < -5;
                  const Icon = positive ? TrendingUp : negative ? TrendingDown : Minus;
                  const color = positive ? "text-green-600" : negative ? "text-red-600" : "text-muted-foreground";

                  return (
                    <tr key={m.key} className="hover:bg-secondary/40 transition-colors">
                      <td className="py-3 pr-2 font-medium text-foreground">{m.label}</td>
                      <td className="py-3 px-2 text-right tabular-nums font-semibold text-foreground">{m.format(u)}</td>
                      <td className="py-3 px-2 text-right tabular-nums text-muted-foreground">{m.format(a)}</td>
                      <td className="py-3 px-2 text-right tabular-nums text-muted-foreground">{m.format(t)}</td>
                      <td className="py-3 pl-2 text-right">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold ${color}`}>
                          <Icon className="h-3 w-3" />
                          {delta >= 0 ? "+" : ""}{delta.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* AI Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl border border-border bg-card p-5"
      >
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground tracking-tight">
                Analyse IA des écarts
              </h3>
              <p className="text-xs text-muted-foreground">
                Comprenez vos forces et faiblesses face au secteur {sectorLabels[sector]}
              </p>
            </div>
          </div>
          <Button onClick={handleAiAnalysis} disabled={loadingAi} className="gap-2">
            {loadingAi ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loadingAi ? "Analyse..." : aiAnalysis ? "Régénérer" : "Lancer l'analyse IA"}
          </Button>
        </div>

        {aiAnalysis ? (
          <div className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-p:text-foreground/90 prose-li:text-foreground/90">
            <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
          </div>
        ) : !loadingAi && (
          <div className="rounded-xl bg-secondary/40 border border-dashed border-border p-6 text-center">
            <Sparkles className="h-7 w-7 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Cliquez sur <Badge variant="outline" className="mx-1">Lancer l'analyse IA</Badge>
              pour obtenir une lecture stratégique de vos écarts.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BenchmarksTab;
