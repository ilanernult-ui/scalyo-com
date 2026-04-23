import { useState } from "react";
import { Heart, ClipboardList, Star, Copy, Send, Check } from "lucide-react";

const YELLOW = "#F5C518";

const SUGGESTIONS = [
  { icon: Heart, label: "Clients à risque" },
  { icon: ClipboardList, label: "Réduire mon churn" },
  { icon: Star, label: "Clients VIP" },
];

const INTRO_MESSAGE =
  "Bonjour 👋 Je suis votre expert en fidélisation client. Je surveille votre churn, identifie vos clients à risque et optimise votre rétention pour atteindre -40% de churn.";

const ExpertLoyaltyAI = () => {
  const [copied, setCopied] = useState(false);
  const [question, setQuestion] = useState("");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(INTRO_MESSAGE);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
          style={{ backgroundColor: YELLOW }}
        >
          IE
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Expert LoyaltyLoop IA</h3>
          <p className="text-xs text-muted-foreground">Rétention clients & réduction churn</p>
        </div>
      </div>

      {/* Bubble */}
      <div className="relative rounded-2xl bg-secondary/60 p-4 pr-10 mb-4">
        <p className="text-sm text-foreground leading-relaxed">{INTRO_MESSAGE}</p>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-1.5 rounded-md hover:bg-background transition-colors"
          aria-label="Copier le message"
          title="Copier"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {SUGGESTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.label}
              onClick={() => setQuestion(s.label)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: "rgba(245,197,24,0.18)", color: "#8A6A00" }}
            >
              <Icon className="h-3 w-3" />
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Posez votre question..."
          className="flex-1 h-10 px-4 rounded-full border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button
          className="h-10 w-10 rounded-full flex items-center justify-center text-white shrink-0 transition-opacity hover:opacity-90"
          style={{ backgroundColor: YELLOW }}
          aria-label="Envoyer"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ExpertLoyaltyAI;
