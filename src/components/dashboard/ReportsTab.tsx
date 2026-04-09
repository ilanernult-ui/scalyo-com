import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Download, Mail, CheckCircle2, Loader2,
  Calendar, BarChart3, Activity, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useReports, type Report, type ReportType } from "@/hooks/useReports";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { analytics } from "@/lib/analytics";
import { usePDFGeneration } from "@/components/pdf/usePDFGeneration";

const REPORT_TYPES: {
  type: ReportType;
  label: string;
  icon: typeof FileText;
  description: string;
  frequency: string;
  accentCls: string;
}[] = [
  {
    type: "weekly",
    label: "Rapport hebdomadaire",
    icon: Calendar,
    description: "KPIs de la semaine, recommandations appliquées, actions prioritaires pour la semaine suivante.",
    frequency: "Tous les lundis",
    accentCls: "text-primary bg-primary/10",
  },
  {
    type: "monthly",
    label: "Rapport mensuel",
    icon: BarChart3,
    description: "Vue d'ensemble du mois : MRR, churn, score business 360°, top 5 actions réalisées et impact mesuré.",
    frequency: "Le 1er de chaque mois",
    accentCls: "text-emerald-600 bg-emerald-50",
  },
  {
    type: "diagnostic",
    label: "Rapport de diagnostic",
    icon: Activity,
    description: "Analyse complète de votre santé business : benchmarks sectoriels, problèmes détectés, plan d'optimisation.",
    frequency: "À la demande",
    accentCls: "text-orange-600 bg-orange-50",
  },
];

function getPeriodLabel(type: ReportType): string {
  if (type === "weekly") {
    const d = new Date();
    const monday = new Date(d.setDate(d.getDate() - d.getDay() + 1));
    return `Semaine du ${monday.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`;
  }
  if (type === "monthly") {
    return new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  }
  return `Diagnostic du ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`;
}

const ReportCard = ({
  report,
  onDownload,
  onEmailSend,
}: {
  report: Report;
  onDownload: (r: Report) => void;
  onEmailSend: (id: string) => void;
}) => {
  const isReady = report.status === "ready";
  const isGenerating = report.status === "generating";
  const conf = REPORT_TYPES.find((t) => t.type === report.type);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-4"
    >
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${conf?.accentCls ?? "text-primary bg-primary/10"}`}>
          {isGenerating
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : conf ? <conf.icon className="h-4 w-4" /> : <FileText className="h-4 w-4" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-foreground">{report.title}</p>
              {report.period_label && (
                <p className="text-xs text-muted-foreground mt-0.5">{report.period_label}</p>
              )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {isGenerating && <Badge variant="secondary" className="text-[10px]">En cours…</Badge>}
              {isReady && <Badge variant="secondary" className="text-[10px] text-emerald-600 border-emerald-200 bg-emerald-50">Prêt</Badge>}
              {report.status === "error" && <Badge variant="destructive" className="text-[10px]">Erreur</Badge>}
            </div>
          </div>

          {report.summary && (
            <p className="text-xs text-muted-foreground leading-relaxed mt-2">{report.summary}</p>
          )}

          {isReady && (
            <div className="flex items-center gap-2 mt-3">
              <Button
                variant="outline" size="sm" className="h-7 text-xs gap-1.5"
                onClick={() => onDownload(report)}
              >
                <Download className="h-3 w-3" /> Télécharger PDF
              </Button>
              {!report.email_sent ? (
                <Button
                  variant="ghost" size="sm" className="h-7 text-xs gap-1.5"
                  onClick={() => onEmailSend(report.id)}
                >
                  <Mail className="h-3 w-3" /> Email
                </Button>
              ) : (
                <span className="text-xs text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Envoyé
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const GenerateCard = ({ type, generating, onGenerate }: {
  type: typeof REPORT_TYPES[number];
  generating: boolean;
  onGenerate: (t: ReportType) => void;
}) => (
  <div className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-3">
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${type.accentCls}`}>
      <type.icon className="h-5 w-5" />
    </div>
    <div>
      <p className="text-sm font-semibold text-foreground">{type.label}</p>
      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{type.description}</p>
    </div>
    <div className="flex items-center justify-between mt-auto pt-1">
      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
        <Calendar className="h-3 w-3" /> {type.frequency}
      </span>
      <Button
        size="sm" variant="outline" className="h-7 text-xs gap-1.5"
        onClick={() => onGenerate(type.type)}
        disabled={generating}
      >
        {generating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
        Générer
      </Button>
    </div>
  </div>
);

const ReportsTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { reports, loading, generating, generateReport, markEmailSent } = useReports(user?.id);
  const { generatingPdf, generatePdfBlob } = usePDFGeneration();
  const [typeFilter, setTypeFilter] = useState<ReportType | "all">("all");
  const [latestPdf, setLatestPdf] = useState<{ blobUrl: string; fileName: string } | null>(null);

  const [profile, setProfile] = useState<{ company_name: string; sector: string } | null>(null);
  const [companyData, setCompanyData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    const db = supabase as any;
    db.from("profiles").select("company_name, sector").eq("id", user.id).single()
      .then(({ data }: any) => { if (data) setProfile(data); });
    db.from("company_data").select("*").eq("user_id", user.id).maybeSingle()
      .then(({ data }: any) => { if (data) setCompanyData(data); });
  }, [user?.id]);

  const openLoadingPopup = () => {
    const popup = window.open("about:blank", "_blank", "noopener");
    if (popup) {
      popup.document.title = "Scalyo — génération du rapport";
      popup.document.body.style.margin = "0";
      popup.document.body.style.fontFamily = "system-ui, sans-serif";
      popup.document.body.style.display = "flex";
      popup.document.body.style.alignItems = "center";
      popup.document.body.style.justifyContent = "center";
      popup.document.body.style.height = "100vh";
      popup.document.body.style.background = "#F8FAFC";
      popup.document.body.innerHTML = "<div style='padding:24px;text-align:center;color:#0A1628;font-size:16px;font-weight:600;'>Génération du rapport en cours…</div>";
    }
    return popup;
  };

  const openBlobInTab = (blobUrl: string, fileName: string, popup: Window | null) => {
    if (popup && !popup.closed) {
      popup.location.href = blobUrl;
      return;
    }

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const buildPdfPayload = () => {
    const monthlyRevenue = typeof companyData?.current_month_revenue === "number"
      ? companyData.current_month_revenue
      : Number(companyData?.current_month_revenue ?? NaN);
    const clientsCount = typeof companyData?.active_clients === "number"
      ? companyData.active_clients
      : Number(companyData?.active_clients ?? NaN);

    return {
      companyName: profile?.company_name ?? "Démo Commerce SAS",
      sector: profile?.sector ?? "E-commerce",
      monthlyRevenue: Number.isFinite(monthlyRevenue) ? monthlyRevenue : 48500,
      clientsCount: Number.isFinite(clientsCount) ? clientsCount : 1247,
      industry: profile?.sector ?? "E-commerce",
      generatedAt: new Date().toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };
  };

  const handleDownload = async (report: Report) => {
    const popup = openLoadingPopup();

    try {
      const { blobUrl, fileName } = await generatePdfBlob(report.type, buildPdfPayload());
      openBlobInTab(blobUrl, fileName, popup);
      setLatestPdf({ blobUrl, fileName });
    } catch (error) {
      popup?.close();
      toast({ title: "Erreur lors de la génération du PDF", description: "Impossible de générer le rapport." });
    }
  };

  const handleGenerate = async (type: ReportType) => {
    const companyName = profile?.company_name ?? "Démo Commerce SAS";
    const popup = openLoadingPopup();

    try {
      const { blobUrl, fileName } = await generatePdfBlob(type, buildPdfPayload());
      openBlobInTab(blobUrl, fileName, popup);
      setLatestPdf({ blobUrl, fileName });

      await generateReport(type, companyName);
      analytics.track("report_generated", { report_type: type });

      toast({
        title: "Rapport PDF généré !",
        description: "Le rapport est ouvert dans un nouvel onglet et est prêt au téléchargement.",
      });
    } catch (error) {
      popup?.close();
      toast({ title: "Erreur lors de la génération du PDF", description: "Impossible de générer le rapport." });
    }
  };

  const handleEmailSend = async (id: string) => {
    await markEmailSent(id);
    analytics.track("report_emailed", { report_type: reports.find((r) => r.id === id)?.type ?? "unknown" });
    toast({ title: "Rapport envoyé par email !" });
  };

  const filtered = reports.filter((r) => typeFilter === "all" || r.type === typeFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Rapports PDF</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Rapports hebdomadaires, mensuels et diagnostics brandés — téléchargeables et envoyés par email.
        </p>
      </div>

      <div>
        <p className="text-sm font-medium text-foreground mb-3">Générer un rapport</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {REPORT_TYPES.map((t) => (
            <GenerateCard key={t.type} type={t} generating={generating || generatingPdf} onGenerate={handleGenerate} />
          ))}
        </div>

        {latestPdf && (
          <div className="mt-4 rounded-2xl border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Rapport prêt</p>
              <p className="text-xs text-muted-foreground">Le rapport s'est ouvert dans un nouvel onglet. Vous pouvez aussi le télécharger directement.</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="h-9 text-xs"
              onClick={() => {
                const link = document.createElement("a");
                link.href = latestPdf.blobUrl;
                link.download = latestPdf.fileName;
                document.body.appendChild(link);
                link.click();
                link.remove();
              }}
            >
              Télécharger le PDF
            </Button>
          </div>
        )}
      </div>

      {reports.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-foreground">Historique</p>
            <div className="flex gap-1.5">
              {(["all", "weekly", "monthly", "diagnostic"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setTypeFilter(f)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                    typeFilter === f
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f === "all" ? "Tous" : f === "weekly" ? "Hebdo" : f === "monthly" ? "Mensuel" : "Diag."}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filtered.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onDownload={handleDownload}
                  onEmailSend={handleEmailSend}
                />
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">
                Aucun rapport de ce type pour l'instant.
              </p>
            )}
          </div>
        </div>
      )}

      {reports.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <FileText className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Générez votre premier rapport en cliquant sur l'un des boutons ci-dessus.
          </p>
        </div>
      )}

      <div className="rounded-2xl bg-secondary/50 border border-border p-4">
        <p className="text-xs font-medium text-foreground mb-1">Envoi automatique par email</p>
        <p className="text-xs text-muted-foreground">
          Les rapports hebdomadaires sont envoyés automatiquement chaque lundi à 8h. Les rapports mensuels le 1er de chaque mois.
          Configurez l'adresse de destination dans vos <span className="text-primary font-medium">Paramètres</span>.
        </p>
      </div>
    </div>
  );
};

export default ReportsTab;
