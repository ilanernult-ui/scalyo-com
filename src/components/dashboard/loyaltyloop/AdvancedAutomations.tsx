import { Bot } from "lucide-react";

const AdvancedAutomations = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-[#7c3aed]" />
          <h2 className="text-sm font-semibold text-white/60">Automatisations Avancées</h2>
        </div>
      </div>

      <div className="rounded-2xl border border-[#f0c040]/[0.08] bg-white/[0.02] p-6">
        <p className="text-xs text-white/30 italic text-center">
          Aucun élément à afficher pour le moment
        </p>
      </div>
    </div>
  );
};

export default AdvancedAutomations;
