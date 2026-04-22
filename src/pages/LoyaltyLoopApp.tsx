import { useState } from "react";
import { Bell, TrendingDown, Users, AlertTriangle, ArrowUpRight, FileText, Download } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip,
  PieChart, Pie, LineChart, Line, ReferenceLine, CartesianGrid,
} from "recharts";

const segmentData = [
  { name: "Clients VIP fidèles", value: 773, color: "#F5C518" },
  { name: "Clients réguliers", value: 299, color: "#7C3AED" },
  { name: "Clients à risque", value: 125, color: "#F97316" },
  { name: "Churn ce mois", value: 48, color: "#EF4444" },
];

const churn6m = [
  { month: "Nov", value: 6.0 },
  { month: "Déc", value: 5.5 },
  { month: "Jan", value: 5.0 },
  { month: "Fév", value: 4.8 },
  { month: "Mar", value: 4.5 },
  { month: "Avr", value: 4.3 },
];

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

            {/* Alertes prédictives */}
            <div
              className="rounded-xl p-6 border border-black/5 border-l-4 border-l-red-500 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
              style={{ backgroundColor: "#FFF1F0" }}
            >
              <div className="flex items-center gap-2 mb-5">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <h3 className="text-base font-semibold text-black">Alertes prédictives</h3>
              </div>

              <div className="divide-y divide-black/5">
                {[
                  { name: "Dupont & Associés", days: 68, score: 74, scoreColor: "bg-red-500", action: "Appel CSM urgent" },
                  { name: "TechStart SAS", days: 45, score: 61, scoreColor: "bg-orange-500", action: "Email de réactivation" },
                  { name: "Innova Corp", days: 32, score: 52, scoreColor: "bg-orange-500", action: "Offre de renouvellement" },
                ].map((a) => (
                  <div key={a.name} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-black">{a.name}</div>
                      <div className="text-xs text-black/55 mt-0.5">Inactif depuis {a.days} jours</div>
                      <a href="#" className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 mt-2">
                        <ArrowUpRight className="w-3 h-3" />
                        {a.action}
                      </a>
                    </div>
                    <span className={`shrink-0 ${a.scoreColor} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>
                      {a.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CARTE 1 — Rapport LoyaltyLoop */}
            <div className="bg-white border border-black/5 rounded-xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-base font-semibold text-black">Rapport LoyaltyLoop</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-black/60 bg-black/5 px-2.5 py-1 rounded-full">Ce mois</span>
                  <button className="inline-flex items-center gap-1.5 text-xs font-medium border border-black/10 hover:bg-black/5 px-3 py-1.5 rounded-lg transition-colors">
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-black/70">
                Votre taux de churn est en baisse constante (-28% sur 6 mois). 3 clients à risque immédiat
                ont été identifiés et nécessitent une intervention CSM. Le potentiel upsell non exploité
                représente ~7 500€/mois.
              </p>
            </div>

            {/* CARTE 2 — Analyse clients */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-black/50">Analyse clients</h2>

              {/* Segmentation clients */}
              <div className="bg-white border border-black/5 rounded-xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <h3 className="text-base font-semibold text-black mb-4">Segmentation clients</h3>
                <div style={{ width: "100%", height: 240 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={segmentData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={2}
                        stroke="none"
                      >
                        {segmentData.map((d) => (
                          <Cell key={d.name} fill={d.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: 8, border: "1px solid rgba(0,0,0,0.08)", fontSize: 12 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {segmentData.map((s) => (
                    <div key={s.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                        <span className="text-black/75">{s.name}</span>
                      </div>
                      <span className="font-semibold text-black tabular-nums">{s.value} clients</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Évolution du churn — 6 mois */}
              <div
                className="rounded-xl p-6 border border-black/5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
                style={{ backgroundColor: "#FFFBEB" }}
              >
                <h3 className="text-xs font-bold uppercase tracking-wider text-black/50 mb-4">
                  Évolution du churn — 6 mois
                </h3>
                <div style={{ width: "100%", height: 240 }}>
                  <ResponsiveContainer>
                    <LineChart data={churn6m} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                      <CartesianGrid stroke="rgba(0,0,0,0.05)" vertical={false} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#00000080", fontSize: 12 }} />
                      <YAxis domain={[0, 7]} axisLine={false} tickLine={false} tick={{ fill: "#00000080", fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{ borderRadius: 8, border: "1px solid rgba(0,0,0,0.08)", fontSize: 12 }}
                      />
                      <ReferenceLine
                        y={3}
                        stroke="#EF4444"
                        strokeDasharray="5 5"
                        label={{ value: "Objectif : <3%", position: "insideBottomRight", fill: "#EF4444", fontSize: 11 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#F5C518"
                        strokeWidth={3}
                        dot={{ r: 5, fill: "#F5C518", stroke: "#fff", strokeWidth: 2 }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
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
