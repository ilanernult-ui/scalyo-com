import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, RefreshCw, AlertTriangle, BarChart3, Bot,
  Lightbulb, DollarSign, Users, Link2, Plane, TrendingUp, Menu
} from "lucide-react";
import CommandCenterHeader from "./CommandCenterHeader";
import OrbitalViz from "./OrbitalViz";
import ChurnRadar from "./ChurnRadar";
import Analysis360 from "./Analysis360";
import AdvancedAutomations from "./AdvancedAutomations";
import WeeklyRecommendations from "./WeeklyRecommendations";
import ROITracker from "./ROITracker";
import IncludedPlans from "./IncludedPlans";
import IntegrationsPanel from "./IntegrationsPanel";

const navItems = [
  { id: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
  { id: "optimization", label: "Optimisation continue", icon: RefreshCw },
  { id: "churn", label: "Radar Churn", icon: AlertTriangle },
  { id: "analysis", label: "Analyse 360°", icon: BarChart3 },
  { id: "automations", label: "Automatisations", icon: Bot },
  { id: "recommendations", label: "Recommandations IA", icon: Lightbulb },
  { id: "roi", label: "Suivi ROI", icon: DollarSign },
  { id: "team", label: "Équipe", icon: Users, badge: "Illimité" },
  { id: "integrations", label: "Intégrations CRM", icon: Link2 },
  { id: "growthpilot", label: "GrowthPilot", icon: Plane },
  { id: "datadiag", label: "DataDiag", icon: TrendingUp },
];

const LoyaltyLoopDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(`ll-${id}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#0d0d0f" }}>
      {/* Floating particles (CSS) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#f0c040]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.08 + Math.random() * 0.12,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 8 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Orbital pattern overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(240,192,64,0.3) 0%, transparent 50%)`,
          backgroundSize: "600px 600px",
          backgroundPosition: "center",
        }}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 bg-[#0a0a0c] border-r border-[#f0c040]/[0.06] flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-[#f0c040]/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#f0c040]/10 border border-[#f0c040]/15 flex items-center justify-center">
              <span className="text-sm">♾️</span>
            </div>
            <span className="text-sm font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "#f0c040" }}>
              LoyaltyLoop
            </span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 relative ${
                  active
                    ? "text-[#f0c040] bg-[#f0c040]/[0.06]"
                    : "text-white/35 hover:text-white/60 hover:bg-white/[0.02]"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="ll-sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#f0c040]"
                    style={{ boxShadow: "0 0 8px rgba(240,192,64,0.3)" }}
                  />
                )}
                <item.icon className="w-4 h-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-[#f0c040]/10 text-[#f0c040]/70 font-semibold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[#f0c040]/[0.06]">
          <div className="rounded-xl bg-[#f0c040]/[0.04] border border-[#f0c040]/10 p-3">
            <p className="text-xs font-semibold text-white/70" style={{ fontFamily: "'Playfair Display', serif" }}>Premium</p>
            <p className="text-[10px] text-white/25">349€/mois</p>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/70 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <main className="flex-1 lg:ml-60 relative z-10">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-20 bg-[#0d0d0f]/90 backdrop-blur-xl border-b border-[#f0c040]/[0.06] px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="text-white/50 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "#f0c040" }}>
            LoyaltyLoop
          </span>
        </div>

        <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
          {/* Gold divider helper */}
          <div id="ll-overview"><CommandCenterHeader /></div>

          <div className="h-px bg-gradient-to-r from-transparent via-[#f0c040]/20 to-transparent" />

          <div id="ll-optimization"><OrbitalViz /></div>

          <div className="h-px bg-gradient-to-r from-transparent via-[#f0c040]/20 to-transparent" />

          <div id="ll-churn"><ChurnRadar /></div>

          <div className="h-px bg-gradient-to-r from-transparent via-[#f0c040]/20 to-transparent" />

          <div id="ll-analysis"><Analysis360 /></div>

          <div className="h-px bg-gradient-to-r from-transparent via-[#f0c040]/20 to-transparent" />

          <div id="ll-automations"><AdvancedAutomations /></div>

          <div className="h-px bg-gradient-to-r from-transparent via-[#f0c040]/20 to-transparent" />

          <div id="ll-recommendations"><WeeklyRecommendations /></div>

          <div className="h-px bg-gradient-to-r from-transparent via-[#f0c040]/20 to-transparent" />

          <div id="ll-roi"><ROITracker /></div>

          <div className="h-px bg-gradient-to-r from-transparent via-[#f0c040]/20 to-transparent" />

          <div id="ll-integrations"><IntegrationsPanel /></div>

          <div className="h-px bg-gradient-to-r from-transparent via-[#f0c040]/20 to-transparent" />

          <div id="ll-growthpilot"><div id="ll-datadiag"><IncludedPlans /></div></div>

          <div id="ll-team" />
        </div>
      </main>
    </div>
  );
};

export default LoyaltyLoopDashboard;
