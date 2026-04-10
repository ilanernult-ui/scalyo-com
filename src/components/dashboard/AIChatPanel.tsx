import { useState, useEffect, useMemo } from "react";
import { Send, Download, Clipboard, RotateCcw, Sparkles } from "lucide-react";
import { usePDFGeneration } from "@/components/pdf/usePDFGeneration";
import type { PlanType } from "@/contexts/AuthContext";
import type { ReportType } from "@/hooks/useReports";

const reportTypeLabels: Record<ReportType, string> = {
  weekly: "Rapport Hebdomadaire",
  monthly: "Rapport Mensuel",
  diagnostic: "Diagnostic Complet",
};

const reportTypeResponses: Record<ReportType, string> = {
  weekly: "Parfait ! KPIs de la semaine, actions IA appliquées et recommandations prioritaires. Sur quelle période ?",
  monthly: "Excellent choix ! Vue complète du mois : CA, churn, score business, top actions. Sur quelle période ?",
  diagnostic: "Je prépare une analyse 360° de votre business. Benchmarks sectoriels, pertes détectées, plan d'optimisation. Sur quelle période ?",
};

const periodOptions = ["Cette semaine", "Ce mois", "Ce trimestre", "Personnalisé"] as const;
const focusOptions = [
  "💰 Performance financière",
  "👥 Rétention clients",
  "📉 Réduction churn",
  "🚀 Croissance CA",
  "📦 Tout inclure",
] as const;

type FocusOption = (typeof focusOptions)[number];
type PeriodOption = (typeof periodOptions)[number] | string;

const planConfig: Record<PlanType, {
  accent: string;
  buttonAccent: string;
  welcome: string;
  focusList: FocusOption[];
  headerColor: string;
}> = {
  datadiag: {
    accent: "#00D4FF",
    buttonAccent: "#00D4FF",
    welcome: "En tant que client DataDiag, je peux générer votre diagnostic business 48h.",
    focusList: ["💰 Performance financière", "📦 Tout inclure"],
    headerColor: "#0A1628",
  },
  growthpilot: {
    accent: "#00FF88",
    buttonAccent: "#00FF88",
    welcome: "En tant que client GrowthPilot, je suis votre co-pilote pour atteindre +15% de croissance.",
    focusList: [...focusOptions],
    headerColor: "#0D1117",
  },
  loyaltyloop: {
    accent: "#FFD700",
    buttonAccent: "#FFD700",
    welcome: "En tant que client LoyaltyLoop, j'ai accès à l'analyse complète rétention et prédiction churn.",
    focusList: [...focusOptions],
    headerColor: "#0C0A1E",
  },
};

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatPanelProps {
  activeTab: string;
  userInitials: string;
  plan: PlanType;
}

const AIChatPanel = ({ activeTab, userInitials, plan }: AIChatPanelProps) => {
  const { generatePdf } = usePDFGeneration();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<ReportType | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption | null>(null);
  const [customPeriod, setCustomPeriod] = useState("");
  const [reportCard, setReportCard] = useState<null | {
    type: ReportType;
    period: string;
    focus: string;
    date: string;
    metrics: string[];
    planColor: string;
  }>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copyState, setCopyState] = useState("📋 Copier le résumé");

  const config = planConfig[plan] || planConfig.datadiag;

  const welcomeMessage = useMemo(() => {
    return `Bonjour 👋 Je suis votre expert en rapports business Scalyo.\nJe génère des rapports PDF professionnels et détaillés à partir de vos données réelles. ${config.welcome} Quel rapport voulez-vous générer ?`;
  }, [config.welcome]);

  useEffect(() => {
    setMessages([{ role: "assistant", content: welcomeMessage }]);
    setStep(1);
    setSelectedType(null);
    setSelectedPeriod(null);
    setCustomPeriod("");
    setReportCard(null);
  }, [welcomeMessage]);

  const appendMessage = (message: Message) => setMessages((prev) => [...prev, message]);

  const makeReportCard = (type: ReportType, period: string, focus: string) => {
    const now = new Date();
    const date = now.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    const time = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    const metrics = [
      `CA période : 48 500 € (+12%)`,
      `Clients actifs : 1 247`,
      `Score performance : 84/100`,
      `Heures économisées : 8.5h`,
      `Actions IA appliquées : 3`,
    ];
    return { type, period, focus, date: `${date} à ${time}`, metrics, planColor: config.headerColor };
  };

  const startNewReport = () => {
    setMessages([{ role: "assistant", content: welcomeMessage }]);
    setStep(1);
    setSelectedType(null);
    setSelectedPeriod(null);
    setCustomPeriod("");
    setReportCard(null);
    setCopyState("📋 Copier le résumé");
  };

  const handleTypeSelect = (type: ReportType) => {
    setSelectedType(type);
    setSelectedPeriod(null);
    setStep(2);
    appendMessage({ role: "user", content: reportTypeLabels[type] });
    appendMessage({ role: "assistant", content: reportTypeResponses[type] });
  };

  const handlePeriodSelect = (period: PeriodOption) => {
    if (period === "Personnalisé") {
      setSelectedPeriod(period);
      setCustomPeriod("");
      setStep(2);
      appendMessage({ role: "user", content: "Personnalisé" });
      appendMessage({ role: "assistant", content: "Indiquez la période souhaitée (ex: janvier 2026)." });
      return;
    }

    setSelectedPeriod(period);
    setStep(3);
    appendMessage({ role: "user", content: period });
    appendMessage({ role: "assistant", content: "Très bien. Quel focus souhaitez-vous ?" });
  };

  const handleCustomPeriodSubmit = () => {
    if (!customPeriod.trim()) return;
    const period = customPeriod.trim();
    setSelectedPeriod(period);
    setStep(3);
    appendMessage({ role: "user", content: period });
    appendMessage({ role: "assistant", content: "Parfait. Quel focus souhaitez-vous ?" });
  };

  const handleFocusSelect = (focus: FocusOption) => {
    if (!selectedType || !selectedPeriod) return;
    appendMessage({ role: "user", content: focus });
    setStep(4);
    appendMessage({ role: "assistant", content: "⏳ Analyse de vos données en cours... Génération du rapport PDF" });
    setIsGenerating(true);

    setTimeout(() => {
      const card = makeReportCard(selectedType, String(selectedPeriod === "Personnalisé" ? customPeriod : selectedPeriod), focus);
      setReportCard(card);
      setIsGenerating(false);
    }, 2000);
  };

  const handleFreeText = (text: string) => {
    const normalized = text.toLowerCase();
    appendMessage({ role: "user", content: text });

    if (/rapport mensuel|mensuel/.test(normalized)) {
      handleTypeSelect("monthly");
      return;
    }
    if (/diagnostic|analyse complète/.test(normalized)) {
      handleTypeSelect("diagnostic");
      return;
    }
    if (/churn|rétention/.test(normalized)) {
      setSelectedType("monthly");
      setStep(2);
      appendMessage({ role: "assistant", content: "Je recommande Rapport Mensuel avec focus Rétention clients. Sur quelle période ?" });
      return;
    }
    if (/croissance|ca|chiffre d'affaires/.test(normalized)) {
      setSelectedType("monthly");
      setStep(2);
      appendMessage({ role: "assistant", content: "Je recommande Rapport Mensuel avec focus Croissance CA. Sur quelle période ?" });
      return;
    }
    if (/génère|créer/.test(normalized)) {
      if (selectedType) {
        setStep(2);
        appendMessage({ role: "assistant", content: "Quel est la période souhaitée ?" });
      } else {
        appendMessage({ role: "assistant", content: "Quel type de rapport souhaitez-vous ? Hebdomadaire, Mensuel ou Diagnostic ?" });
      }
      return;
    }
    if (/semaine/.test(normalized) && selectedType) {
      handlePeriodSelect("Cette semaine");
      return;
    }
    if (/(tout|complet)/.test(normalized) && selectedType && selectedPeriod) {
      handleFocusSelect("📦 Tout inclure");
      return;
    }

    appendMessage({
      role: "assistant",
      content: "En tant qu'expert business, je vous recommande un rapport adapté. Précisez si vous souhaitez un rapport hebdomadaire, mensuel ou un diagnostic complet.",
    });
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;

    if (step === 1 || step === 2 || step === 3) {
      handleFreeText(input.trim());
      setInput("");
      return;
    }

    setInput("");
  };

  const handleDownload = async () => {
    if (!reportCard || !selectedType || !selectedPeriod) return;
    const fileName = `scalyo-${selectedType}-${String(selectedPeriod).replace(/\s+/g, "-").toLowerCase()}.pdf`;
    await generatePdf(selectedType, {
      companyName: "Démo Commerce SAS",
      sector: plan,
      generatedAt: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
    }, fileName);
  };

  const handleCopySummary = async () => {
    if (!reportCard) return;
    const text = reportCard.metrics.join("\n");
    await navigator.clipboard.writeText(text);
    setCopyState("✅ Copié !");
    setTimeout(() => setCopyState("📋 Copier le résumé"), 2000);
  };

  return (
    <div className="w-full xl:w-[420px] bg-card border border-border rounded-2xl flex flex-col overflow-hidden h-fit max-h-[calc(100vh-100px)]">
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-[18px] bg-gradient-to-br from-black to-slate-900 flex items-center justify-center text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Assistant Scalyo IA</p>
            <p className="text-xs text-muted-foreground mt-1">Expert en rapports business et PDF.</p>
          </div>
          <div className="flex flex-col items-end gap-1 text-right">
            <span className="text-xs text-muted-foreground">{activeTab || "Dashboard"}</span>
            <span className="rounded-full bg-slate-950 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-white">{userInitials || "NF"}</span>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`rounded-2xl p-4 ${message.role === "assistant" ? "bg-white border border-border text-foreground" : "bg-primary text-primary-foreground"}`}>
            <p className="text-sm leading-6 whitespace-pre-wrap">{message.content}</p>
          </div>
        ))}

        {step === 1 && (
          <div className="flex flex-wrap gap-2">
            {(Object.keys(reportTypeLabels) as ReportType[]).map((type) => (
              <button
                key={type}
                onClick={() => handleTypeSelect(type)}
                className="rounded-full border px-4 py-2 text-sm font-medium bg-white text-slate-900 transition hover:bg-opacity-90"
                style={{ borderColor: config.buttonAccent }}
              >
                {reportTypeLabels[type]}
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-wrap gap-2">
            {periodOptions.map((option) => (
              <button
                key={option}
                onClick={() => handlePeriodSelect(option)}
                className="rounded-full border px-4 py-2 text-sm font-medium bg-white text-slate-900 transition hover:bg-opacity-90"
                style={{ borderColor: config.buttonAccent }}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {step === 2 && selectedPeriod === "Personnalisé" && (
          <div className="flex flex-col gap-2">
            <input
              className="w-full rounded-2xl border border-border px-4 py-2 text-sm bg-background text-foreground"
              placeholder="Indiquez la période souhaitée (ex: janvier 2026)"
              value={customPeriod}
              onChange={(e) => setCustomPeriod(e.target.value)}
            />
            <button
              onClick={handleCustomPeriodSubmit}
              className="rounded-full bg-slate-900 text-white px-4 py-2 text-sm font-medium"
              style={{ backgroundColor: config.buttonAccent }}
            >
              Confirmer la période
            </button>
          </div>
        )}

        {step === 3 && selectedType && selectedPeriod && (
          <div className="flex flex-wrap gap-2">
            {config.focusList.map((option) => (
              <button
                key={option}
                onClick={() => handleFocusSelect(option)}
                className="rounded-full border px-4 py-2 text-sm font-medium bg-white text-slate-900 transition hover:bg-opacity-90"
                style={{ borderColor: config.buttonAccent }}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {isGenerating && (
          <div className="rounded-2xl border border-border bg-white p-4 text-sm text-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
              <span>Analyse de vos données en cours... Génération du rapport PDF</span>
            </div>
          </div>
        )}

        {reportCard && (
          <div className="rounded-3xl border border-border bg-white shadow-sm p-5 space-y-4">
            <div className="rounded-2xl px-4 py-3" style={{ backgroundColor: reportCard.planColor, color: "#FFFFFF" }}>
              <p className="text-sm font-semibold">📄 {reportTypeLabels[reportCard.type]} — {reportCard.period}</p>
              <p className="text-xs opacity-80 mt-1">Généré le {reportCard.date}</p>
            </div>
            <div className="space-y-3">
              <div className="rounded-2xl bg-slate-100 p-3 text-sm text-slate-700">
                <p className="font-medium">Focus choisi :</p>
                <p>{reportCard.focus}</p>
              </div>
              <div className="border-t border-border pt-4 space-y-2">
                {reportCard.metrics.map((metric, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="mt-[2px] text-slate-500">•</span>
                    <p className="text-sm leading-6 text-slate-900">{metric}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium bg-white text-slate-900"
                style={{ borderColor: config.buttonAccent }}
              >
                <Download className="h-4 w-4" /> ⬇️ Télécharger le PDF
              </button>
              <button
                onClick={handleCopySummary}
                className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium bg-white text-slate-900"
                style={{ borderColor: config.buttonAccent }}
              >
                <Clipboard className="h-4 w-4" /> {copyState}
              </button>
              <button
                onClick={startNewReport}
                className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium bg-white text-slate-900"
                style={{ borderColor: config.buttonAccent }}
              >
                <RotateCcw className="h-4 w-4" /> 🔄 Nouveau rapport
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 mt-4">
          <input
            className="flex-1 rounded-2xl border border-border px-4 py-2 text-sm bg-background text-foreground outline-none"
            placeholder="Tapez votre demande..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSubmit();
              }
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-slate-900 px-4 text-white transition hover:bg-slate-800 disabled:opacity-50"
            style={{ backgroundColor: config.buttonAccent }}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatPanel;
