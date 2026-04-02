import { useCountUp } from "../datadiag/useCountUp";

const CommandCenterHeader = () => {
  const growth = useCountUp(237, 2000, 300);
  const retained = useCountUp(847, 2000, 500);
  const churnSaved = useCountUp(12400, 2200, 700);

  return (
    <div className="rounded-2xl border border-[#f0c040]/10 bg-white/[0.02] backdrop-blur-xl p-5">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#f0c040]/10 border border-[#f0c040]/20 flex items-center justify-center">
            <span className="text-lg">♾️</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span style={{ color: "#f0c040" }}>Loyalty</span><span className="text-white">Loop</span>
            </h1>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#f0c040] animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest text-[#f0c040]/80 font-semibold">Transformation Active</span>
            </div>
          </div>
        </div>

        {/* Center metrics */}
        <div className="flex items-center gap-8 sm:gap-12">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest mb-1 text-white/30">Croissance globale</p>
            <p className="text-2xl font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#f0c040" }}>
              +{(growth / 10).toFixed(1)}%
            </p>
          </div>
          <div className="w-px h-10 bg-[#f0c040]/10" />
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest mb-1 text-white/30">Clients retenus</p>
            <p className="text-2xl font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#10b981" }}>
              {retained.toLocaleString("fr-FR")}
            </p>
          </div>
          <div className="w-px h-10 bg-[#f0c040]/10" />
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest mb-1 text-white/30">Churn évité</p>
            <p className="text-2xl font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              <span className="line-through text-[#dc2626]/60 text-lg mr-1">-{churnSaved.toLocaleString("fr-FR")}€</span>
              <span className="text-[#10b981]">✓</span>
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
              <span className="text-[9px] text-white/40">👥 Utilisateurs illimités</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#10b981]/10 border border-[#10b981]/20">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              <span className="text-[9px] text-[#10b981] font-medium">Salesforce</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/30">Plan Premium</p>
            <p className="text-sm font-semibold text-[#f0c040]">349€/mois</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f0c040] to-[#7c3aed] flex items-center justify-center">
            <span className="text-xs font-bold text-white">LL</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandCenterHeader;
