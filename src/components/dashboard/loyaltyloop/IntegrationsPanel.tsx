const IntegrationsPanel = () => (
  <div>
    <div className="flex items-center gap-2 mb-4">
      <div className="w-1.5 h-1.5 rounded-full bg-[#f0c040]" />
      <h2 className="text-sm font-semibold text-white/60">Intégrations CRM</h2>
    </div>
    <div className="rounded-2xl border border-[#f0c040]/[0.06] bg-white/[0.02] p-6">
      <p className="text-xs text-white/30 italic text-center">
        Aucune intégration connectée pour le moment
      </p>
    </div>
  </div>
);

export default IntegrationsPanel;
