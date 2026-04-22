import { useState } from "react";
import { Pencil, Trash2, Copy, Heart, ClipboardList, Star, Send, Check } from "lucide-react";

const SHORTCUTS = [
  { icon: Heart, label: "Clients à risque" },
  { icon: ClipboardList, label: "Réduire mon churn" },
  { icon: Star, label: "Clients VIP" },
];

const WELCOME =
  "Bonjour 👋 Je suis votre expert en fidélisation client. Je surveille votre churn, identifie vos clients à risque et optimise votre rétention pour atteindre -40% de churn.";

const ExpertChatWidget = () => {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(WELCOME);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  const handleNewConversation = () => {
    setInput("");
    setResetKey((k) => k + 1);
  };

  return (
    <div
      key={resetKey}
      className="bg-white border border-black/5 rounded-xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-black shrink-0"
            style={{ backgroundColor: "#F5C518" }}
          >
            IE
          </div>
          <div>
            <div className="text-base font-bold text-black">Expert LoyaltyLoop IA</div>
            <div className="text-xs text-black/55 mt-0.5">Rétention clients & réduction churn</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-lg border border-black/10 hover:bg-black/5 transition-colors"
            aria-label="Modifier"
          >
            <Pencil className="w-4 h-4 text-black/70" />
          </button>
          <button
            onClick={handleNewConversation}
            className="inline-flex items-center gap-1.5 text-xs font-medium border border-black/10 hover:bg-black/5 px-3 py-2 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Nouvelle conversation
          </button>
        </div>
      </div>

      {/* Welcome bubble */}
      <div className="space-y-2 mb-5">
        <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[90%]">
          <p className="text-sm text-black/80 leading-relaxed">{WELCOME}</p>
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-xs text-black/55 hover:text-black ml-2 transition-colors"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copié" : "Copier"}
        </button>
      </div>

      {/* Shortcut pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {SHORTCUTS.map((s) => (
          <button
            key={s.label}
            onClick={() => setInput(s.label)}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border-2 transition-colors hover:bg-[#FFFBEB]"
            style={{ borderColor: "#F5C518", color: "#000" }}
          >
            <s.icon className="w-3.5 h-3.5" style={{ color: "#F5C518" }} />
            {s.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setInput("");
        }}
        className="flex items-center gap-2 border border-black/10 rounded-full pl-4 pr-1 py-1 focus-within:border-black/30 transition-colors"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Posez votre question..."
          className="flex-1 bg-transparent text-sm py-2 outline-none placeholder:text-black/40"
        />
        <button
          type="submit"
          className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-105 shrink-0"
          style={{ backgroundColor: "#F5C518" }}
          aria-label="Envoyer"
        >
          <Send className="w-4 h-4 text-black" />
        </button>
      </form>
    </div>
  );
};

export default ExpertChatWidget;
