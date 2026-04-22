import { useState } from "react";
import { Bell, TrendingDown, Users, AlertTriangle, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";

const churnData = [
  { month: "Oct", value: 5.8, opacity: 0.35 },
  { month: "Nov", value: 5.4, opacity: 0.5 },
  { month: "Déc", value: 5.0, opacity: 0.65 },
  { month: "Jan", value: 4.7, opacity: 0.78 },
  { month: "Fév", value: 4.5, opacity: 0.9 },
  { month: "Mar", value: 4.2, opacity: 1 },
];

const kpis = [
  { label: "Score rétention", value: "58/100", sub: "Excellent si > 85" },
  { label: "Taux de churn", value: "4.2%", sub: "Moy. SaaS B2B : 5%" },
  { label: "Clients à risque", value: "3", sub: "Action requise" },
];


const LoyaltyLoopApp = () => {
  const [activeTab, setActiveTab] = useState<"retention" | "fidelisation">("retention");

  return (
    <div className="min-h-screen bg-white text-black" style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-black/5">
        <div className="text-xl font-bold tracking-tight">LoyaltyLoop</div>

        <div className="flex items-center gap-8">
          <a href="#plan" className="text-sm font-medium text-black/70 hover:text-black transition-colors">
            Plan LoyaltyLoop
          </a>
          <a href="#presentation" className="text-sm font-medium text-black/70 hover:text-black transition-colors">
            Présentation
          </a>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-full hover:bg-black/5 transition-colors" aria-label="Notifications">
            <Bell className="w-5 h-5 text-black/70" />
          </button>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-black"
            style={{ backgroundColor: "#F5C518" }}
          >
            IE
          </div>
        </div>
      </nav>

      {/* Toggle pill */}
      <div className="flex justify-center pt-8">
        <div className="inline-flex items-center p-1 rounded-full bg-gray-100">
          <button
            onClick={() => setActiveTab("retention")}
            className={`px-6 py-2 text-sm font-medium rounded-full transition-all ${
              activeTab === "retention"
                ? "bg-black text-white shadow-sm"
                : "text-black/60 hover:text-black"
            }`}
          >
            Rétention
          </button>
          <button
            onClick={() => setActiveTab("fidelisation")}
            className={`px-6 py-2 text-sm font-medium rounded-full transition-all ${
              activeTab === "fidelisation"
                ? "bg-black text-white shadow-sm"
                : "text-black/60 hover:text-black"
            }`}
          >
            Fidélisation
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {activeTab === "retention" ? (
          <div className="space-y-8">
            {/* KPI cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {kpis.map((k) => (
                <div
                  key={k.label}
                  className="bg-white border border-black/5 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
                >
                  <div className="text-xs font-medium text-black/50 uppercase tracking-wide">{k.label}</div>
                  <div className="text-3xl font-bold text-black mt-2">{k.value}</div>
                  <div className="text-xs text-black/50 mt-2">{k.sub}</div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="bg-white border border-black/5 rounded-xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <h3 className="text-base font-semibold text-black mb-6">Évolution du churn (%)</h3>
              <div style={{ width: "100%", height: 280 }}>
                <ResponsiveContainer>
                  <BarChart data={churnData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#00000080", fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#00000080", fontSize: 12 }} />
                    <Tooltip
                      cursor={{ fill: "rgba(124,58,237,0.06)" }}
                      contentStyle={{ borderRadius: 8, border: "1px solid rgba(0,0,0,0.08)", fontSize: 12 }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={42}>
                      {churnData.map((d, i) => (
                        <Cell key={i} fill="#7C3AED" fillOpacity={d.opacity} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-2 mt-4 text-sm font-medium text-emerald-600">
                <TrendingDown className="w-4 h-4" />
                Churn en baisse de 28% sur 6 mois
              </div>
            </div>

            {/* Risque churn par segment */}
            <div className="bg-white border border-black/5 rounded-xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center">
                  <Users className="w-4 h-4 text-black/70" />
                </div>
                <h3 className="text-base font-semibold text-black">Risque churn par segment</h3>
              </div>

              <div className="space-y-5">
                {[
                  { name: "Grands comptes", count: 45, score: 18, level: "Faible", color: "emerald" },
                  { name: "PME Tech", count: 120, score: 42, level: "Moyen", color: "orange" },
                  { name: "TPE / Indépendants", count: 89, score: 67, level: "Élevé", color: "rose" },
                  { name: "Nouveaux clients (<3 mois)", count: 86, score: 54, level: "Moyen", color: "orange" },
                ].map((s) => {
                  const palette: Record<string, { bar: string; track: string; text: string }> = {
                    emerald: { bar: "bg-emerald-500", track: "bg-emerald-100", text: "text-emerald-600" },
                    orange: { bar: "bg-orange-500", track: "bg-orange-100", text: "text-orange-600" },
                    rose: { bar: "bg-rose-500", track: "bg-rose-100", text: "text-rose-600" },
                  };
                  const c = palette[s.color];
                  return (
                    <div key={s.name}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="text-sm font-medium text-black">{s.name}</div>
                          <div className="text-xs text-black/45 mt-0.5">{s.count} clients</div>
                        </div>
                        <div className={`text-sm font-semibold ${c.text}`}>
                          {s.level} {s.score}
                        </div>
                      </div>
                      <div className={`h-2 w-full rounded-full ${c.track} overflow-hidden`}>
                        <div
                          className={`h-full ${c.bar} rounded-full transition-all`}
                          style={{ width: `${s.score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-black/60 text-sm">Contenu Fidélisation</div>
        )}
      </div>
    </div>
  );
};

export default LoyaltyLoopApp;
