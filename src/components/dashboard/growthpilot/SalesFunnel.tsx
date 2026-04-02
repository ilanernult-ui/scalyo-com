import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { AlertTriangle, Lightbulb } from "lucide-react";

const funnelStages = [
  { label: "Visiteurs", value: 4200, pct: 100 },
  { label: "Prospects", value: 1890, pct: 45 },
  { label: "Devis envoyés", value: 620, pct: 33 },
  { label: "Clients", value: 186, pct: 30 },
  { label: "Fidélisés", value: 94, pct: 50 },
];

const worstStageIdx = 2; // "Devis envoyés" — worst conversion

const salesData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  reel: Math.round(1800 + Math.random() * 800 + i * 30),
  objectif: Math.round(2000 + i * 40),
}));

const SalesFunnel = () => (
  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
    <div className="flex items-center gap-2 mb-5">
      <div className="w-1.5 h-1.5 rounded-full bg-[#2979ff]" />
      <h2 className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
        Analyse Ventes &amp; Tunnel de Conversion
      </h2>
    </div>

    <div className="grid lg:grid-cols-2 gap-6">
      {/* LEFT: Funnel */}
      <div className="space-y-2">
        {funnelStages.map((stage, i) => {
          const widthPct = 30 + (stage.pct / 100) * 70;
          const isWorst = i === worstStageIdx;
          return (
            <motion.div
              key={stage.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="relative"
            >
              <div
                className="rounded-lg px-4 py-3 flex items-center justify-between transition-all"
                style={{
                  width: `${widthPct}%`,
                  background: isWorst
                    ? "rgba(255,77,77,0.12)"
                    : `rgba(41,121,255,${0.06 + (1 - i / funnelStages.length) * 0.1})`,
                  border: isWorst ? "1px solid rgba(255,77,77,0.3)" : "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white/80">{stage.label}</span>
                  {isWorst && (
                    <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#ff4d4d]/20 text-[#ff4d4d] font-semibold">
                      <Lightbulb className="w-3 h-3" /> Opportunité
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-white/90">{stage.value.toLocaleString("fr-FR")}</span>
                  {i > 0 && (
                    <span className={`text-[10px] font-semibold ${isWorst ? "text-[#ff4d4d]" : "text-white/30"}`}>
                      {stage.pct}%
                    </span>
                  )}
                </div>
              </div>
              {i > 0 && i <= worstStageIdx && (
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-0.5 h-3 rounded-full" style={{ background: isWorst ? "#ff4d4d" : "rgba(255,255,255,0.1)" }} />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* RIGHT: Line chart */}
      <div>
        <p className="text-xs font-medium mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>
          Évolution des ventes — 30 derniers jours
        </p>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="day"
                tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }}
                axisLine={false} tickLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{ background: "#1a1f2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "rgba(255,255,255,0.5)" }}
              />
              <Line type="monotone" dataKey="objectif" stroke="#2979ff" strokeWidth={2} dot={false} strokeDasharray="6 4" name="Objectif" />
              <Line type="monotone" dataKey="reel" stroke="#00e676" strokeWidth={2} dot={false} name="Réel" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

    {/* AI Insight */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="mt-4 rounded-xl border border-[#2979ff]/20 bg-[#2979ff]/5 p-4 flex items-start gap-3"
    >
      <AlertTriangle className="w-4 h-4 text-[#2979ff] mt-0.5 shrink-0" />
      <p className="text-xs leading-relaxed text-white/60">
        <span className="font-semibold text-[#2979ff]">IA insight :</span> Votre taux de conversion devis→client est 8% sous la moyenne secteur. Les causes probables : délai de réponse trop long (moy. 48h vs 12h recommandé) et absence de relance automatique.{" "}
        <button className="text-[#2979ff] font-semibold hover:underline">Voir comment corriger →</button>
      </p>
    </motion.div>
  </div>
);

export default SalesFunnel;
