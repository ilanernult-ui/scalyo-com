import { Terminal } from "lucide-react";

const ImpactTracker = () => (
  <div className="rounded-2xl border border-white/[0.06] bg-[#080b12] p-5 font-mono relative overflow-hidden">
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.03]"
      style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,230,118,0.1) 2px, rgba(0,230,118,0.1) 4px)",
      }}
    />

    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#00e676]" />
          <h2 className="text-sm font-semibold text-[#00e676]">Impact Tracker</h2>
        </div>
      </div>

      <div className="flex items-center gap-1 pt-1">
        <span className="text-[#00e676] animate-pulse">▋</span>
        <span className="text-white/15 text-xs">En attente d'événements...</span>
      </div>
    </div>
  </div>
);

export default ImpactTracker;
