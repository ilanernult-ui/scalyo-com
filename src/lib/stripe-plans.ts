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
    tagline: "Diagnostic & visibilité",
    accent: "hsl(211, 100%, 45%)",
    features: [
      "Analyse données financières",
      "Rapport de diagnostic mensuel",
      "Détection automatique des anomalies",
      "Dashboard KPIs essentiel",
      "Alertes automatiques email",
    ],
  },
  growthpilot: {
    name: "GrowthPilot",
    priceId: "price_1TDCKNCJMZSEsUDpAaWZWQc1",
    productId: "prod_UBZT1MrAufTdsD",
    monthly: 189,
    tagline: "Croissance & recommandations IA",
    accent: "hsl(142, 69%, 49%)",
    features: [
      "Tout DataDiag inclus",
      "Plan d'action IA personnalisé",
      "Analyse ventes et taux de conversion",
      "Détection des opportunités de croissance",
      "Rapport de performance hebdomadaire",
    ],
  },
  loyaltyloop: {
    name: "LoyaltyLoop",
    priceId: "price_1TDCKfCJMZSEsUDpYtJ41vpE",
    productId: "prod_UBZTdDuYqxEXVq",
    monthly: 349,
    tagline: "Fidélisation & performance totale",
    accent: "hsl(262, 60%, 55%)",
    features: [
      "Tout GrowthPilot inclus",
      "Prédiction et analyse du churn",
      "Stratégies de rétention automatisées",
      "Suivi clients en temps réel 360°",
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
