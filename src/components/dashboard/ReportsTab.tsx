import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, BarChart3, CalendarDays, Download, FileText, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePDFGeneration } from "@/components/pdf/usePDFGeneration";
import type { ReportType } from "@/hooks/useReports";

const reportTypeLabels: Record<ReportType, { title: string; description: string; badge: string; frequency: string; icon: typeof FileText }> = {
  weekly: {
    title: "Hebdomadaire",
    description: "KPIs de la semaine, actions IA appliquées, recommandations pour la semaine suivante.",
    badge: "Tous les lundis",
    frequency: "Tous les lundis",
    icon: CalendarDays,
  },
  monthly: {
    title: "Mensuel",
    description: "Vue complète du mois : CA, marges, churn, top actions et impact mesuré en €.",
    badge: "Populaire",
    frequency: "Le 1er de chaque mois",
    icon: BarChart3,
  },
  diagnostic: {
    title: "Diagnostic 360°",
    description: "Analyse complète de votre santé business : benchmarks sectoriels, pertes détectées, plan d'optimisation.",
    badge: "À la demande",
    frequency: "À la demande",
    icon: Search,
  },
};

const HISTORY_KEY = "scalyo-reports-history";

type ReportHistoryItem = {
  type: ReportType;
  period: string;
  focus: string;
  date: string;
  fileName: string;
};

const ReportsTab = () => {
  const { generatePdf } = usePDFGeneration();
  const { toast } = useToast();
  const [history, setHistory] = useState<ReportHistoryItem[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(HISTORY_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as ReportHistoryItem[];
      if (Array.isArray(parsed)) {
        setHistory(parsed);
      }
    } catch {
      window.localStorage.removeItem(HISTORY_KEY);
    }
  }, []);

  const saveHistory = useCallback((item: ReportHistoryItem) => {
    setHistory((prev) => {
      const next = [item, ...prev].slice(0, 8);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const openChat = useCallback(() => {
    const chat = document.getElementById("reports-chat");
    if (chat) {
      chat.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, []);

  const handleGenerateClick = useCallback((type: ReportType) => {
    openChat();
  }, [openChat]);

  const handleDownload = useCallback(
    async (item: ReportHistoryItem) => {
      try {
        await generatePdf(item.type, {
          companyName: "Démo Commerce SAS",
          period: item.period,
          focus: item.focus,
          ca: 48500,
          growth: 12,
          churn: 4.2,
          nps: 62,
          clients: 1247,
          score: 84,
          heures: 8.5,
          date: item.date,
        }, item.fileName);
        saveHistory(item);
        toast({ title: "✅ PDF téléchargé !", duration: 3000 });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Impossible de télécharger le PDF.";
        toast({ title: "Erreur", description: message, variant: "destructive" });
      }
    },
    [generatePdf, saveHistory, toast],
  );

  const reportCards = useMemo(() => {
    return (Object.keys(reportTypeLabels) as ReportType[]).map((type) => {
      const info = reportTypeLabels[type];
      return (
        <button
          key={type}
          type="button"
          onClick={() => handleGenerateClick(type)}
          className={`group flex flex-col justify-between rounded-[18px] border bg-white p-6 text-left transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none ${
            type === "monthly" ? "border-blue-500 shadow-sm" : "border-gray-200"
          }`}
        >
          <div className="space-y-4">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <info.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-slate-900">{info.title}</h3>
                {type === "monthly" ? (
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-[11px] font-semibold text-blue-700">Populaire</span>
                ) : null}
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{info.description}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
              {info.frequency}
            </span>
            <span className="ml-auto inline-flex items-center gap-2 rounded-full bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
              Générer <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </button>
      );
    });
  }, [handleGenerateClick]);

  return (
    <div className="bg-[#F9FAFB] p-6">
      <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:gap-10">
        <div className="flex-1 space-y-8">
          <section className="rounded-[28px] border border-gray-200 bg-white p-8 shadow-sm">
            <div className="max-w-2xl space-y-4">
              <h1 className="text-3xl font-semibold text-slate-900">Rapports PDF</h1>
              <p className="text-base leading-7 text-slate-600">
                Vos rapports business professionnels — générés par IA, prêts à partager.
              </p>
            </div>
            <div className="mt-8">
              <button
                type="button"
                onClick={openChat}
                className="inline-flex items-center gap-3 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                ✨ Générer un rapport
              </button>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-3">
            {reportCards}
          </section>

          <section className="rounded-[28px] border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Rapports récents</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Retrouvez vos derniers exports PDF et retéléchargez-les en un clic.
                </p>
              </div>
            </div>

            {history.length === 0 ? (
              <div className="mt-8 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-slate-600">
                <div className="flex items-center gap-3 text-slate-500">
                  <FileText className="h-6 w-6" />
                  <p>Aucun rapport généré pour l'instant. Utilisez l'assistant à droite pour créer votre premier rapport.</p>
                </div>
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                {history.map((item) => (
                  <div key={`${item.type}-${item.date}-${item.fileName}`} className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {reportTypeLabels[item.type].title} · {item.period}
                        </p>
                        <p className="text-sm text-slate-500">{item.date}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => void handleDownload(item)}
                        className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                      >
                        <Download className="h-4 w-4" /> Retélécharger
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-[28px] border border-blue-200 bg-[#EFF6FF] p-8 shadow-sm">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-3 rounded-3xl bg-white p-5">
                <p className="text-3xl">📊</p>
                <h3 className="text-base font-semibold text-slate-900">Données réelles</h3>
                <p className="text-sm leading-6 text-slate-600">Vos chiffres, pas des templates génériques.</p>
              </div>
              <div className="space-y-3 rounded-3xl bg-white p-5">
                <p className="text-3xl">🤖</p>
                <h3 className="text-base font-semibold text-slate-900">Rédigé par IA</h3>
                <p className="text-sm leading-6 text-slate-600">Analyse et recommandations personnalisées.</p>
              </div>
              <div className="space-y-3 rounded-3xl bg-white p-5">
                <p className="text-3xl">📧</p>
                <h3 className="text-base font-semibold text-slate-900">Partageable</h3>
                <p className="text-sm leading-6 text-slate-600">PDF professionnel à envoyer à votre expert-comptable ou associés.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;
