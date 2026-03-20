import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, LogOut, Activity, Rocket, Heart, Lock } from "lucide-react";
import { useAuth, PlanType } from "@/contexts/AuthContext";
import DataDiagTab from "@/components/dashboard/DataDiagTab";
import GrowthPilotTab from "@/components/dashboard/GrowthPilotTab";
import LoyaltyLoopTab from "@/components/dashboard/LoyaltyLoopTab";
import LockedTabOverlay from "@/components/dashboard/LockedTabOverlay";
import UpgradeModal from "@/components/dashboard/UpgradeModal";

const tabs = [
  { id: "datadiag", label: "DataDiag", icon: Activity, accent: "hsl(211, 100%, 45%)", minPlan: "datadiag" as PlanType },
  { id: "growthpilot", label: "GrowthPilot", icon: Rocket, accent: "hsl(142, 69%, 49%)", minPlan: "growthpilot" as PlanType },
  { id: "loyaltyloop", label: "LoyaltyLoop", icon: Heart, accent: "hsl(262, 60%, 55%)", minPlan: "loyaltyloop" as PlanType },
] as const;

const planHierarchy: Record<PlanType, number> = { datadiag: 0, growthpilot: 1, loyaltyloop: 2 };

const hasAccess = (userPlan: PlanType, requiredPlan: PlanType) =>
  planHierarchy[userPlan] >= planHierarchy[requiredPlan];

const Dashboard = () => {
  const { plan, user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("datadiag");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [upgradeTarget, setUpgradeTarget] = useState<PlanType | null>(null);

  const userPlan = plan ?? "datadiag";
  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  const renderTab = () => {
    const tab = tabs.find((t) => t.id === activeTab);
    if (!tab) return null;

    const tabContent = (() => {
      switch (activeTab) {
        case "datadiag": return <DataDiagTab />;
        case "growthpilot": return <GrowthPilotTab />;
        case "loyaltyloop": return <LoyaltyLoopTab />;
        default: return null;
      }
    })();

    if (!hasAccess(userPlan, tab.minPlan)) {
      return (
        <LockedTabOverlay
          requiredPlan={tab.minPlan}
          onUpgrade={() => setUpgradeTarget(tab.minPlan)}
        >
          {tabContent}
        </LockedTabOverlay>
      );
    }

    return tabContent;
  };

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
          {tabs.map((tab) => {
            const locked = !hasAccess(userPlan, tab.minPlan);
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  locked
                    ? "text-muted-foreground/50"
                    : activeTab === tab.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                style={!locked && activeTab === tab.id ? { backgroundColor: `${tab.accent}12`, color: tab.accent } : undefined}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                {locked && <Lock className="h-3 w-3 ml-auto text-muted-foreground/40" />}
              </button>
            );
          })}
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
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground capitalize hidden sm:block">
              Plan {userPlan === "datadiag" ? "DataDiag" : userPlan === "growthpilot" ? "GrowthPilot" : "LoyaltyLoop"}
            </span>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">{initials}</span>
            </div>
          </div>
        </header>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="p-6"
        >
          {renderTab()}
        </motion.div>
      </main>

      <UpgradeModal
        open={!!upgradeTarget}
        onOpenChange={(open) => !open && setUpgradeTarget(null)}
        targetPlan={upgradeTarget ?? "growthpilot"}
      />
    </div>
  );
};

export default Dashboard;
