const WeeklyRecommendations = () => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <div className="w-1.5 h-1.5 rounded-full bg-[#f0c040]" />
      <h2 className="text-sm font-semibold text-white/60">Recommandations Hebdomadaires IA</h2>
    </div>
    <p className="text-[10px] uppercase tracking-widest text-white/25 mb-5" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      📋 Briefing IA
    </p>

    <div className="rounded-2xl border border-[#f0c040]/[0.08] bg-white/[0.02] p-6">
      <p className="text-xs text-white/30 italic text-center">
        Aucun élément à afficher pour le moment
      </p>
    </div>
  </div>
);

export default WeeklyRecommendations;
