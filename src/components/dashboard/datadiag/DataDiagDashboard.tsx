import { motion } from "framer-motion";
import {
  DollarSign, TrendingUp, Users, Headphones,
  ThumbsUp, Clock, Zap, FileText, Download, ChevronRight,
  AlertTriangle
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import ScoreGauge from "./ScoreGauge";
import MiniScoreArc from "./MiniScoreArc";
import { Button } from "@/components/ui/button";

/* ── No fake data: empty by default ── */
const lossBarData: { name: string; value: number; color: string }[] = [];
const actions: { title: string; roi: string; effort: string; progress: number }[] = [];
const kpis: { label: string; value: string; change: string; up: boolean; spark: number[] }[] = [];

const card = "rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5 sm:p-6 hover:border-white/[0.12] transition-colors duration-300";
const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});

const EmptyHint = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs text-white/30 italic py-6 text-center">{children}</p>
);

const DataDiagDashboard = () => {
  return (
    <div
      className="min-h-screen text-white"
      style={{ background: "linear-gradient(180deg, #0a0e1a 0%, #0d1225 50%, #0a0e1a 100%)" }}
    >
      {/* Grid texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* ── 1. HEADER ── */}
        <motion.div {...fadeUp(0)} className={`${card} flex flex-col sm:flex-row items-center justify-between gap-4`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00d4ff]/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#00d4ff]" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                DataDiag
              </h1>
              <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#00d4ff]/10 text-[#00d4ff] font-semibold">
                Starter
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-center">
            <div>
              <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.8)" }}>
                En attente de données
              </p>
              <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>Connectez vos sources pour démarrer le diagnostic</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Plan actuel</p>
              <p className="text-sm font-semibold text-[#00d4ff]">DataDiag</p>
            </div>
          </div>
        </motion.div>

        {/* ── 2. SCORE BUSINESS 360° ── */}
        <motion.div {...fadeUp(1)} className={card}>
          <h2 className="text-sm font-semibold mb-6 flex items-center gap-2" style={{ color: "rgba(255,255,255,0.6)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]" />
            Score Business 360°
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <ScoreGauge score={0} size={180} delay={300} />
            <div className="flex gap-8 sm:gap-12">
              <MiniScoreArc score={0} label="Rentabilité" delay={500} />
              <MiniScoreArc score={0} label="Efficacité" delay={700} />
              <MiniScoreArc score={0} label="Croissance" delay={900} />
            </div>
          </div>
          <p className="text-xs text-white/30 italic text-center mt-4">Aucune donnée disponible</p>
        </motion.div>

        {/* ── 3. PERTES DÉTECTÉES ── */}
        <div className="grid md:grid-cols-2 gap-4">
          <motion.div {...fadeUp(2)} className={`${card} border-red-500/20`}>
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-4 h-4 text-red-400" />
              <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>
                Pertes financières estimées
              </span>
            </div>
            <span className="font-mono text-4xl sm:text-5xl font-bold tracking-tight text-white/30">--</span>
            <p className="mt-2 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              Aucune donnée disponible
            </p>
          </motion.div>

          <motion.div {...fadeUp(2.5)} className={`${card} border-amber-500/20`}>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>
                Pertes de temps estimées
              </span>
            </div>
            <span className="font-mono text-4xl sm:text-5xl font-bold tracking-tight text-white/30">--</span>
            <p className="mt-2 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              Aucune donnée disponible
            </p>
          </motion.div>
        </div>

        {/* Loss bar chart */}
        <motion.div {...fadeUp(3)} className={card}>
          <h3 className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
            Sources principales de pertes
          </h3>
          {lossBarData.length === 0 ? (
            <EmptyHint>En attente de données</EmptyHint>
          ) : (
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lossBarData} layout="vertical" barSize={20}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category" dataKey="name" width={140}
                    tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                    axisLine={false} tickLine={false}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {lossBarData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} fillOpacity={0.7} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        {/* ── 4. TOP 5 ACTIONS RAPIDES ── */}
        <motion.div {...fadeUp(4)} className={card}>
          <div className="flex items-center gap-2 mb-5">
            <Zap className="w-4 h-4 text-[#00d4ff]" />
            <h2 className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
              Top 5 Actions Rapides
            </h2>
          </div>
          {actions.length === 0 ? (
            <EmptyHint>Aucun élément à afficher pour le moment</EmptyHint>
          ) : (
            <div className="space-y-3">
              {actions.map((a, i) => (
                <motion.div
                  key={i}
                  {...fadeUp(4.5 + i * 0.15)}
                  className="group flex items-center gap-4 rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-300 cursor-pointer"
                >
                  <span className="font-mono text-2xl font-bold text-[#00d4ff]/30 w-10 text-center shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/90">{a.title}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs font-semibold text-green-400">💰 {a.roi}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${effortColor[a.effort]}`}>
                        {a.effort}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-2 h-1 w-full rounded-full bg-white/[0.04]">
                      <div className="h-full rounded-full bg-[#00d4ff]/30" style={{ width: `${a.progress}%` }} />
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── 5. KPIs TEMPS RÉEL ── */}
        <div>
          <h2 className="text-xs font-medium uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: "rgba(255,255,255,0.4)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            KPIs Temps Réel
          </h2>
          {kpis.length === 0 ? (
            <div className={card}>
              <EmptyHint>En attente de données</EmptyHint>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {kpis.map((kpi, i) => (
                <motion.div key={kpi.label} {...fadeUp(6 + i * 0.1)} className={`${card} group`}>
                  <p className="text-[11px] uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {kpi.label}
                  </p>
                  <p className="font-mono text-2xl font-bold text-white tracking-tight">
                    {kpi.value}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    {kpi.up ? (
                      <TrendingUp className="w-3 h-3 text-green-400" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-400" />
                    )}
                    <span className={`text-xs font-medium ${kpi.up ? "text-green-400" : "text-red-400"}`}>
                      {kpi.change}
                    </span>
                  </div>
                  <div className="mt-3 opacity-50 group-hover:opacity-100 transition-opacity">
                    <SparkLine data={kpi.spark} color={kpi.up ? "#22c55e" : "#ef4444"} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* ── 6. RAPPORT IA MENSUEL ── */}
        <motion.div {...fadeUp(7)} className={`${card} border-[#00d4ff]/10`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-[#00d4ff]" />
                <h2 className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Rapport IA Mensuel
                </h2>
              </div>
              <p className="text-xs text-white/30 italic">Aucune donnée disponible — connectez vos sources pour générer un rapport.</p>
            </div>
            <Button
              variant="outline"
              disabled
              className="shrink-0 gap-2 border-[#00d4ff]/20 text-[#00d4ff] hover:bg-[#00d4ff]/10 hover:text-[#00d4ff] bg-transparent"
            >
              <Download className="w-4 h-4" />
              Télécharger le PDF
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DataDiagDashboard;
