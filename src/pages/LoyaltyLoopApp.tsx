import { useState } from "react";
import { Bell, TrendingDown } from "lucide-react";
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
          <div className="text-center text-black/60 text-sm">Contenu Rétention</div>
        ) : (
          <div className="text-center text-black/60 text-sm">Contenu Fidélisation</div>
        )}
      </div>
    </div>
  );
};

export default LoyaltyLoopApp;
