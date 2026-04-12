import { useEffect, useMemo, useRef, useState } from "react";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { saveAs } from "file-saver";
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

const STORAGE_PREFIX = "scalyo-chat-";

const createMessageId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const getStorageKey = (context: AssistantContext) => `${STORAGE_PREFIX}${context}`;

const AssistantChat = ({
  context,
  accentColor,
  name,
  subtitle,
  welcomeMessage,
  quickButtons,
  userInitials = "IA",
  plan,
}: AssistantChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: createMessageId(), role: "assistant", content: welcomeMessage },
  ]);
  const [input, setInput] = useState("");
  const [showQuickButtons, setShowQuickButtons] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedIds, setCopiedIds] = useState<Record<string, boolean>>({});
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
    const nextMessages: Message[] = [{ id: createMessageId(), role: "assistant", content: welcomeMessage }];
    setMessages(nextMessages);
    setCopiedIds({});
    setShowQuickButtons(true);

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(getStorageKey(context));
    }
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
