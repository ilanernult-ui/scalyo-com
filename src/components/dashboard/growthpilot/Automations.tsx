import { Bot } from "lucide-react";

const Automations = () => {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-[#2979ff]" />
          <h2 className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
            Automatisations Recommandées
          </h2>
        </div>
      </div>
      <p className="text-xs text-white/30 italic py-8 text-center">
        Aucun élément à afficher pour le moment
      </p>
    </div>
  );
};

export default Automations;
