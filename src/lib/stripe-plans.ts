import type { PlanType } from "@/contexts/AuthContext";

export const STRIPE_PLANS: Record<PlanType, {
  name: string;
  priceId: string;
  productId: string;
  monthly: number;
  tagline: string;
  description: string;
  bottomTagline: string;
  features: string[];
  accent: string;
}> = {
  datadiag: {
    name: "Analyse & Diagnostic",
    priceId: "price_1TDCK5CJMZSEsUDpnZsWuZ8K",
    productId: "prod_UBZTlbbO4BaYmV",
    monthly: 79,
    tagline: "Comprenez où vous perdez de l'argent",
    description: "Obtenez une vue claire de votre rentabilité. Identifiez vos points faibles, suivez vos indicateurs clés et recevez chaque mois un rapport IA avec les actions prioritaires.",
    bottomTagline: "Pour les entreprises qui veulent comprendre leurs chiffres",
    accent: "hsl(211, 100%, 45%)",
    features: [
      "Score Business 360° (Rentabilité · Efficacité · Croissance)",
      "Détection des pertes d'argent et de temps",
      "Top 5 actions rapides à impact immédiat",
      "Estimation « vous perdez X€/mois »",
      "Dashboard KPIs en temps réel",
      "Rapport IA mensuel",
      "Fiche entreprise personnalisée",
      "Connexion de vos données (CSV, Excel, API)",
      "Assistant IA Scalyo",
    ],
  },
  growthpilot: {
    name: "Croissance & Performance",
    priceId: "price_1TDCKNCJMZSEsUDpAaWZWQc1",
    productId: "prod_UBZT1MrAufTdsD",
    monthly: 189,
    tagline: "Développez votre chiffre d'affaires avec l'IA",
    description: "Passez à l'action avec un plan de croissance personnalisé. Chaque semaine, l'IA identifie vos meilleures opportunités et vous dit exactement quoi faire pour augmenter vos revenus.",
    bottomTagline: "Pour les entreprises qui veulent accélérer leur croissance",
    accent: "hsl(142, 69%, 49%)",
    features: [
      "Tout DataDiag inclus",
      "Plan d'action PRIORISÉ par ROI chaque semaine",
      "Quick wins immédiats avec gains estimés en €",
      "Automatisations recommandées (+10h/semaine)",
      "Analyse ventes & tunnel de conversion",
      "IA qui explique le COMMENT pas-à-pas",
      "Suivi d'impact en temps réel",
    ],
  },
  loyaltyloop: {
    name: "Fidélisation & Rétention",
    priceId: "price_1TDCKfCJMZSEsUDpYtJ41vpE",
    productId: "prod_UBZTdDuYqxEXVq",
    monthly: 349,
    tagline: "Gardez vos clients et augmentez leur valeur",
    description: "Détectez vos clients sur le point de partir avant qu'il soit trop tard. Suivez leur satisfaction, automatisez vos actions de fidélisation et maximisez la valeur de chaque client sur le long terme.",
    bottomTagline: "Pour les entreprises qui veulent fidéliser et rentabiliser leur clientèle",
    accent: "hsl(262, 60%, 55%)",
    features: [
      "Tout GrowthPilot inclus",
      "Radar Churn & stratégies de rétention client",
      "Automatisations avancées prêtes à déployer",
      "Analyse 360° : clients + croissance + rentabilité",
      "Optimisation continue & recommandations hebdomadaires",
      "Suivi ROI cumulé en temps réel",
      "Intégrations CRM avancées",
      "Utilisateurs illimités",
    ],
  },
};

export const PRODUCT_TO_PLAN: Record<string, PlanType> = {
  "prod_UBZTlbbO4BaYmV": "datadiag",
  "prod_UBZT1MrAufTdsD": "growthpilot",
  "prod_UBZTdDuYqxEXVq": "loyaltyloop",
};
