import { useCountUp } from "../datadiag/useCountUp";

interface CockpitHeaderProps {}

const CockpitHeader = ({}: CockpitHeaderProps) => {
  const growth = useCountUp(124, 1800, 300);
  const hours = useCountUp(92, 1800, 500);
  const roi = useCountUp(2840, 2000, 700);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-4 sm:p-5">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00e676]/10 border border-[#00e676]/20 flex items-center justify-center">
            <span className="text-lg">✈</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              GrowthPilot
            </h1>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#00e676] animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest text-[#00e676] font-semibold">Co-pilote actif</span>
            </div>
          </div>
        </div>

        {/* Center: Mission-critical stats */}
        <div className="flex items-center gap-6 sm:gap-10">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Croissance ce mois</p>
            <p className="font-mono text-2xl font-bold text-[#00e676]">+{(growth / 10).toFixed(1)}%</p>
          </div>
          <div className="w-px h-8 bg-white/[0.08]" />
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Heures récupérées</p>
            <p className="font-mono text-2xl font-bold text-[#2979ff]">+{(hours / 10).toFixed(1)}h</p>
          </div>
          <div className="w-px h-8 bg-white/[0.08]" />
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>ROI actions</p>
            <p className="font-mono text-2xl font-bold text-[#00e676]">
              +{roi.toLocaleString("fr-FR")}€
            </p>
          </div>
        </div>

        {/* Right: Plan info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00e676]/10 border border-[#00e676]/20">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00e676] animate-pulse" />
            <span className="text-[10px] font-semibold text-[#00e676]">Support &lt; 4h</span>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Plan actuel</p>
            <p className="text-sm font-semibold text-[#00e676]">189€/mois</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00e676] to-[#2979ff] flex items-center justify-center">
            <span className="text-xs font-bold text-white">GP</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CockpitHeader;
