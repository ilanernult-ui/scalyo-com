import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Menu, LogOut, LayoutDashboard, Activity, Rocket, Heart,
  Lock, Settings, ChevronRight, Building2, Plug2, Sparkles, FileText
} from "lucide-react";
import type { PlanType } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import scalyoLogo from "@/assets/scalyo-logo.png";
import { STRIPE_PLANS } from "@/lib/stripe-plans";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import DataDiagTab from "@/components/dashboard/DataDiagTab";
import GrowthPilotTab from "@/components/dashboard/GrowthPilotTab";
import LoyaltyLoopTab from "@/components/dashboard/LoyaltyLoopTab";
import LockedTabOverlay from "@/components/dashboard/LockedTabOverlay";
import ConnectDataWizard from "@/components/dashboard/ConnectDataWizard";
import SettingsTab from "@/components/dashboard/SettingsTab";
import AssistantChat from "@/components/dashboard/AssistantChat";
import AIChatPanel from "@/components/dashboard/AIChatPanel";
import ErrorBoundary from "@/components/ErrorBoundary";
import CompanyProfileTab from "@/components/company/CompanyProfileTab";
import DataConnectorsTab from "@/components/connectors/DataConnectorsTab";
import RecommendationsTab from "@/components/dashboard/RecommendationsTab";
import ReportsTab from "@/components/dashboard/ReportsTab";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useAiGeneration } from "@/hooks/useAiGeneration";
import { useDashboardEnrichment } from "@/hooks/useDashboardEnrichment";
import NotificationsBell from "@/components/dashboard/NotificationsBell";
import { useToast } from "@/hooks/use-toast";
import { analytics } from "@/lib/analytics";

/* ── Nav structure ── */
type NavItem = { id: string; label: string; icon: React.ComponentType<{ className?: string }>; minPlan: PlanType };
type NavGroup = { section: string | null; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    section: null,
    items: [
      { id: "overview", label: "Tableau de bord", icon: LayoutDashboard, minPlan: "datadiag" },
    ],
  },
  {
    section: "Mon entreprise",
    items: [
      { id: "company", label: "Fiche entreprise", icon: Building2, minPlan: "datadiag" },
      { id: "connectors", label: "Mes données", icon: Plug2, minPlan: "datadiag" },
    ],
  },
  {
    section: "Analyses & Rapports",
    items: [
      { id: "datadiag", label: "DataDiag", icon: Activity, minPlan: "datadiag" },
      { id: "growthpilot", label: "GrowthPilot", icon: Rocket, minPlan: "growthpilot" },
      { id: "loyaltyloop", label: "LoyaltyLoop", icon: Heart, minPlan: "loyaltyloop" },
      { id: "reports", label: "Rapports PDF", icon: FileText, minPlan: "datadiag" },
    ],
  },
  {
    section: null,
    items: [
      { id: "recommendations", label: "Recommandations IA", icon: Sparkles, minPlan: "datadiag" },
    ],
  },
  {
    section: null,
    items: [
      { id: "settings", label: "Paramètres & Abonnement", icon: Settings, minPlan: "datadiag" },
    ],
  },
];

// Flat list for title lookups
const navItems = navGroups.flatMap((g) => g.items);

const planHierarchy: Record<PlanType, number> = { datadiag: 0, growthpilot: 1, loyaltyloop: 2 };
const hasAccess = (userPlan: PlanType, requiredPlan: PlanType) =>
  planHierarchy[userPlan] >= planHierarchy[requiredPlan];

const planLabels: Record<PlanType, string> = { datadiag: "DataDiag", growthpilot: "GrowthPilot", loyaltyloop: "LoyaltyLoop" };

const Dashboard = () => {
  const { plan, user, signOut, refreshSubscription, stripeSubscriptionId } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<string>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [sendReportPrompt, setSendReportPrompt] = useState<((message: string) => Promise<string | null>) | null>(null);

  const userPlan = plan;
  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  const planConfig = STRIPE_PLANS[userPlan];
  const hasPaid = !!stripeSubscriptionId;

  const { companyData, dataConnected, aiResults, loadAiResults, onWizardComplete } = useDashboardData(user?.id);
  const { generatingAnalysis, generate } = useAiGeneration();
  const { problems, losses, savings, notifications, unreadCount, error: enrichmentError, reload: reloadEnrichment, markAllNotificationsRead } = useDashboardEnrichment(user?.id);

  useEffect(() => {
    if (enrichmentError) {
      console.warn("[Dashboard] enrichment error:", enrichmentError);
    }
  }, [enrichmentError]);

  /* ── Scroll to top on tab change ── */
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    }, 0);
  }, [activeTab]);

  /* ── Checkout success ── */
  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      toast({ title: "Votre plan a été activé avec succès ! 🎉" });
      refreshSubscription();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleWizardComplete = onWizardComplete;

  const logScrollableElements = () => {
    if (typeof window === "undefined") return;
    const candidates = Array.from(document.querySelectorAll<HTMLElement>(
      '[class*="overflow-y-auto"], [class*="overflow-y-scroll"]'
    ));
    console.log("[Dashboard] scrollable candidates:", candidates.length);
    candidates.forEach((el, index) => {
      console.log(
        `[Dashboard] scrollable #${index}:`,
        el.tagName,
        el.id ? `id=${el.id}` : null,
        el.className,
        { scrollTop: el.scrollTop, scrollHeight: el.scrollHeight, clientHeight: el.clientHeight }
      );
    });
  };

  const handleGenerate = async () => {
    if (!user?.id) return;
    const { ok, message } = await generate(user.id, userPlan, companyData, loadAiResults);
    if (ok) {
      toast({ title: "Analyse terminée ! 🎉", description: "Consultez vos résultats dans les onglets dédiés." });
    } else {
      toast({ title: "Erreur", description: message, variant: "destructive" });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  /* ── Render active tab content ── */
  const renderTab = () => {
    const handleConnect = () => setWizardOpen(true);

    if (activeTab === "overview") {
      return (
        <DashboardOverview
          plan={userPlan}
          dataConnected={dataConnected}
          companyData={companyData}
          onConnect={handleConnect}
          onGenerate={handleGenerate}
          generatingAnalysis={generatingAnalysis}
          problems={problems}
          losses={losses}
          savings={savings}
        />
      );
    }

    if (activeTab === "settings") return <SettingsTab />;

    if (activeTab === "recommendations") {
      return (
        <ErrorBoundary name="recommendations">
          <RecommendationsTab />
        </ErrorBoundary>
      );
    }

    if (activeTab === "reports") {
      return (
        <ErrorBoundary name="reports">
          <ReportsTab companyData={companyData} />
        </ErrorBoundary>
      );
    }

    if (activeTab === "company") {
      return (
        <ErrorBoundary name="company-profile">
          <CompanyProfileTab companyData={companyData} aiResults={aiResults} />
        </ErrorBoundary>
      );
    }

    if (activeTab === "connectors") {
      return (
        <ErrorBoundary name="connectors">
          <DataConnectorsTab />
        </ErrorBoundary>
      );
    }

    const nav = navItems.find((t) => t.id === activeTab);
    if (!nav) return null;

    const tabContent = (() => {
      switch (activeTab) {
        case "datadiag": return <ErrorBoundary name="datadiag"><DataDiagTab onConnect={handleConnect} dataConnected={dataConnected} aiResults={aiResults["datadiag"]} companyData={companyData} /></ErrorBoundary>;
        case "growthpilot": return <ErrorBoundary name="growthpilot"><GrowthPilotTab onConnect={handleConnect} dataConnected={dataConnected} aiResults={aiResults["growthpilot"]} /></ErrorBoundary>;
        case "loyaltyloop": return <ErrorBoundary name="loyaltyloop"><LoyaltyLoopTab onConnect={handleConnect} dataConnected={dataConnected} aiResults={aiResults["loyaltyloop"]} /></ErrorBoundary>;
        default: return null;
      }
    })();

    if (!hasAccess(userPlan, nav.minPlan)) {
      return (
        <LockedTabOverlay requiredPlan={nav.minPlan} onUpgrade={() => navigate("/tarifs")}>
          {tabContent}
        </LockedTabOverlay>
      );
    }

    return tabContent;
  };

  const renderAssistant = () => {
    if (activeTab === "reports") {
      return <AIChatPanel activeTab={activeTab} userInitials={initials} plan={userPlan} onRegisterSendMessage={setSendReportPrompt} />;
    }

    const assistantConfig = {
      dashboard: {
        accentColor: "#7c3aed",
        name: "Assistant Scalyo IA",
        subtitle: "Votre assistant business personnel",
        welcomeMessage:
          "Bonjour 👋 Je suis votre assistant Scalyo. Je peux analyser vos données, générer des insights et vous aider à piloter votre business. Que souhaitez-vous explorer ?",
        quickButtons: [
          { label: "📊 Analyser mes données", action: "📊 Analyser mes données" },
          { label: "💡 Recommandations", action: "💡 Recommandations" },
          { label: "📈 Voir ma progression", action: "📈 Voir ma progression" },
        ],
      },
      datadiag: {
        accentColor: "#00D4FF",
        name: "Expert Diagnostic DataDiag",
        subtitle: "Analyse de santé business en 48h",
        welcomeMessage:
          "Bonjour 👋 Je suis votre expert en diagnostic business. Je détecte vos pertes cachées, analyse votre santé financière et identifie vos axes d'amélioration prioritaires.",
        quickButtons: [
          { label: "🔍 Détecter mes pertes", action: "🔍 Détecter mes pertes" },
          { label: "💊 Santé financière", action: "💊 Santé financière" },
          { label: "⚡ Actions prioritaires", action: "⚡ Actions prioritaires" },
        ],
      },
      growthpilot: {
        accentColor: "#00FF88",
        name: "Co-pilote GrowthPilot IA",
        subtitle: "Votre co-pilote vers +15% de croissance",
        welcomeMessage:
          "Bonjour 👋 Je suis votre co-pilote IA. Mon objectif : vous faire atteindre +15% de croissance et économiser +10h par semaine grâce à l'automatisation IA.",
        quickButtons: [
          { label: "🚀 Accélérer ma croissance", action: "🚀 Accélérer ma croissance" },
          { label: "⏱️ Gagner du temps", action: "⏱️ Gagner du temps" },
          { label: "📊 Mes performances", action: "📊 Mes performances" },
        ],
      },
      loyaltyloop: {
        accentColor: "#FFD700",
        name: "Expert LoyaltyLoop IA",
        subtitle: "Rétention clients & réduction churn",
        welcomeMessage:
          "Bonjour 👋 Je suis votre expert en fidélisation client. Je surveille votre churn, identifie vos clients à risque et optimise votre rétention pour atteindre -40% de churn.",
        quickButtons: [
          { label: "❤️ Clients à risque", action: "❤️ Clients à risque" },
          { label: "📉 Réduire mon churn", action: "📉 Réduire mon churn" },
          { label: "⭐ Clients VIP", action: "⭐ Clients VIP" },
        ],
      },
    };

    const context = (activeTab === "datadiag" || activeTab === "growthpilot" || activeTab === "loyaltyloop") ? activeTab : "dashboard";
    const config = assistantConfig[context];

    return (
      <AssistantChat
        context={context as any}
        accentColor={config.accentColor}
        name={config.name}
        subtitle={config.subtitle}
        welcomeMessage={config.welcomeMessage}
        quickButtons={config.quickButtons}
        userInitials={initials}
        plan={userPlan}
      />
    );
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-border">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={scalyoLogo} alt="Scalyo" className="h-8 w-8 object-contain" />
            <span className="text-base font-semibold text-foreground tracking-tight">Scalyo</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 overflow-y-auto space-y-1">
          {navGroups.map((group, gi) => (
            <div key={gi} className={gi > 0 ? "pt-1" : ""}>
              {group.section && (
                <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider px-3.5 py-1.5">
                  {group.section}
                </p>
              )}
              {group.items.map((item) => {
                const locked = item.id !== "overview" && item.id !== "settings" && !hasAccess(userPlan, item.minPlan);
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (locked) {
                        analytics.track("upgrade_clicked", { from_tab: item.id, plan: userPlan });
                        setTimeout(() => window.scrollTo({ top: 0, behavior: "instant" }), 0);
                        const scrollContainer = document.getElementById("main-content");
                        if (scrollContainer) scrollContainer.scrollTop = 0;
                        navigate("/tarifs");
                        return;
                      }
                      logScrollableElements();
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                      document.getElementById("main-content")?.scrollTo({ top: 0, behavior: "instant" });
                      if (contentRef.current) contentRef.current.scrollTop = 0;
                      analytics.track("tab_viewed", { tab: item.id, plan: userPlan });
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      locked
                        ? "text-muted-foreground/40 cursor-pointer"
                        : isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {locked && <Lock className="h-3 w-3 text-muted-foreground/30" />}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Plan badge */}
        <div className="p-3 border-t border-border space-y-2">
          <div className="rounded-xl bg-primary/5 border border-primary/15 p-3">
            <p className="text-sm font-semibold text-foreground">{planLabels[userPlan]}</p>
            <p className="text-[11px] text-muted-foreground">
              {planConfig.monthly}€/mois{hasPaid ? "" : " · Essai"}
            </p>
            <button
              onClick={() => navigate("/tarifs")}
              className="text-[11px] font-medium text-primary hover:underline mt-1 flex items-center gap-0.5"
            >
              Changer de plan <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all w-full"
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

      {/* ── Main ── */}
      <main id="main-content" ref={contentRef} className="flex-1 lg:ml-64 min-h-0 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-background/85 backdrop-blur-xl border-b border-border px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-foreground" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold text-foreground tracking-tight">
              {navItems.find((t) => t.id === activeTab)?.label ?? "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:block">
              Plan {planLabels[userPlan]}
            </span>
            <NotificationsBell
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkAllRead={markAllNotificationsRead}
            />
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">{initials}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="p-4 sm:p-6"
        >
          {enrichmentError && (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-center justify-between gap-3 text-sm">
              <span className="text-amber-900">{enrichmentError}</span>
              <button
                onClick={() => reloadEnrichment()}
                className="text-xs font-semibold text-amber-900 underline underline-offset-2 hover:text-amber-700"
              >
                Recharger
              </button>
            </div>
          )}
          <div className="flex flex-col xl:flex-row gap-5">
            <div className="flex-1 min-w-0">
              {renderTab()}
            </div>
            {activeTab !== "settings" && (
              <div
                id={activeTab === "reports" ? "reports-chat" : undefined}
                className={`w-full xl:w-auto ${activeTab === "reports" ? "xl:sticky xl:top-24 xl:self-start" : ""}`}
              >
                {renderAssistant()}
              </div>
            )}
          </div>
        </motion.div>
      </main>

      {/* Connect data wizard */}
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
