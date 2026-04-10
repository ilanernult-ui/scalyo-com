import { useMemo, useState } from "react";
import { Send } from "lucide-react";

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
}

interface Message {
  role: "assistant" | "user";
  content: string;
}

const assistantResponses: Record<AssistantContext, Record<string, string>> = {
  dashboard: {
    "📊 Analyser mes données": "Je peux vous donner un aperçu global de vos KPIs, vos marges et vos leviers de croissance.",
    "💡 Recommandations": "Je vous propose des actions prioritaires pour améliorer votre performance et réduire les frictions opérationnelles.",
    "📈 Voir ma progression": "Je compare votre activité récente aux objectifs et je repère les tendances les plus importantes.",
  },
  datadiag: {
    "🔍 Détecter mes pertes": "Je scanne votre business pour identifier les pertes cachées et les points de fuite les plus coûteux.",
    "💊 Santé financière": "J’analyse votre rentabilité, trésorerie et cash flow pour définir un score santé business clair.",
    "⚡ Actions prioritaires": "Je vous propose un plan d’actions sur 30 jours pour corriger les principaux dysfonctionnements.",
  },
  growthpilot: {
    "🚀 Accélérer ma croissance": "Je vous indique les leviers les plus efficaces pour booster votre CA rapidement.",
    "⏱️ Gagner du temps": "Je vous montre comment gagner du temps grâce à l’automatisation et une meilleure organisation des process.",
    "📊 Mes performances": "Je vous donne une synthèse des indicateurs clés pour suivre votre performance semaine après semaine.",
  },
  loyaltyloop: {
    "❤️ Clients à risque": "Je liste vos clients les plus fragiles pour vous aider à prioriser vos actions de rétention.",
    "📉 Réduire mon churn": "Je vous propose des scénarios concrets pour diminuer votre churn et stabiliser votre revenue.",
    "⭐ Clients VIP": "Je segmente vos clients VIP et je recommande des actions de fidélisation sur mesure.",
  },
};

const defaultResponses: Record<string, string> = {
  hello: "Je suis prêt à vous aider. Choisissez un bouton ou posez-moi une question.",
};

const AssistantChat = ({
  context,
  accentColor,
  name,
  subtitle,
  welcomeMessage,
  quickButtons,
  userInitials = "IA",
}: AssistantChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: welcomeMessage },
  ]);
  const [input, setInput] = useState("");

  const responseMap = useMemo(() => assistantResponses[context], [context]);

  const appendMessage = (message: Message) => setMessages((prev) => [...prev, message]);

  const handleQuickAction = (action: string) => {
    appendMessage({ role: "user", content: action });
    const reply = responseMap[action] ?? defaultResponses.hello;
    appendMessage({ role: "assistant", content: reply });
  };

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    appendMessage({ role: "user", content: trimmed });
    const reply = responseMap[trimmed] ?? "Je vous écoute. Dites-moi ce que vous souhaitez explorer.";
    appendMessage({ role: "assistant", content: reply });
    setInput("");
  };

  return (
    <div className="w-full xl:w-[420px] bg-card border border-border rounded-2xl flex flex-col overflow-hidden h-fit max-h-[calc(100vh-100px)]">
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-[18px]" style={{ backgroundColor: accentColor }}>
            <div className="h-full w-full flex items-center justify-center text-white text-base font-semibold">{userInitials}</div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          </div>
          <div className="rounded-full bg-slate-950 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-white">{context}</div>
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`rounded-2xl p-4 ${message.role === "assistant" ? "bg-white border border-border text-foreground" : "bg-primary text-primary-foreground"}`}
          >
            <p className="text-sm leading-6 whitespace-pre-wrap">{message.content}</p>
          </div>
        ))}

        <div className="flex flex-wrap gap-2">
          {quickButtons.map((button) => (
            <button
              key={button.label}
              onClick={() => handleQuickAction(button.action)}
              className="rounded-full border px-4 py-2 text-sm font-medium bg-white text-slate-900 transition hover:bg-opacity-90"
              style={{ borderColor: accentColor }}
            >
              {button.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-4">
          <input
            className="flex-1 rounded-2xl border border-border px-4 py-2 text-sm bg-background text-foreground outline-none"
            placeholder="Posez votre question..."
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
