import { Terminal } from "lucide-react";

const ROITracker = () => {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="rounded-2xl border border-[#f0c040]/10 bg-white/[0.02] p-5">
        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">ROI généré depuis activation</p>
        <p className="text-4xl font-bold mb-6 text-white/30" style={{ fontFamily: "'Playfair Display', serif" }}>
          --
        </p>
        <p className="text-xs text-white/30 italic">Aucune donnée disponible</p>
      </div>

      <div className="rounded-2xl border border-[#f0c040]/10 bg-[#08080a] p-5 font-mono relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(240,192,64,0.1) 2px, rgba(240,192,64,0.1) 4px)",
        }} />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#f0c040]" />
              <span className="text-xs font-semibold text-[#f0c040]">LIVE</span>
            </div>
          </div>

          <div className="flex items-center gap-1 pt-1">
            <span className="text-[#f0c040] animate-pulse">▋</span>
            <span className="text-white/10 text-[10px]">En attente d'événements...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROITracker;
