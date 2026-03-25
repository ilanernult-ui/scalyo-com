import { useState, useRef, useEffect, useCallback } from "react";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatPanelProps {
  activeTab: string;
  userInitials: string;
}

const suggestions = [
  { emoji: "📊", label: "Analyse globale", prompt: "Donne-moi une analyse globale de mes données et les 3 actions prioritaires à mener." },
  { emoji: "📉", label: "Réduire le churn", prompt: "Comment réduire concrètement mon taux de churn ?" },
  { emoji: "🚀", label: "Plan de croissance", prompt: "Génère-moi un plan de croissance basé sur mes données actuelles." },
  { emoji: "💡", label: "Points d'attention", prompt: "Quels sont les points d'alerte que tu vois dans mes données ?" },
];

const TypingIndicator = () => (
  <div className="flex gap-1 items-center px-3.5 py-2.5 bg-secondary border border-border rounded-xl rounded-bl-sm w-fit">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
        style={{ animationDelay: `${i * 150}ms`, animationDuration: "0.9s" }}
      />
    ))}
  </div>
);

const AIChatPanel = ({ activeTab, userInitials }: AIChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, loading, scrollToBottom]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setError(false);
    setShowSuggestions(false);

    const userMsg: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const { data, error: fnError } = await supabase.functions.invoke("scalyo-chat", {
        body: {
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          activeTab,
        },
      });

      if (fnError) throw fnError;
      const aiText = data?.text || "Désolé, je n'ai pas pu générer une réponse.";
      setMessages((prev) => [...prev, { role: "assistant", content: aiText }]);
    } catch (err) {
      console.error("Chat error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 80) + "px";
  };

  const formatTime = () =>
    new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="w-[360px] bg-card border border-border rounded-2xl flex flex-col shrink-0 overflow-hidden h-fit max-h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center gap-3">
        <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground text-base">
          ✦
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Assistant Scalyo IA</p>
          <p className="text-[11px] text-success flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            En ligne – analyse vos données
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 min-h-[300px] max-h-[450px] scrollbar-thin">
        {/* Welcome message */}
        <div className="flex gap-2 items-end">
          <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-xs shrink-0">✦</div>
          <div>
            <div className="max-w-[80%] px-3.5 py-2.5 rounded-xl rounded-bl-sm bg-secondary border border-border text-[13px] leading-relaxed text-foreground">
              Bonjour 👋 Je suis votre assistant IA Scalyo. J'analyse vos données en temps réel et je suis prêt à vous donner des recommandations concrètes. Par quoi souhaitez-vous commencer ?
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">maintenant</p>
          </div>
        </div>

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 items-end ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${
              msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"
            }`}>
              {msg.role === "user" ? userInitials : "✦"}
            </div>
            <div>
              <div className={`max-w-[80%] px-3.5 py-2.5 rounded-xl text-[13px] leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-secondary border border-border text-foreground rounded-bl-sm"
              }`}>
                {msg.content}
              </div>
              <p className={`text-[10px] text-muted-foreground mt-1 ${msg.role === "user" ? "text-right" : ""}`}>
                {formatTime()}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2 items-end">
            <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-xs shrink-0">✦</div>
            <TypingIndicator />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {showSuggestions && (
        <div className="px-4 pb-3 flex gap-1.5 flex-wrap">
          {suggestions.map((s) => (
            <button
              key={s.label}
              onClick={() => sendMessage(s.prompt)}
              className="px-2.5 py-1 border border-primary/30 rounded-full text-[11px] font-medium text-primary bg-primary/5 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {s.emoji} {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 text-destructive text-xs px-4 py-2 border-t border-destructive/20">
          ⚠️ Erreur de connexion à l'IA. Réessayez.
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 border-t border-border flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          className="flex-1 border border-border rounded-[10px] px-3 py-2 text-[13px] font-sans resize-none outline-none bg-secondary text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-card transition-colors leading-relaxed"
          placeholder="Posez une question sur vos données…"
          rows={1}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            autoResize(e.target);
          }}
          onKeyDown={handleKeyDown}
          style={{ maxHeight: 80 }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          className="w-9 h-9 rounded-[9px] bg-primary border-none cursor-pointer flex items-center justify-center transition-colors shrink-0 hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed"
        >
          <Send className="h-4 w-4 text-primary-foreground" />
        </button>
      </div>
    </div>
  );
};

export default AIChatPanel;
