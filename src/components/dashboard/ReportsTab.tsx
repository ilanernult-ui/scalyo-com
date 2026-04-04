import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Download, Mail, CheckCircle2, Loader2,
  Calendar, BarChart3, Activity, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useReports, type Report, type ReportType } from "@/hooks/useReports";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { analytics } from "@/lib/analytics";

// ─── Report type config ───────────────────────────────────────────
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

// ─── Report Card ──────────────────────────────────────────────────
const ReportCard = ({ report, onEmailSend }: { report: Report; onEmailSend: (id: string) => void }) => {
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

          {/* Summary */}
          {report.summary && (
            <p className="text-xs text-muted-foreground leading-relaxed mt-2">{report.summary}</p>
          )}

          {/* Actions */}
          {isReady && (
            <div className="flex items-center gap-2 mt-3">
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
                <Download className="h-3 w-3" /> Télécharger PDF
              </Button>
              {!report.email_sent ? (
                <Button
                  variant="ghost" size="sm" className="h-7 text-xs gap-1.5"
                  onClick={() => onEmailSend(report.id)}
                >
                  <Mail className="h-3 w-3" /> Envoyer par email
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

// ─── Generate Card ────────────────────────────────────────────────
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

// ─── Main Component ───────────────────────────────────────────────
const ReportsTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { reports, loading, generating, generateReport, markEmailSent } = useReports(user?.id);
  const [typeFilter, setTypeFilter] = useState<ReportType | "all">("all");

  const companyName = "Votre entreprise"; // could be pulled from companyData

  const handleGenerate = async (type: ReportType) => {
    await generateReport(type, companyName);
    analytics.track("report_generated", { report_type: type });
    toast({
      title: "Rapport généré !",
      description: "Votre rapport PDF est prêt à être téléchargé.",
    });
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
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Rapports PDF</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Rapports hebdomadaires, mensuels et diagnostics brandés — téléchargeables et envoyés par email.
        </p>
      </div>

      {/* Generate section */}
      <div>
        <p className="text-sm font-medium text-foreground mb-3">Générer un rapport</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {REPORT_TYPES.map((t) => (
            <GenerateCard key={t.type} type={t} generating={generating} onGenerate={handleGenerate} />
          ))}
        </div>
      </div>

      {/* History */}
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
                <ReportCard key={report.id} report={report} onEmailSend={handleEmailSend} />
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

      {/* Auto-send info */}
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
