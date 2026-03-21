import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, LogOut, Activity, Rocket, Heart, Lock, Settings } from "lucide-react";
import { useAuth, PlanType } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DataDiagTab from "@/components/dashboard/DataDiagTab";
import GrowthPilotTab from "@/components/dashboard/GrowthPilotTab";
import LoyaltyLoopTab from "@/components/dashboard/LoyaltyLoopTab";
import LockedTabOverlay from "@/components/dashboard/LockedTabOverlay";
import ConnectDataWizard from "@/components/dashboard/ConnectDataWizard";
import SettingsTab from "@/components/dashboard/SettingsTab";
import { useToast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";

const tabs = [
  { id: "datadiag", label: "DataDiag", icon: Activity, accent: "hsl(211, 100%, 45%)", minPlan: "datadiag" as PlanType },
  { id: "growthpilot", label: "GrowthPilot", icon: Rocket, accent: "hsl(142, 69%, 49%)", minPlan: "growthpilot" as PlanType },
  { id: "loyaltyloop", label: "LoyaltyLoop", icon: Heart, accent: "hsl(262, 60%, 55%)", minPlan: "loyaltyloop" as PlanType },
  { id: "settings", label: "Paramètres", icon: Settings, accent: "hsl(240, 4%, 44%)", minPlan: "datadiag" as PlanType },
] as const;

const planHierarchy: Record<PlanType, number> = { datadiag: 0, growthpilot: 1, loyaltyloop: 2 };

const hasAccess = (userPlan: PlanType, requiredPlan: PlanType) =>
  planHierarchy[userPlan] >= planHierarchy[requiredPlan];

const Dashboard = () => {
  const { plan, user, signOut, refreshSubscription } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("datadiag");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [dataConnected, setDataConnected] = useState(false);
  const [aiResults, setAiResults] = useState<Record<string, Json>>({});

  const userPlan = plan;
  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  // Handle checkout success
  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      toast({ title: "Votre plan a été activé avec succès ! 🎉" });
      refreshSubscription();
    }
  }, [searchParams]);

  const loadAiResults = useCallback(async () => {
    if (!user?.id) return;
    const { data } = await supabase
      .from("ai_results")
      .select("service, results")
      .eq("user_id", user.id);
    if (data) {
      const map: Record<string, Json> = {};
      data.forEach((r) => { map[r.service] = r.results; });
      setAiResults(map);
    }
  }, [user?.id]);

  // Check if user has connected data + load AI results
  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from("company_data")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setDataConnected(true);
      });
    loadAiResults();
  }, [user?.id, loadAiResults]);

  const handleWizardComplete = () => {
    setDataConnected(true);
    loadAiResults();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const renderTab = () => {
    if (activeTab === "settings") {
      return <SettingsTab />;
    }

    const tab = tabs.find((t) => t.id === activeTab);
    if (!tab) return null;

    const handleConnect = () => setWizardOpen(true);
    const tabContent = (() => {
      switch (activeTab) {
        case "datadiag": return <DataDiagTab onConnect={handleConnect} dataConnected={dataConnected} aiResults={aiResults["datadiag"]} />;
        case "growthpilot": return <GrowthPilotTab onConnect={handleConnect} dataConnected={dataConnected} aiResults={aiResults["growthpilot"]} />;
        case "loyaltyloop": return <LoyaltyLoopTab onConnect={handleConnect} dataConnected={dataConnected} aiResults={aiResults["loyaltyloop"]} />;
        default: return null;
      }
    })();

    if (!hasAccess(userPlan, tab.minPlan)) {
      return (
        <LockedTabOverlay
          requiredPlan={tab.minPlan}
          onUpgrade={() => navigate("/tarifs")}
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
            const locked = tab.id !== "settings" && !hasAccess(userPlan, tab.minPlan);
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (locked) {
                    navigate("/tarifs");
                    return;
                  }
                  setActiveTab(tab.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  locked
                    ? "text-muted-foreground/50 cursor-pointer"
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
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200 w-full"
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </button>
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

      {user?.id && (
        <ConnectDataWizard
          open={wizardOpen}
          onOpenChange={setWizardOpen}
          plan={userPlan}
          userId={user.id}
          onComplete={handleWizardComplete}
        />
      )}
    </div>
  );
};

export default Dashboard;
