import { useEffect, useMemo, useRef, useState } from "react";
import { Send, Download, Clipboard, RotateCcw, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { saveAs } from "file-saver";
import { useToast } from "@/hooks/use-toast";
import { useOpenAI, type OpenAIMessage } from "@/hooks/useOpenAI";
import { usePDFGeneration } from "@/components/pdf/usePDFGeneration";
import type { PlanType } from "@/contexts/AuthContext";
import type { ReportType } from "@/hooks/useReports";

const reportTypeLabels: Record<ReportType, string> = {
  weekly: "Rapport Hebdomadaire",
  monthly: "Rapport Mensuel",
  diagnostic: "Diagnostic Complet",
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
  id: string;
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
}

interface StoredChat {
  messages: Message[];
  lastUpdated: number;
}

const STORAGE_PREFIX = "scalyo-chat-";

const createMessageId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const getStorageKey = (tab: string) => `${STORAGE_PREFIX}${tab}`;

interface AIChatPanelProps {
  activeTab: string;
  userInitials: string;
  plan: PlanType;
}

const AIChatPanel = ({ activeTab, userInitials, plan }: AIChatPanelProps) => {
  const { generatePdf } = usePDFGeneration();
  const { toast } = useToast();
  const { isLoading, sendChat } = useOpenAI();

  const [messages, setMessages] = useState<Message[]>([
    { id: createMessageId(), role: "assistant", content: "" },
  ]);
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
  const [copyState, setCopyState] = useState("📋 Copier le résumé");
  const [copiedIds, setCopiedIds] = useState<Record<string, boolean>>({});
  const [isReady, setIsReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const latestMessagesRef = useRef<Message[]>(messages);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const config = planConfig[plan] || planConfig.datadiag;

  const welcomeMessage = useMemo(() => {
    return `Bonjour 👋 Je suis votre expert en rapports business Scalyo.\nJe génère des rapports PDF professionnels et détaillés à partir de vos données réelles. ${config.welcome} Quel rapport voulez-vous générer ?`;
  }, [config.welcome]);

  useEffect(() => {
    latestMessagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = getStorageKey(activeTab || "reports");
    const raw = window.localStorage.getItem(key);

    if (!raw) {
      setMessages([{ id: createMessageId(), role: "assistant", content: welcomeMessage }]);
      setStep(1);
      setSelectedType(null);
      setSelectedPeriod(null);
      setCustomPeriod("");
      setReportCard(null);
      setCopyState("📋 Copier le résumé");
      setIsReady(true);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as StoredChat;
      const expired = !parsed.lastUpdated || Date.now() - parsed.lastUpdated > 24 * 60 * 60 * 1000;
      if (expired || !Array.isArray(parsed.messages) || parsed.messages.length === 0) {
        window.localStorage.removeItem(key);
        setMessages([{ id: createMessageId(), role: "assistant", content: welcomeMessage }]);
      } else {
        setMessages(
          parsed.messages.map((message) => ({
            ...message,
            id: message.id ?? createMessageId(),
            isLoading: false,
          })),
        );
      }
    } catch {
      setMessages([{ id: createMessageId(), role: "assistant", content: welcomeMessage }]);
    }

    setIsReady(true);
  }, [activeTab, welcomeMessage]);

  useEffect(() => {
    if (!isReady || typeof window === "undefined") return;
    window.localStorage.setItem(getStorageKey(activeTab || "reports"), JSON.stringify({ messages, lastUpdated: Date.now() }));
  }, [messages, activeTab, isReady]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const replaceLoadingMessage = (id: string, content: string) => {
    setMessages((prev) =>
      prev.map((message) => (message.id === id ? { ...message, content, isLoading: false } : message)),
    );
  };

  const getStorageKeyForTab = () => getStorageKey(activeTab || "reports");

  const resetConversation = () => {
    setMessages([{ id: createMessageId(), role: "assistant", content: welcomeMessage }]);
    setStep(1);
    setSelectedType(null);
    setSelectedPeriod(null);
    setCustomPeriod("");
    setReportCard(null);
    setCopyState("📋 Copier le résumé");
    setCopiedIds({});
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(getStorageKeyForTab());
    }
  };

  const shouldShowDownload = (content: string) => /\|/.test(content) || /\b(tableau|rapport|données)\b/i.test(content);

  const handleCopyMessage = async (messageId: string, messageContent: string) => {
    try {
      await navigator.clipboard.writeText(messageContent);
      setCopiedIds((prev) => ({ ...prev, [messageId]: true }));
      setTimeout(() => setCopiedIds((prev) => ({ ...prev, [messageId]: false })), 2000);
    } catch {
      toast({ title: "Copie impossible", description: "Impossible de copier le message." });
    }
  };

  const appendMessage = (message: Message) => setMessages((prev) => [...prev, message]);

  const handleDownloadMessage = (content: string) => {
    const extension = content.includes("|") ? "csv" : "txt";
    const fileName = `scalyo-export-${new Date().toISOString().slice(0, 10)}.${extension}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, fileName);
  };

  const sendAiMessage = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return null;

    const userMessage: Message = { id: createMessageId(), role: "user", content: trimmed };
    const loadingMessage: Message = { id: createMessageId(), role: "assistant", content: "...", isLoading: true };
    setMessages((prev) => [...prev, userMessage, loadingMessage]);

    const nextMessages: OpenAIMessage[] = [
      ...latestMessagesRef.current.map(({ id, isLoading, ...rest }) => rest),
      { role: "user", content: trimmed },
    ];

    try {
      const assistantReply = await sendChat(nextMessages, activeTab || "reports", plan);
      replaceLoadingMessage(loadingMessage.id, assistantReply);
      return assistantReply;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erreur IA inconnue";
      toast({ title: "Erreur IA", description: message, variant: "destructive" });
      replaceLoadingMessage(loadingMessage.id, "Désolé, je n'ai pas pu obtenir de réponse de l'IA. Réessayez plus tard.");
      return null;
    }
  };

  const makeReportCard = (type: ReportType, period: string, focus: string) => {
    const now = new Date();
    const date = now.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    const time = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    const metrics = [
      `CA : 48 500€ (+12% vs mois dernier)`,
      `Score performance : 84/100`,
      `Clients actifs : 1 247`,
      `Churn : 4.2% (objectif <3%)`,
      `3 recommandations IA générées`,
    ];
    return { type, period, focus, date: `${date} à ${time}`, metrics, planColor: config.headerColor };
  };

  const startNewReport = () => {
    resetConversation();
  };

  const handleTypeSelect = (type: ReportType) => {
    setSelectedType(type);
    setSelectedPeriod(null);
    setStep(2);
    appendMessage({ id: createMessageId(), role: "user", content: reportTypeLabels[type] });
    appendMessage({ id: createMessageId(), role: "assistant", content: "Parfait ! Sur quelle période ?" });
  };

  const handlePeriodSelect = (period: PeriodOption) => {
    setSelectedPeriod(period);
    setStep(period === "Personnalisé" ? 2 : 3);
    appendMessage({ id: createMessageId(), role: "user", content: String(period) });
    appendMessage({ id: createMessageId(), role: "assistant", content: "Quel sera le focus de ce rapport ?" });
  };

  const handleCustomPeriodSubmit = () => {
    if (!customPeriod.trim()) return;
    const period = customPeriod.trim();
    setSelectedPeriod(period);
    setStep(3);
    appendMessage({ id: createMessageId(), role: "user", content: period });
    appendMessage({ id: createMessageId(), role: "assistant", content: "Quel sera le focus de ce rapport ?" });
  };

  const handleFocusSelect = async (focus: FocusOption) => {
    if (!selectedType || !selectedPeriod) return;
    const period = selectedPeriod === "Personnalisé" ? customPeriod : selectedPeriod;
    if (!period?.trim()) return;

    setReportCard(null);
    setStep(4);

    appendMessage({ id: createMessageId(), role: "user", content: focus });
    const loadingMessage: Message = {
      id: createMessageId(),
      role: "assistant",
      content: "⏳ Génération de votre rapport PDF en cours...",
      isLoading: true,
    };
    appendMessage(loadingMessage);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const fileName = `scalyo-${selectedType}-${String(period).replace(/\s+/g, "-").toLowerCase()}.pdf`;
      await generatePdf(selectedType, {
        companyName: "Démo Commerce SAS",
        period: String(period),
        focus,
        ca: 48500,
        growth: 12,
        churn: 4.2,
        nps: 62,
        clients: 1247,
        score: 84,
        heures: 8.5,
        date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
      }, fileName);

      replaceLoadingMessage(loadingMessage.id, "✅ Rapport prêt — vous pouvez le télécharger ou copier le résumé.");
      setReportCard(makeReportCard(selectedType, String(period), focus));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erreur de génération PDF";
      replaceLoadingMessage(loadingMessage.id, `❌ Échec de la génération : ${message}`);
      toast({ title: "Erreur PDF", description: message, variant: "destructive" });
    }
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const text = input.trim();
    setInput("");

    if (/^(reset|effacer|nouvelle conversation)$/i.test(text)) {
      resetConversation();
      return;
    }

    await sendAiMessage(text);
  };

  const handleDownload = async () => {
    if (!reportCard || !selectedType || !selectedPeriod) return;
    const period = selectedPeriod === "Personnalisé" ? customPeriod : selectedPeriod;
    if (!period?.trim()) return;
    const fileName = `scalyo-${selectedType}-${String(period).replace(/\s+/g, "-").toLowerCase()}.pdf`;

    await generatePdf(
      selectedType,
      {
        companyName: "Démo Commerce SAS",
        period: String(period),
        focus: reportCard.focus,
        ca: 48500,
        growth: 12,
        churn: 4.2,
        nps: 62,
        clients: 1247,
        score: 84,
        heures: 8.5,
        date: reportCard.date,
      },
      fileName,
    );
  };

  const handleCopySummary = async () => {
    if (!reportCard) return;
    const text = reportCard.metrics.join("\n");
    await navigator.clipboard.writeText(text);
    setCopyState("✅ Copié !");
    setTimeout(() => setCopyState("📋 Copier le résumé"), 2000);
  };

  return (
    <div
      className={`w-full xl:w-[420px] flex flex-col overflow-hidden ${
        isFullscreen
          ? "fixed inset-0 z-50 h-full w-full max-h-none rounded-none bg-white shadow-2xl"
          : "bg-card border border-border rounded-2xl h-fit max-h-[calc(100vh-100px)]"
      }`}
    >
      <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-[18px] bg-gradient-to-br from-black to-slate-900 flex items-center justify-center text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Assistant Scalyo IA</p>
            <p className="text-xs text-muted-foreground mt-1">Expert en rapports business et PDF.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isFullscreen ? (
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="rounded-full border border-border bg-white px-2 py-1 text-xs text-foreground"
            >
              ⤢
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="rounded-full border border-border bg-white px-2 py-1 text-xs text-foreground"
            >
              ✕
            </button>
          )}
          <button
            type="button"
            onClick={resetConversation}
            className="rounded-full border border-border bg-slate-100 px-3 py-1 text-xs text-slate-700"
          >
            🗑️ Nouvelle conversation
          </button>
        </div>
      </div>

      <div className="px-5 py-4 flex flex-col flex-1 min-h-0 overflow-hidden gap-4">
        <div className="space-y-4 overflow-y-auto flex-1 min-h-0">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-4 text-sm leading-6 whitespace-pre-wrap ${
                  message.role === "assistant"
                    ? "bg-slate-100 text-slate-900 rounded-[18px_18px_18px_4px]"
                    : "text-white rounded-[18px_18px_4px_18px]"
                }`}
                style={message.role === "user" ? { backgroundColor: config.buttonAccent } : undefined}
              >
                {message.isLoading ? (
                  <div className="flex items-center gap-2">
                    {[0, 1, 2].map((delay) => (
                      <span
                        key={delay}
                        className="h-2.5 w-2.5 rounded-full bg-slate-500 animate-pulse"
                        style={{ animationDelay: `${delay * 150}ms` }}
                      />
                    ))}
                  </div>
                ) : (
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                      h2: ({ node, ...props }) => <p className="text-[15px] font-semibold mb-2" {...props} />,
                      strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-1 mb-2" {...props} />,
                      li: ({ node, ...props }) => <li className="ml-4 list-disc" {...props} />,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                )}

                {!message.isLoading && message.role === "assistant" && (
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => void handleCopyMessage(message.id, message.content)}
                      className="rounded-full border border-border bg-white px-3 py-1 text-slate-700 transition hover:bg-slate-50"
                    >
                      {copiedIds[message.id] ? "✅ Copié !" : "📋 Copier"}
                    </button>
                    {shouldShowDownload(message.content) && (
                      <button
                        type="button"
                        onClick={() => handleDownloadMessage(message.content)}
                        className="rounded-full border border-border bg-white px-3 py-1 text-slate-700 transition hover:bg-slate-50"
                      >
                        ⬇️ Télécharger
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {step === 1 && (
          <div className="flex flex-wrap gap-2">
            {(Object.keys(reportTypeLabels) as ReportType[]).map((type) => (
              <button
                key={type}
                onClick={() => void handleTypeSelect(type)}
                disabled={isLoading}
                className="rounded-full border px-4 py-2 text-sm font-medium bg-white text-slate-900 transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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
                onClick={() => void handlePeriodSelect(option)}
                disabled={isLoading}
                className="rounded-full border px-4 py-2 text-sm font-medium bg-white text-slate-900 transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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
              onClick={() => void handleCustomPeriodSubmit()}
              disabled={isLoading}
              className="rounded-full bg-slate-900 text-white px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
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
                onClick={() => void handleFocusSelect(option)}
                disabled={isLoading}
                className="rounded-full border px-4 py-2 text-sm font-medium bg-white text-slate-900 transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ borderColor: config.buttonAccent }}
              >
                {option}
              </button>
            ))}
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
