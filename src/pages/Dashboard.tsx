import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, LogOut, Activity, Rocket, Heart, X } from "lucide-react";
import DataDiagTab from "@/components/dashboard/DataDiagTab";
import GrowthPilotTab from "@/components/dashboard/GrowthPilotTab";
import LoyaltyLoopTab from "@/components/dashboard/LoyaltyLoopTab";

const tabs = [
  { id: "datadiag", label: "DataDiag", icon: Activity, accent: "hsl(211, 100%, 45%)" },
  { id: "growthpilot", label: "GrowthPilot", icon: Rocket, accent: "hsl(142, 69%, 49%)" },
  { id: "loyaltyloop", label: "LoyaltyLoop", icon: Heart, accent: "hsl(262, 60%, 55%)" },
] as const;

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("datadiag");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-background border-r border-border flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className="text-base font-semibold text-foreground tracking-tight">OptimAI</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
              style={activeTab === tab.id ? { backgroundColor: `${tab.accent}12`, color: tab.accent } : undefined}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            Retour au site
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-foreground/10 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <main className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-20 bg-background/85 backdrop-blur-xl border-b border-border px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-foreground" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold text-foreground tracking-tight">
              {tabs.find((t) => t.id === activeTab)?.label ?? "Dashboard"}
            </h1>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">JD</span>
          </div>
        </header>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="p-6"
        >
          {activeTab === "datadiag" && <DataDiagTab />}
          {activeTab === "growthpilot" && <GrowthPilotTab />}
          {activeTab === "loyaltyloop" && <LoyaltyLoopTab />}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
