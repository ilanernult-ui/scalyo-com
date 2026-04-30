const CockpitHeader = () => {
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
              <div className="w-2 h-2 rounded-full bg-white/20" />
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">En attente de données</span>
            </div>
          </div>
        </div>

        {/* Center: Mission-critical stats */}
        <div className="flex items-center gap-6 sm:gap-10">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Croissance ce mois</p>
            <p className="font-mono text-2xl font-bold text-white/30">--</p>
          </div>
          <div className="w-px h-8 bg-white/[0.08]" />
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Heures récupérées</p>
            <p className="font-mono text-2xl font-bold text-white/30">--</p>
          </div>
          <div className="w-px h-8 bg-white/[0.08]" />
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>ROI actions</p>
            <p className="font-mono text-2xl font-bold text-white/30">--</p>
          </div>
        </div>

        {/* Right: Plan info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Plan actuel</p>
            <p className="text-sm font-semibold text-[#00e676]">GrowthPilot</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CockpitHeader;
