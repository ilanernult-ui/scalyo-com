import { useEffect, useMemo, useRef, useState } from "react";
import { Send, History, FileDown, Sparkles, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";
import { useOpenAI, type OpenAIMessage } from "@/hooks/useOpenAI";
import type { PlanType } from "@/contexts/AuthContext";

type AssistantContext = "dashboard" | "datadiag" | "growthpilot" | "loyaltyloop";

export interface QuickButton {
  label: string;
  action: string;
}

interface AssistantChatProps {
  context: AssistantContext;
  accentColor: string;
  name: string;
  subtitle: string;
  welcomeMessage: string;
  quickButtons: QuickButton[];
  userInitials?: string;
  plan: PlanType;
  contextSuggestions?: string[];
  enableGrowthPlanExport?: boolean;
}

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  isLoading?: boolean;
}

interface StoredChat {
  messages: Message[];
  lastUpdated: number;
}

interface ConversationSnapshot {
  id: string;
  title: string;
  savedAt: number;
  messages: Message[];
}

const STORAGE_PREFIX = "scalyo-chat-";
const HISTORY_PREFIX = "scalyo-chat-history-";

const createMessageId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const getStorageKey = (context: AssistantContext) => `${STORAGE_PREFIX}${context}`;
const getHistoryKey = (context: AssistantContext) => `${HISTORY_PREFIX}${context}`;

const AssistantChat = ({
  context,
  accentColor,
  name,
  subtitle,
  welcomeMessage,
  quickButtons,
  userInitials = "IA",
  plan,
  contextSuggestions,
  enableGrowthPlanExport,
}: AssistantChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: createMessageId(), role: "assistant", content: welcomeMessage },
  ]);
  const [input, setInput] = useState("");
  const [showQuickButtons, setShowQuickButtons] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedIds, setCopiedIds] = useState<Record<string, boolean>>({});
  const [history, setHistory] = useState<ConversationSnapshot[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const latestMessagesRef = useRef<Message[]>(messages);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();
  const { isLoading, sendChat } = useOpenAI();

  useEffect(() => {
    latestMessagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = getStorageKey(context);
    const raw = window.localStorage.getItem(key);

    if (!raw) {
      setMessages([{ id: createMessageId(), role: "assistant", content: welcomeMessage }]);
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
  }, [context, welcomeMessage]);

  useEffect(() => {
    if (!isReady || typeof window === "undefined") return;
    window.localStorage.setItem(getStorageKey(context), JSON.stringify({ messages, lastUpdated: Date.now() }));
  }, [messages, context, isReady]);

  // Load conversation history snapshots
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(getHistoryKey(context));
      if (raw) setHistory(JSON.parse(raw) as ConversationSnapshot[]);
      else setHistory([]);
    } catch {
      setHistory([]);
    }
  }, [context]);

  const persistHistory = (next: ConversationSnapshot[]) => {
    setHistory(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(getHistoryKey(context), JSON.stringify(next));
    }
  };

  const archiveCurrentConversation = () => {
    const current = latestMessagesRef.current;
    // only archive if user actually interacted (more than welcome message)
    if (!current || current.length <= 1) return;
    const firstUser = current.find((m) => m.role === "user");
    const title = firstUser
      ? firstUser.content.slice(0, 60) + (firstUser.content.length > 60 ? "…" : "")
      : `Conversation ${new Date().toLocaleString("fr-FR")}`;
    const snapshot: ConversationSnapshot = {
      id: createMessageId(),
      title,
      savedAt: Date.now(),
      messages: current.map(({ isLoading: _l, ...rest }) => rest),
    };
    const next = [snapshot, ...history].slice(0, 20);
    persistHistory(next);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getFallbackResponse = (context: AssistantContext) => {
    switch (context) {
      case "dashboard":
        return "Je suis en train d'analyser vos données. Voici ce que je vois : votre CA de 72 000€ est solide. Souhaitez-vous un focus sur un indicateur spécifique ?";
      case "datadiag":
        return "D'après vos données, j'identifie 3 axes d'amélioration prioritaires. Voulez-vous que je détaille les pertes détectées ?";
      case "growthpilot":
        return "Vos métriques de croissance montrent une progression de +12%. Voici mes recommandations pour atteindre +15%...";
      case "loyaltyloop":
        return "Je détecte 3 clients à risque de churn ce mois. Voulez-vous voir les détails et les actions recommandées ?";
      default:
        return "Je n'ai pas pu accéder à l'IA pour le moment. Voulez-vous réessayer ?";
    }
  };

  const resetConversation = () => {
    archiveCurrentConversation();
    const nextMessages: Message[] = [{ id: createMessageId(), role: "assistant", content: welcomeMessage }];
    setMessages(nextMessages);
    setCopiedIds({});
    setShowQuickButtons(true);

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(getStorageKey(context));
    }
  };

  const restoreConversation = (snapshot: ConversationSnapshot) => {
    archiveCurrentConversation();
    setMessages(snapshot.messages.map((m) => ({ ...m, id: m.id ?? createMessageId(), isLoading: false })));
    setShowQuickButtons(false);
    setShowHistory(false);
    toast({ title: "Conversation restaurée" });
  };

  const deleteSnapshot = (id: string) => {
    persistHistory(history.filter((s) => s.id !== id));
  };

  const replaceLoadingMessage = (id: string, content: string) => {
    setMessages((prev) =>
      prev.map((message) => (message.id === id ? { ...message, content, isLoading: false } : message)),
    );
  };

  const PLAN_STORAGE_KEY = "scalyo-action-plan";

  type ActionPlanCategory = "DataDiag" | "GrowthPilot" | "LoyaltyLoop";

  const getPlanName = (context: AssistantContext): ActionPlanCategory => {
    switch (context) {
      case "datadiag":
        return "DataDiag";
      case "growthpilot":
        return "GrowthPilot";
      case "loyaltyloop":
        return "LoyaltyLoop";
      default:
        return "DataDiag";
    }
  };

  const extractTitleFromAssistant = (content: string) => {
    const lines = content.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.length === 0) return content.slice(0, 80);
    const firstLine = lines[0];
    return firstLine.length > 90 ? `${firstLine.slice(0, 90)}…` : firstLine;
  };

  const extractDescriptionFromAssistant = (content: string) => {
    const lines = content.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.length <= 1) return content;
    return lines.slice(1).join(" ").slice(0, 220);
  };

  const formatImpactLabel = (content: string) => {
    const match = content.match(/([+\-]?[0-9]+(?:[\.,][0-9]+)?\s*(?:€|h|%))/i);
    return match ? match[1] : "Impact estimé";
  };

  const detectImpactType = (content: string) => {
    if (/\b(h|heure|heures)\b/i.test(content)) return "time" as const;
    if (/€/i.test(content)) return "revenue" as const;
    return "other" as const;
  };

  const extractFinancialValue = (content: string) => {
    const match = content.match(/([0-9]+(?:[\.,][0-9]+)?)\s*€/);
    if (!match) return 0;
    return Number(match[1].replace(",", "."));
  };

  const extractHoursValue = (content: string) => {
    const match = content.match(/([0-9]+(?:[\.,][0-9]+)?)\s*h/i);
    if (!match) return 0;
    return Number(match[1].replace(",", "."));
  };

  const extractGrowthValue = (content: string) => {
    const match = content.match(/([+\-]?[0-9]+(?:[\.,][0-9]+)?)\s*%/);
    if (!match) return 0;
    return Number(match[1].replace(",", "."));
  };

  const shouldShowDownload = (content: string) => /\|/.test(content) || /\b(tableau|rapport|données)\b/i.test(content);

  const shouldShowAddToPlan = (content: string) => /\b(recommand|action|priorit|€)\b/i.test(content);

  const handleCopyMessage = async (messageId: string, messageContent: string) => {
    try {
      await navigator.clipboard.writeText(messageContent);
      setCopiedIds((prev) => ({ ...prev, [messageId]: true }));
      setTimeout(() => setCopiedIds((prev) => ({ ...prev, [messageId]: false })), 2000);
    } catch {
      toast({ title: "Copie impossible", description: "Impossible de copier le message." });
    }
  };

  const handleDownloadMessage = (content: string) => {
    const extension = content.includes("|") ? "csv" : "txt";
    const fileName = `scalyo-export-${new Date().toISOString().slice(0, 10)}.${extension}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, fileName);
  };

  const handleAddToPlan = (messageContent: string) => {
    if (typeof window === "undefined") return;

    const plan = getPlanName(context);
    const title = extractTitleFromAssistant(messageContent);
    const description = extractDescriptionFromAssistant(messageContent);
    const impact_label = formatImpactLabel(messageContent);
    const impact_type = detectImpactType(messageContent);

    const newAction = {
      id: createMessageId(),
      title,
      description,
      priority: "P1" as const,
      plan,
      status: "pending" as const,
      impact_label,
      impact_type,
      due: "Cette semaine",
      created_at: new Date().toISOString(),
      completed_at: null,
      financial_value: extractFinancialValue(messageContent),
      hours_value: extractHoursValue(messageContent),
      growth_value: extractGrowthValue(messageContent),
    };

    const raw = window.localStorage.getItem(PLAN_STORAGE_KEY);
    const existing = raw ? (JSON.parse(raw) as Array<Record<string, unknown>>) : [];
    window.localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify([...existing, newAction]));
    window.dispatchEvent(new Event("scalyo-action-plan-updated"));

    toast({ title: "✅ Ajouté à votre plan d'action" });
  };

  const sendMessage = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    const resetCommand = /^(reset|effacer|nouvelle conversation)$/i.test(trimmed);
    if (resetCommand) {
      resetConversation();
      return;
    }

    const userMessage: Message = { id: createMessageId(), role: "user", content: trimmed };
    const loadingMessage: Message = { id: createMessageId(), role: "assistant", content: "...", isLoading: true };
    setMessages((prev) => [...prev, userMessage, loadingMessage]);

    const nextMessages: OpenAIMessage[] = [
      ...latestMessagesRef.current.map(({ id, isLoading, ...rest }) => rest),
      { role: "user", content: trimmed },
    ];

    try {
      const assistantResponse = await sendChat(nextMessages, context, plan);
      replaceLoadingMessage(loadingMessage.id, assistantResponse);
    } catch (error: unknown) {
      const fallbackResponse = getFallbackResponse(context);
      replaceLoadingMessage(loadingMessage.id, fallbackResponse);
      if (error instanceof Error) {
        toast({ title: "Assistant indisponible", description: fallbackResponse, variant: "destructive" });
      }
    }
  };

  const handleQuickAction = async (action: string) => {
    if (isLoading) return;
    setShowQuickButtons(false);
    await sendMessage(action);
  };

  const handleSuggestion = async (question: string) => {
    if (isLoading) return;
    setShowQuickButtons(false);
    await sendMessage(question);
  };

  const generateGrowthPlanPDF = async () => {
    if (generatingPlan || isLoading) return;
    setGeneratingPlan(true);
    toast({ title: "📄 Génération du plan de croissance…", description: "L'IA prépare votre document complet." });

    const prompt = `Génère un PLAN DE CROISSANCE COMPLET et structuré pour mon entreprise.

Structure obligatoire (utilise ces titres exacts en Markdown) :

## 1. Synthèse exécutive
3-4 lignes sur la situation actuelle et l'objectif +15% de croissance.

## 2. Diagnostic des canaux d'acquisition
Pour chaque canal majeur (SEO, Google Ads, LinkedIn Ads, Email, Bouche-à-oreille), indique : performance actuelle, problème détecté, action recommandée, gain attendu en €.

## 3. Recommandations prioritaires (Top 5)
Liste numérotée. Pour chaque recommandation : titre, description (2 lignes), impact en € et %, priorité (Urgent/Important/Optionnel), délai estimé.

## 4. Quick Wins à exécuter cette semaine
3 actions rapides à fort ROI avec gain en € et temps nécessaire.

## 5. Automatisations recommandées
3 workflows à mettre en place : nom, gain €/mois, heures économisées/semaine, complexité.

## 6. Projections de revenu
MRR actuel, projection 3 mois (optimiste/réaliste/pessimiste), projection 6 mois, jalons.

## 7. Plan d'exécution sur 90 jours
Mois 1, Mois 2, Mois 3 — actions clés et KPIs à suivre.

## 8. KPIs de pilotage
5 indicateurs à suivre chaque semaine avec valeur cible.

Sois concret, chiffré, et oriente toutes les recommandations vers l'objectif +15% de croissance. Réponds intégralement en Markdown.`;

    try {
      const fullPlan = await sendChat(
        [{ role: "user", content: prompt }],
        context,
        plan,
      );
      buildPDF(fullPlan);
      toast({ title: "✅ Plan de croissance prêt", description: "Le PDF a été téléchargé." });
    } catch (err) {
      console.error("[GrowthPlan PDF] error:", err);
      toast({ title: "Échec de la génération", description: "Réessayez dans un instant.", variant: "destructive" });
    } finally {
      setGeneratingPlan(false);
    }
  };

  const buildPDF = (markdown: string) => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginX = 15;
    const maxWidth = pageWidth - marginX * 2;
    let y = 20;

    // Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 14, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Scalyo · Plan de croissance GrowthPilot", marginX, 9);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }), pageWidth - marginX, 9, { align: "right" });

    y = 24;
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Plan de croissance complet", marginX, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("Recommandations IA générées par votre Co-pilote GrowthPilot", marginX, y);
    y += 8;

    doc.setTextColor(15, 23, 42);
    const lines = markdown.split("\n");

    const ensureSpace = (needed: number) => {
      if (y + needed > pageHeight - 15) {
        doc.addPage();
        y = 20;
      }
    };

    for (const rawLine of lines) {
      const line = rawLine.replace(/\*\*/g, "").replace(/`/g, "");
      if (!line.trim()) {
        y += 3;
        continue;
      }

      if (line.startsWith("## ")) {
        ensureSpace(12);
        y += 2;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(16, 185, 129);
        doc.text(line.replace(/^##\s+/, ""), marginX, y);
        y += 6;
        doc.setDrawColor(220, 220, 220);
        doc.line(marginX, y - 2, pageWidth - marginX, y - 2);
        doc.setTextColor(15, 23, 42);
        continue;
      }
      if (line.startsWith("### ")) {
        ensureSpace(10);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text(line.replace(/^###\s+/, ""), marginX, y);
        y += 5;
        continue;
      }

      const isList = /^(\s*[-*•]\s+|\s*\d+\.\s+)/.test(line);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const text = isList ? `• ${line.replace(/^(\s*[-*•]\s+|\s*\d+\.\s+)/, "")}` : line;
      const wrapped = doc.splitTextToSize(text, maxWidth - (isList ? 4 : 0));
      for (const w of wrapped) {
        ensureSpace(6);
        doc.text(w, marginX + (isList ? 4 : 0), y);
        y += 5;
      }
    }

    // Footer page numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Scalyo · Plan de croissance · ${i}/${pageCount}`, pageWidth / 2, pageHeight - 8, { align: "center" });
    }

    doc.save(`plan-de-croissance-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setInput("");
    if (trimmed.toLowerCase() === "menu") {
      setShowQuickButtons(true);
    } else {
      setShowQuickButtons(false);
    }

    await sendMessage(trimmed);
  };

  const contextLabel = useMemo(() => context, [context]);

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
          <div className="w-11 h-11 rounded-[18px]" style={{ backgroundColor: accentColor }}>
            <div className="h-full w-full flex items-center justify-center text-white text-base font-semibold">{userInitials}</div>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHistory((s) => !s)}
            className="rounded-full border border-border bg-white px-2 py-1 text-xs text-foreground inline-flex items-center gap-1"
            title="Historique des conversations"
          >
            <History className="h-3 w-3" /> {history.length > 0 ? history.length : ""}
          </button>
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

      {showHistory && (
        <div className="border-b border-border bg-slate-50 px-4 py-3 max-h-56 overflow-y-auto">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
            Historique des conversations
          </p>
          {history.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">
              Aucune conversation sauvegardée. Cliquez sur "Nouvelle conversation" pour archiver la discussion en cours.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {history.map((snap) => (
                <li
                  key={snap.id}
                  className="flex items-start justify-between gap-2 rounded-lg border border-border bg-white p-2 text-xs hover:border-slate-300"
                >
                  <button
                    type="button"
                    onClick={() => restoreConversation(snap)}
                    className="flex-1 text-left"
                  >
                    <p className="font-medium text-slate-900 line-clamp-1">{snap.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {new Date(snap.savedAt).toLocaleString("fr-FR")} · {snap.messages.length} messages
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSnapshot(snap.id)}
                    className="text-slate-400 hover:text-rose-600 text-xs"
                    title="Supprimer"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {enableGrowthPlanExport && (
        <div className="border-b border-border bg-gradient-to-r from-emerald-500/10 via-emerald-400/5 to-transparent px-4 py-3">
          <button
            type="button"
            onClick={() => void generateGrowthPlanPDF()}
            disabled={generatingPlan || isLoading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: accentColor, color: "#0f172a" }}
          >
            {generatingPlan ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Génération du plan…
              </>
            ) : (
              <>
                <FileDown className="h-3.5 w-3.5" /> Générer mon plan de croissance complet (PDF)
              </>
            )}
          </button>
          <p className="text-[10px] text-slate-600 mt-1.5 text-center">
            Document IA structuré : diagnostic · recommandations · projections · plan 90j
          </p>
        </div>
      )}

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
                style={message.role === "user" ? { backgroundColor: accentColor } : undefined}
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
                    {shouldShowAddToPlan(message.content) && (
                      <button
                        type="button"
                        onClick={() => handleAddToPlan(message.content)}
                        className="rounded-full border border-border bg-emerald-50 px-3 py-1 text-emerald-700 transition hover:bg-emerald-100"
                      >
                        + Ajouter au plan d'action
                      </button>
                    )}
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

        {showQuickButtons && (
          <div className="flex flex-wrap gap-2">
            {quickButtons.map((button) => (
              <button
                key={button.label}
                onClick={() => void handleQuickAction(button.action)}
                disabled={isLoading}
                className="rounded-full border px-4 py-2 text-sm font-medium bg-white text-slate-900 transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ borderColor: accentColor }}
              >
                {button.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 mt-4">
          <input
            className="flex-1 rounded-2xl border border-border px-4 py-2 text-sm bg-background text-foreground outline-none"
            placeholder="Posez votre question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void handleSubmit();
              }
            }}
            disabled={isLoading}
          />
          <button
            onClick={() => void handleSubmit()}
            disabled={!input.trim() || isLoading}
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-slate-900 px-4 text-white transition hover:bg-slate-800 disabled:opacity-50"
            style={{ backgroundColor: accentColor }}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssistantChat;
