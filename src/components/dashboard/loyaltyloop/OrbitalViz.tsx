const OrbitalViz = () => {
  return (
    <div className="rounded-2xl border border-[#f0c040]/10 bg-white/[0.02] backdrop-blur-xl p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1.5 h-1.5 rounded-full bg-[#f0c040]" />
        <h2 className="text-sm font-semibold text-white/60">Optimisation Continue</h2>
      </div>

      <div className="flex justify-center mb-8">
        <div className="relative w-[300px] h-[300px] sm:w-[360px] sm:h-[360px]">
          <div className="absolute inset-0 rounded-full border border-[#f0c040]/[0.06]" />
          <div className="absolute inset-8 rounded-full border border-[#f0c040]/[0.08]" />
          <div className="absolute inset-16 rounded-full border border-[#f0c040]/[0.1]" />

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Score Transformation</p>
            <p className="text-5xl font-bold text-white/30" style={{ fontFamily: "'Playfair Display', serif" }}>
              --
            </p>
            <p className="text-sm text-white/30" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>/100</p>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-white/30 italic">Aucune donnée disponible</p>
    </div>
  );
};

export default OrbitalViz;
