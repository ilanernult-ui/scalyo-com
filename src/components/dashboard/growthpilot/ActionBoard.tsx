const ActionBoard = () => {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-1.5 h-1.5 rounded-full bg-[#00e676]" />
        <h2 className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
          Plan d'Action Hebdomadaire
        </h2>
      </div>
      <p className="text-xs text-white/30 italic py-8 text-center">
        Aucun élément à afficher pour le moment
      </p>
    </div>
  );
};

export default ActionBoard;
