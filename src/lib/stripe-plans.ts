import type { PlanType } from "@/contexts/AuthContext";

export const STRIPE_PLANS: Record<PlanType, {
  name: string;
  priceId: string;
  productId: string;
  monthly: number;
  tagline: string;
  features: string[];
  accent: string;
}> = {
  datadiag: {
    name: "DataDiag",
    priceId: "price_1TDCK5CJMZSEsUDpnZsWuZ8K",
    productId: "prod_UBZTlbbO4BaYmV",
    monthly: 79,
    tagline: "Diagnostic business complet en 48h",
    accent: "hsl(211, 100%, 45%)",
    features: [
      "Score Business 360° (Rentabilité · Efficacité · Croissance)",
      "Détection des pertes d'argent et de temps",
      "Top 5 actions rapides à impact immédiat",
      "Estimation « vous perdez X€/mois »",
      "Dashboard KPIs en temps réel",
      "Rapport IA mensuel",
    ],
  },
  growthpilot: {
    name: "GrowthPilot",
    priceId: "price_1TDCKNCJMZSEsUDpAaWZWQc1",
    productId: "prod_UBZT1MrAufTdsD",
    monthly: 189,
    tagline: "Co-pilote IA · +15% de croissance · +10h/semaine",
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
    name: "LoyaltyLoop",
    priceId: "price_1TDCKfCJMZSEsUDpYtJ41vpE",
    productId: "prod_UBZTdDuYqxEXVq",
    monthly: 349,
    tagline: "Transformation business complète · +25% de croissance",
    accent: "hsl(262, 60%, 55%)",
    features: [
      "Tout GrowthPilot inclus",
      "Optimisation continue automatique chaque semaine",
      "Nouvelles recommandations hebdomadaires",
      "Suivi des résultats & ROI en temps réel",
      "Automatisations avancées prêtes à déployer",
      "Analyse 360° : clients + croissance + rentabilité",
      "Prédiction du churn & stratégies de rétention",
      "Intégrations CRM avancées · Utilisateurs illimités",
    ],
  },
};

export const PRODUCT_TO_PLAN: Record<string, PlanType> = {
  "prod_UBZTlbbO4BaYmV": "datadiag",
  "prod_UBZT1MrAufTdsD": "growthpilot",
  "prod_UBZTdDuYqxEXVq": "loyaltyloop",
};
