import { Zap } from "lucide-react";

const QuickWins = () => (
  <div>
    <div className="flex items-center gap-2 mb-4">
      <Zap className="w-4 h-4 text-[#00e676]" />
      <h2 className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
        Quick Wins du moment
      </h2>
    </div>
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
      <p className="text-xs text-white/30 italic text-center">
        Aucun élément à afficher pour le moment
      </p>
    </div>
  </div>
);

export default QuickWins;
