

## Plan : Mettre à jour les pages Services et FeaturesSection avec le contenu repositionné

### Problème
Les données des services dans `Services.tsx` et `FeaturesSection.tsx` utilisent les anciennes descriptions, incohérentes avec le positionnement défini dans `stripe-plans.ts`.

### Fichiers à modifier

**1. `src/pages/Services.tsx`** — Réécrire le tableau `services` :

- **DataDiag** : title → "Diagnostic Business 360°", description → axée pertes d'argent/temps, features → Score Business 360°, Détection pertes d'argent, Détection pertes de temps, Top 5 actions rapides, Estimation "vous perdez X€/mois", Dashboard KPIs temps réel, Rapport IA mensuel. FAQ et cas concrets mis à jour.

- **GrowthPilot** : title → "Co-pilote IA de croissance", description → plan d'action priorisé ROI + automatisations, features → Tout DataDiag inclus, Plan d'action PRIORISÉ par ROI hebdo, Quick wins avec gains estimés en €, Automatisations recommandées (+10h/semaine), Analyse ventes & tunnel de conversion, IA qui explique le COMMENT pas-à-pas, Suivi d'impact temps réel. Tagline "+15% de croissance · +10h/semaine".

- **LoyaltyLoop** : title → "Transformation Business Complète", description → optimisation continue + résultats mesurables, features → Tout GrowthPilot inclus, Optimisation continue automatique, Recommandations hebdomadaires, Suivi résultats & ROI temps réel, Automatisations avancées, Analyse 360°, Prédiction churn & rétention, Intégrations CRM avancées. Tagline "+25% de croissance".

**2. `src/components/landing/FeaturesSection.tsx`** — Mettre à jour les descriptions courtes des 3 services pour correspondre au nouveau positionnement.

### Principe
Aligner toutes les descriptions sur le contenu de `stripe-plans.ts` pour garantir la cohérence sur l'ensemble du site.

