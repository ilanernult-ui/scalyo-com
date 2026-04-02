import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useCountUp } from "../datadiag/useCountUp";

const donutData = [
  { name: "Nouveaux", value: 180, color: "#f0c040" },
  { name: "Actifs", value: 620, color: "#10b981" },
  { name: "Dormants", value: 280, color: "#6b7280" },
  { name: "Churned", value: 120, color: "#dc2626" },
];

const growthData = Array.from({ length: 6 }, (_, i) => ({
  month: ["Oct", "Nov", "Déc", "Jan", "Fév", "Mar"][i],
  reel: [12, 14, 16, 18, 21, 23.7][i],
  projection: i >= 4 ? [null, null, null, null, 22, 26.2][i] : null,
}));

const waterfallData = [
  { name: "CA", value: 72000, color: "#f0c040" },
  { name: "Coûts", value: -47400, color: "#dc2626" },
  { name: "Marge", value: 24600, color: "#10b981" },
];

const Analysis360 = () => {
  const ltv = useCountUp(2840, 2000, 400);
  const nps = useCountUp(67, 1800, 600);
  const margin = useCountUp(342, 1800, 500);

  const card = "rounded-2xl border border-[#f0c040]/[0.08] bg-white/[0.02] p-5";

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-1.5 h-1.5 rounded-full bg-[#f0c040]" />
        <h2 className="text-sm font-semibold text-white/60">Analyse 360°</h2>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Clients 360° */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={card}>
          <h3 className="text-xs font-semibold text-white/50 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Clients 360°
          </h3>
          <div className="h-36 -mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={40} outerRadius={58} dataKey="value" strokeWidth={0}>
                  {donutData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mb-3">
            {donutData.map((d) => (
              <div key={d.name} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                <span className="text-[9px] text-white/40">{d.name}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-white/40">LTV moyen</span>
              <span className="font-bold text-[#f0c040]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                {ltv.toLocaleString("fr-FR")}€
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">NPS</span>
              <span className="font-bold text-[#10b981]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{nps}</span>
            </div>
            <p className="text-[10px] text-white/25 mt-2">Top segment: PME 10-50 salariés (62% du CA)</p>
          </div>
        </motion.div>

        {/* Croissance 360° */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className={card}>
          <h3 className="text-xs font-semibold text-white/50 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Croissance 360°
          </h3>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 9 }} axisLine={false} tickLine={false} width={25} />
                <Area type="monotone" dataKey="reel" stroke="#f0c040" fill="#f0c040" fillOpacity={0.08} strokeWidth={2} />
                <Area type="monotone" dataKey="projection" stroke="#f0c040" fill="none" strokeWidth={2} strokeDasharray="6 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 text-xs mt-3">
            <div className="flex gap-3">
              <span className="text-[#f0c040] font-bold">+23.7%</span>
              <span className="text-white/30">Objectif: +25%</span>
              <span className="text-[#10b981] font-semibold">→ +26.2%</span>
            </div>
            <p className="text-[10px] text-[#7c3aed]">IA: Vous dépasserez votre objectif dans 12 jours</p>
            <div className="flex gap-3 text-[10px] text-white/30 mt-1">
              <span>Acquisition +8%</span>
              <span>Expansion +11%</span>
              <span>Rétention +4.7%</span>
            </div>
          </div>
        </motion.div>

        {/* Rentabilité 360° */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className={card}>
          <h3 className="text-xs font-semibold text-white/50 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Rentabilité 360°
          </h3>
          {/* Mini waterfall */}
          <div className="space-y-2 mb-4">
            {waterfallData.map((w) => (
              <div key={w.name} className="flex items-center gap-2">
                <span className="text-[10px] text-white/40 w-12">{w.name}</span>
                <div className="flex-1 h-4 rounded bg-white/[0.04] overflow-hidden">
                  <motion.div
                    className="h-full rounded"
                    style={{ background: w.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.abs(w.value) / 720}%` }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                  />
                </div>
                <span className="text-[10px] font-mono font-bold" style={{ color: w.color }}>
                  {w.value > 0 ? "+" : ""}{(w.value / 1000).toFixed(1)}k€
                </span>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-white/40">Marge nette</span>
              <span className="font-bold text-[#10b981]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                {(margin / 10).toFixed(1)}%
              </span>
            </div>
            <p className="text-[10px] text-[#f0c040]">Récupéré ce trimestre: +8 200€</p>
            <div className="flex justify-between text-[10px]">
              <span className="text-white/30">CAC</span>
              <span className="text-white/50">124€ <span className="text-[#10b981]">▼ -12%</span></span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analysis360;
