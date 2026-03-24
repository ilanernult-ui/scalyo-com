import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Activity, Rocket, Heart, Settings, LogOut, Menu,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import scalyoLogo from "@/assets/scalyo-logo.png";
import { useAuth } from "@/contexts/AuthContext";

export const navItems = [
  { icon: LayoutDashboard, label: "Vue d'ensemble", id: "overview" },
  { icon: Activity, label: "DataDiag", id: "datadiag" },
  { icon: Rocket, label: "GrowthPilot", id: "growthpilot" },
  { icon: Heart, label: "LoyaltyLoop", id: "loyaltyloop" },
  { icon: Settings, label: "Paramètres", id: "settings" },
];

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const DashboardSidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }: Props) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-background border-r border-border flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
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
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === item.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-foreground/10 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </>
  );
};

export default DashboardSidebar;
