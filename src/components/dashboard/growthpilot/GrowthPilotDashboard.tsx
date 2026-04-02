import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Target, Zap, Bot, TrendingUp, BarChart3, MessageCircle
} from "lucide-react";
import CockpitHeader from "./CockpitHeader";
import ActionBoard from "./ActionBoard";
import QuickWins from "./QuickWins";
import Automations from "./Automations";
import SalesFunnel from "./SalesFunnel";
import ImpactTracker from "./ImpactTracker";
import DataDiagCollapsible from "./DataDiagCollapsible";

const navItems = [
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { id: "actions", label: "Plan d'action", icon: Target },
  { id: "quickwins", label: "Quick Wins", icon: Zap },
  { id: "automations", label: "Automatisations", icon: Bot },
  { id: "sales", label: "Ventes & Tunnel", icon: TrendingUp },
  { id: "datadiag", label: "DataDiag", icon: BarChart3 },
  { id: "support", label: "Support IA", icon: MessageCircle, badge: "< 4h" },
];

const GrowthPilotDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(`gp-${id}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#0f1117" }}>
      {/* Speed lines texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 40px,
            rgba(255,255,255,0.05) 40px,
            rgba(255,255,255,0.05) 41px
          )`,
        }}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 bg-[#0a0d14] border-r border-white/[0.06] flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00e676]/10 flex items-center justify-center">
              <span className="text-sm">✈</span>
            </div>
            <span className="text-sm font-bold text-white" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              GrowthPilot
            </span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map((item) => {
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                  active
                    ? "text-[#00e676] bg-[#00e676]/[0.06]"
                    : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="gp-sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#00e676]"
                    style={{ boxShadow: "0 0 8px rgba(0,230,118,0.4)" }}
                  />
                )}
                <item.icon className="w-4 h-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#00e676]/10 text-[#00e676] font-semibold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/[0.06]">
          <div className="rounded-xl bg-[#00e676]/[0.04] border border-[#00e676]/10 p-3">
            <p className="text-xs font-semibold text-white/80">GrowthPilot</p>
            <p className="text-[10px] text-white/30">189€/mois</p>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-60 relative z-10">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-20 bg-[#0f1117]/90 backdrop-blur-xl border-b border-white/[0.06] px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="text-white/60 hover:text-white">
            <LayoutDashboard className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold text-white">GrowthPilot</span>
        </div>

        <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
          <div id="gp-dashboard">
            <CockpitHeader />
          </div>

          <div id="gp-actions">
            <ActionBoard />
          </div>

          <div id="gp-quickwins">
            <QuickWins />
          </div>

          <div id="gp-automations">
            <Automations />
          </div>

          <div id="gp-sales">
            <SalesFunnel />
          </div>

          <div id="gp-support">
            <ImpactTracker />
          </div>

          <div id="gp-datadiag">
            <DataDiagCollapsible />
          </div>
        </div>
      </main>
    </div>
  );
};

export default GrowthPilotDashboard;
