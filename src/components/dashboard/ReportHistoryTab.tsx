import { useCallback, useEffect, useMemo, useState } from "react";
import { FileText, Download, TrendingUp, TrendingDown, Minus, Calendar, BarChart3, GitCompare, Sparkles } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { usePDFGeneration } from "@/components/pdf/usePDFGeneration";
import type { ReportType } from "@/hooks/useReports";

type ReportHistoryRow = {
  id: string;
  report_type: ReportType;
  title: string;
  period_label: string | null;
  score: number | null;
  summary: string | null;
  metrics: Record<string, unknown> | null;
  file_name: string | null;
  generated_at: string;
};

const TYPE_LABEL: Record<ReportType, string> = {
  weekly: "Hebdomadaire",
  monthly: "Mensuel",
  diagnostic: "Diagnostic 360°",
};

const TYPE_BADGE: Record<ReportType, string> = {
  weekly: "bg-blue-50 text-blue-700 border-blue-200",
  monthly: "bg-emerald-50 text-emerald-700 border-emerald-200",
  diagnostic: "bg-purple-50 text-purple-700 border-purple-200",
};

const db = supabase as any;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

const ReportHistoryTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { generatePdf } = usePDFGeneration();

  const [reports, setReports] = useState<ReportHistoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ReportType | "all">("all");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [seeding, setSeeding] = useState(false);

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data, error } = await db
      .from("report_history")
      .select("*")
      .eq("user_id", user.id)
      .order("generated_at", { ascending: false });
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setReports((data ?? []) as ReportHistoryRow[]);
    }
    setLoading(false);
  }, [user?.id, toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(
    () => (filter === "all" ? reports : reports.filter((r) => r.report_type === filter)),
    [reports, filter],
  );

  const chartData = useMemo(
    () =>
      [...reports]
        .reverse()
        .map((r) => ({
          date: new Date(r.generated_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
          score: r.score ?? 0,
          type: TYPE_LABEL[r.report_type],
        })),
    [reports],
  );

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const comparison = useMemo(() => {
    if (compareIds.length !== 2) return null;
    const [a, b] = compareIds.map((id) => reports.find((r) => r.id === id)).filter(Boolean) as ReportHistoryRow[];
    if (!a || !b) return null;
    const [older, newer] = new Date(a.generated_at) < new Date(b.generated_at) ? [a, b] : [b, a];
    const diff = (newer.score ?? 0) - (older.score ?? 0);
    return { older, newer, diff };
  }, [compareIds, reports]);

  const handleDownload = async (r: ReportHistoryRow) => {
    try {
      await generatePdf(r.report_type, {
        period: r.period_label ?? undefined,
        focus: TYPE_LABEL[r.report_type],
        score: r.score ?? undefined,
        date: formatDate(r.generated_at),
      }, r.file_name ?? `scalyo-${r.report_type}-${r.id.slice(0, 8)}.pdf`);
      toast({ title: "✅ PDF téléchargé !", duration: 2500 });
    } catch (e) {
      toast({ title: "Erreur", description: "Impossible de télécharger le PDF.", variant: "destructive" });
    }
  };

  const seedDemo = async () => {
    if (!user?.id) return;
    setSeeding(true);
    const now = Date.now();
    const samples: Array<Omit<ReportHistoryRow, "id">> = [
      { report_type: "diagnostic", title: "Diagnostic 360° initial", period_label: "Avril 2026", score: 58, summary: "Premier diagnostic complet. Plusieurs pertes détectées en marketing et opérations.", metrics: {}, file_name: "diag-1.pdf", generated_at: new Date(now - 1000 * 60 * 60 * 24 * 90).toISOString() },
      { report_type: "monthly", title: "Rapport mensuel — Mai", period_label: "Mai 2026", score: 64, summary: "Progression de +6 points. CA en hausse, churn stable.", metrics: {}, file_name: "monthly-5.pdf", generated_at: new Date(now - 1000 * 60 * 60 * 24 * 60).toISOString() },
      { report_type: "weekly", title: "Rapport hebdo S22", period_label: "Semaine 22", score: 67, summary: "Optimisations marketing actives. +3 points cette semaine.", metrics: {}, file_name: "weekly-22.pdf", generated_at: new Date(now - 1000 * 60 * 60 * 24 * 30).toISOString() },
      { report_type: "monthly", title: "Rapport mensuel — Juin", period_label: "Juin 2026", score: 72, summary: "Marges en hausse, automatisations actives, +8 points.", metrics: {}, file_name: "monthly-6.pdf", generated_at: new Date(now - 1000 * 60 * 60 * 24 * 14).toISOString() },
      { report_type: "weekly", title: "Rapport hebdo récent", period_label: "Cette semaine", score: 78, summary: "Excellente trajectoire. Score business au-dessus de la moyenne sectorielle.", metrics: {}, file_name: "weekly-now.pdf", generated_at: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString() },
    ];
    const { error } = await db.from("report_history").insert(samples.map((s) => ({ ...s, user_id: user.id })));
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Données de démo ajoutées" });
      await load();
    }
    setSeeding(false);
  };

  return (
    <div className="bg-[#F9FAFB] p-6 space-y-6">
      {/* Header */}
      <section className="rounded-[28px] border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-slate-900">Historique des Rapports</h1>
            <p className="text-base text-slate-600">Tous vos rapports générés, leur évolution et leur impact.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["all", "weekly", "monthly", "diagnostic"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  filter === f ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {f === "all" ? "Tous" : TYPE_LABEL[f]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Score evolution chart */}
      <section className="rounded-[28px] border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-slate-900">Évolution du Score Business 360°</h2>
        </div>
        {chartData.length === 0 ? (
          <p className="text-sm text-slate-500 py-12 text-center">Aucun rapport pour tracer une évolution.</p>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
                  formatter={(v: number) => [`${v}/100`, "Score"]}
                />
                <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} dot={{ r: 5, fill: "#2563eb" }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      {/* Comparison panel */}
      {comparison && (
        <section className="rounded-[28px] border border-blue-200 bg-blue-50 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <GitCompare className="h-5 w-5 text-blue-700" />
            <h3 className="text-lg font-semibold text-slate-900">Évolution entre 2 rapports</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Avant · {formatDate(comparison.older.generated_at)}</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{comparison.older.score}/100</p>
              <p className="text-xs text-slate-600 mt-1">{TYPE_LABEL[comparison.older.report_type]}</p>
            </div>
            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Après · {formatDate(comparison.newer.generated_at)}</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{comparison.newer.score}/100</p>
              <p className="text-xs text-slate-600 mt-1">{TYPE_LABEL[comparison.newer.report_type]}</p>
            </div>
            <div className={`rounded-2xl p-4 flex flex-col justify-center ${comparison.diff >= 0 ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
              <div className="flex items-center gap-2">
                {comparison.diff > 0 ? <TrendingUp className="h-5 w-5" /> : comparison.diff < 0 ? <TrendingDown className="h-5 w-5" /> : <Minus className="h-5 w-5" />}
                <p className="text-xs uppercase tracking-wide opacity-90">Évolution</p>
              </div>
              <p className="text-3xl font-bold mt-2">{comparison.diff > 0 ? "+" : ""}{comparison.diff} pts</p>
              <p className="text-xs opacity-90 mt-1">
                {comparison.diff > 0 ? "Belle progression !" : comparison.diff < 0 ? "Score en baisse" : "Score stable"}
              </p>
            </div>
          </div>
          <button onClick={() => setCompareIds([])} className="mt-4 text-sm font-medium text-blue-700 hover:underline">
            Effacer la comparaison
          </button>
        </section>
      )}

      {/* List */}
      <section className="rounded-[28px] border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Tous les rapports ({filtered.length})</h2>
            <p className="text-sm text-slate-500 mt-1">
              {compareIds.length === 0
                ? "Sélectionnez 2 rapports pour comparer leur évolution."
                : compareIds.length === 1
                  ? "Sélectionnez un 2ème rapport pour comparer."
                  : "Comparaison active ci-dessus."}
            </p>
          </div>
          {reports.length === 0 && !loading && (
            <button
              onClick={seedDemo}
              disabled={seeding}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" /> {seeding ? "Création..." : "Charger des données de démo"}
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-sm text-slate-500 py-12 text-center">Chargement...</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
            <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600">Aucun rapport pour ce filtre.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((r) => {
              const selected = compareIds.includes(r.id);
              return (
                <div
                  key={r.id}
                  className={`flex flex-col gap-4 rounded-2xl border p-5 transition sm:flex-row sm:items-center ${
                    selected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-slate-900 truncate">{r.title}</h3>
                        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${TYPE_BADGE[r.report_type]}`}>
                          {TYPE_LABEL[r.report_type]}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(r.generated_at)}</span>
                        {r.period_label && <span>· {r.period_label}</span>}
                      </div>
                      {r.summary && <p className="text-sm text-slate-600 mt-2 line-clamp-2">{r.summary}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-900">{r.score ?? "—"}<span className="text-sm text-slate-400">/100</span></p>
                      <p className="text-[11px] text-slate-500">Score</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleCompare(r.id)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                          selected ? "bg-blue-600 text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <GitCompare className="h-3.5 w-3.5" /> {selected ? "Sélectionné" : "Comparer"}
                      </button>
                      <button
                        onClick={() => void handleDownload(r)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                      >
                        <Download className="h-3.5 w-3.5" /> PDF
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default ReportHistoryTab;
