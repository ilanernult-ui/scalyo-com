export type ConnectorStatus = "pending" | "connected" | "error" | "disconnected";
export type SyncFrequency = "realtime" | "daily" | "weekly";

export interface DataConnector {
  id: string;
  user_id: string;
  connector_id: ConnectorKey;
  status: ConnectorStatus;
  config: Record<string, unknown>;
  last_sync_at: string | null;
  sync_error: string | null;
  frequency: SyncFrequency;
  created_at: string;
  updated_at: string;
}

export type ConnectorKey =
  | "google_analytics"
  | "google_search_console"
  | "stripe"
  | "paypal"
  | "hubspot"
  | "pipedrive"
  | "facebook_ads"
  | "google_ads"
  | "instagram"
  | "linkedin"
  | "shopify"
  | "woocommerce"
  | "csv_upload";

export interface ConnectorDefinition {
  id: ConnectorKey;
  name: string;
  description: string;
  category: "analytics" | "revenue" | "crm" | "advertising" | "social" | "ecommerce" | "manual";
  logo: string;          // emoji or URL
  authType: "oauth" | "apikey" | "upload";
  minPlan: "datadiag" | "growthpilot" | "loyaltyloop";
  docsUrl?: string;
}

export const CONNECTOR_DEFINITIONS: ConnectorDefinition[] = [
  {
    id: "csv_upload",
    name: "Import CSV",
    description: "Importez n'importe quel fichier CSV ou Excel",
    category: "manual",
    logo: "📄",
    authType: "upload",
    minPlan: "datadiag",
  },
  {
    id: "google_analytics",
    name: "Google Analytics 4",
    description: "Trafic web, sessions, conversions",
    category: "analytics",
    logo: "📊",
    authType: "oauth",
    minPlan: "datadiag",
  },
  {
    id: "google_search_console",
    name: "Google Search Console",
    description: "Positions SEO, clics, impressions",
    category: "analytics",
    logo: "🔍",
    authType: "oauth",
    minPlan: "growthpilot",
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Revenus, abonnements, paiements",
    category: "revenue",
    logo: "💳",
    authType: "apikey",
    minPlan: "datadiag",
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Transactions et revenus PayPal",
    category: "revenue",
    logo: "🅿️",
    authType: "oauth",
    minPlan: "growthpilot",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "CRM, pipeline commercial, contacts",
    category: "crm",
    logo: "🟠",
    authType: "oauth",
    minPlan: "growthpilot",
  },
  {
    id: "pipedrive",
    name: "Pipedrive",
    description: "Pipeline commercial et deals",
    category: "crm",
    logo: "🟢",
    authType: "oauth",
    minPlan: "growthpilot",
  },
  {
    id: "facebook_ads",
    name: "Facebook Ads",
    description: "Performances publicités Meta",
    category: "advertising",
    logo: "📘",
    authType: "oauth",
    minPlan: "growthpilot",
  },
  {
    id: "google_ads",
    name: "Google Ads",
    description: "Campagnes Search, Display, Shopping",
    category: "advertising",
    logo: "🎯",
    authType: "oauth",
    minPlan: "growthpilot",
  },
  {
    id: "instagram",
    name: "Instagram",
    description: "Engagement, portée, followers",
    category: "social",
    logo: "📸",
    authType: "oauth",
    minPlan: "growthpilot",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    description: "Analytics de la page entreprise",
    category: "social",
    logo: "💼",
    authType: "oauth",
    minPlan: "growthpilot",
  },
  {
    id: "shopify",
    name: "Shopify",
    description: "Commandes, produits, revenus e-commerce",
    category: "ecommerce",
    logo: "🛍️",
    authType: "oauth",
    minPlan: "loyaltyloop",
  },
  {
    id: "woocommerce",
    name: "WooCommerce",
    description: "Boutique WordPress e-commerce",
    category: "ecommerce",
    logo: "🛒",
    authType: "apikey",
    minPlan: "loyaltyloop",
  },
];

export const CATEGORY_LABELS: Record<ConnectorDefinition["category"], string> = {
  analytics: "Analytics",
  revenue: "Revenus & Paiements",
  crm: "CRM & Commercial",
  advertising: "Publicité",
  social: "Réseaux sociaux",
  ecommerce: "E-commerce",
  manual: "Import manuel",
};
