import { useState } from "react";
import { Menu } from "lucide-react";
import DashboardSidebar, { navItems } from "@/components/dashboard/DashboardSidebar";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import EdgeFunctionPanel from "@/components/dashboard/EdgeFunctionPanel";

const sampleDataDiag = {
  donnees_financieres: {
    chiffre_affaires: 450000,
    charges: 320000,
    tresorerie: 85000,
    creances_clients: 67000,
    dettes_fournisseurs: 42000,
    marge_brute_pct: 28.9,
    periode: "Q1 2026",
  },
};

const sampleGrowthPilot = {
  profil_entreprise: {
    secteur: "SaaS B2B",
    taille: "15 salariés",
    ca_annuel: "1.8M€",
    marche: "France",
  },
  donnees_ventes: {
    leads_mensuel: 120,
    taux_conversion: 3.2,
    panier_moyen: 2400,
    cycle_vente_jours: 45,
    canal_principal: "Inbound",
  },
};

const sampleLoyaltyLoop = {
  donnees_clients: {
    nb_clients_actifs: 340,
    taux_churn_mensuel: 4.2,
    nps_score: 42,
    tickets_support_mois: 87,
    delai_reponse_moyen_h: 6,
    clients_a_risque: ["Entreprise Alpha", "Société Beta", "Groupe Gamma"],
  },
};

const tabTitles: Record<string, string> = {
  overview: "Vue d'ensemble",
  datadiag: "DataDiag",
  growthpilot: "GrowthPilot",
  loyaltyloop: "LoyaltyLoop",
  settings: "Paramètres",
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-20 bg-background/85 backdrop-blur-xl border-b border-border px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-foreground" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold text-foreground tracking-tight">
              {tabTitles[activeTab] ?? "Dashboard"}
            </h1>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">JD</span>
          </div>
        </header>

        <div className="p-6">
          {activeTab === "overview" && <DashboardOverview />}

          {activeTab === "datadiag" && (
            <EdgeFunctionPanel
              functionName="datadiag"
              title="DataDiag — Diagnostic financier IA"
              description="Envoyez vos données financières pour obtenir un audit automatisé : anomalies, KPIs, alertes et rapport mensuel."
              samplePayload={sampleDataDiag}
              responseKeys={["anomalies", "kpis", "alertes", "rapport_mensuel"]}
            />
          )}

          {activeTab === "growthpilot" && (
            <EdgeFunctionPanel
              functionName="growthpilot"
              title="GrowthPilot — Stratégie de croissance IA"
              description="Analysez vos ventes et votre profil entreprise pour recevoir un plan d'action, des opportunités et un rapport hebdomadaire."
              samplePayload={sampleGrowthPilot}
              responseKeys={["plan_action", "analyse_ventes", "opportunites", "rapport_hebdo"]}
            />
          )}

          {activeTab === "loyaltyloop" && (
            <EdgeFunctionPanel
              functionName="loyaltyloop"
              title="LoyaltyLoop — Fidélisation client IA"
              description="Soumettez vos données clients pour prédire le churn, générer des stratégies de rétention et un suivi 360°."
              samplePayload={sampleLoyaltyLoop}
              responseKeys={["prediction_churn", "strategies_retention", "suivi_360", "recommandations_crm"]}
            />
          )}

          {activeTab === "settings" && (
            <div className="apple-card !p-6">
              <h2 className="text-lg font-semibold text-foreground mb-2">Paramètres</h2>
              <p className="text-sm text-muted-foreground">Section à venir.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
