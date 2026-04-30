const CommandCenterHeader = () => {
  return (
    <div className="rounded-2xl border border-[#f0c040]/10 bg-white/[0.02] backdrop-blur-xl p-5">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#f0c040]/10 border border-[#f0c040]/20 flex items-center justify-center">
            <span className="text-lg">♾️</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span style={{ color: "#f0c040" }}>Loyalty</span><span className="text-white">Loop</span>
            </h1>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-white/20" />
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">En attente de données</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8 sm:gap-12">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest mb-1 text-white/30">Croissance globale</p>
            <p className="text-2xl font-bold text-white/30" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>--</p>
          </div>
          <div className="w-px h-10 bg-[#f0c040]/10" />
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest mb-1 text-white/30">Clients retenus</p>
            <p className="text-2xl font-bold text-white/30" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>--</p>
          </div>
          <div className="w-px h-10 bg-[#f0c040]/10" />
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest mb-1 text-white/30">Churn évité</p>
            <p className="text-2xl font-bold text-white/30" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>--</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] text-white/30">Plan</p>
            <p className="text-sm font-semibold text-[#f0c040]">LoyaltyLoop</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandCenterHeader;
