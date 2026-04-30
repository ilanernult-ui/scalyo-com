import { AlertTriangle } from "lucide-react";

const ChurnRadar = () => {
  return (
    <div className="rounded-2xl border border-[#dc2626]/15 overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(220,38,38,0.06) 0%, rgba(124,58,237,0.06) 100%)" }}>
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-6">
          <AlertTriangle className="w-4 h-4 text-[#dc2626]" />
          <h2 className="text-sm font-semibold text-white/70">Radar Churn — Clients à risque détectés</h2>
        </div>
        <p className="text-xs text-white/30 italic py-8 text-center">
          Aucun élément à afficher pour le moment
        </p>
      </div>
    </div>
  );
};

export default ChurnRadar;
