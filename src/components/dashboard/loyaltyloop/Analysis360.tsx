const Analysis360 = () => {
  const card = "rounded-2xl border border-[#f0c040]/[0.08] bg-white/[0.02] p-5";

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-1.5 h-1.5 rounded-full bg-[#f0c040]" />
        <h2 className="text-sm font-semibold text-white/60">Analyse 360°</h2>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {["Clients 360°", "Croissance 360°", "Rentabilité 360°"].map((title) => (
          <div key={title} className={card}>
            <h3 className="text-xs font-semibold text-white/50 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              {title}
            </h3>
            <p className="text-xs text-white/30 italic py-6 text-center">En attente de données</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analysis360;
