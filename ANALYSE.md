# Analyse technique — scalyo-com

> Généré le 2026-04-03

---

## Architecture générale

**Type** : SPA React avec backend Supabase (serverless)
**Stack principale** : React 18 + Vite + TypeScript + Tailwind CSS + Supabase + Stripe

```
scalyo-com/
├── src/
│   ├── pages/              # 15 pages (routing React Router v6)
│   ├── components/
│   │   ├── ui/             # 40+ composants shadcn/ui
│   │   ├── landing/        # Sections landing page
│   │   ├── dashboard/      # DataDiag, GrowthPilot, LoyaltyLoop
│   │   └── auth/           # ProtectedRoute, PlanPicker
│   ├── contexts/           # AuthContext (session + plan + stripe)
│   ├── hooks/              # Custom hooks
│   ├── integrations/       # Client Supabase + types générés
│   └── lib/                # Utilitaires
├── supabase/
│   ├── functions/          # 8 Edge Functions Deno (backend IA + paiement)
│   └── migrations/         # Schéma PostgreSQL
```

### Routing

| Route | Composant | Accès |
|-------|-----------|-------|
| `/` | Index | Public |
| `/auth` | Auth | Public |
| `/dashboard` | Dashboard | Protégé (auth) |
| `/datadiag-demo` | DataDiagDemo | Public |
| `/growthpilot-demo` | GrowthPilotDemo | Public |
| `/loyaltyloop-demo` | LoyaltyLoopDemo | Public |
| `/services` | Services | Public |
| `/services/:slug` | ServiceDetail | Public |
| `/pricing` | Pricing (EN) | Public |
| `/tarifs` | Pricing (FR) | Public |
| `/about` | About | Public |
| `/blog` | Blog | Public |
| `/contact` | Contact | Public |

### Edge Functions (Supabase/Deno)

| Fonction | Rôle |
|----------|------|
| `check-subscription` | Récupère le statut Stripe de l'utilisateur |
| `create-checkout` | Génère une session Stripe Checkout |
| `cancel-subscription` | Annule l'abonnement actif |
| `datadiag` | Analyse financière IA (OpenAI GPT-4o) |
| `growthpilot` | Stratégie de croissance IA |
| `loyaltyloop` | Analyse fidélisation client IA |
| `scalyo-chat` | Interface de chat IA |
| `stripe-webhook` | Traitement des événements Stripe |

---

## Stack technique détaillée

| Catégorie | Outil | Version |
|-----------|-------|---------|
| Framework | React | 18.3.1 |
| Bundler | Vite | 8.0.0 |
| Langage | TypeScript | 5.8.3 |
| Routing | React Router DOM | 6.30.1 |
| UI | shadcn/ui + Radix UI | — |
| Styles | Tailwind CSS | 3.4.17 |
| Animations | Framer Motion | 12.38.0 |
| Data fetching | TanStack React Query | 5.83.0 |
| Formulaires | React Hook Form + Zod | 7.61.1 / 3.25.76 |
| Backend/DB | Supabase | 2.99.3 |
| Paiements | Stripe | 8.11.0 |
| Charts | Recharts | 3.8.1 |
| Icônes | Lucide React | 0.462.0 |
| Tests unitaires | Vitest | 4.1.0 |
| Tests E2E | Playwright | 1.57.0 |
| Linting | ESLint | 9.32.0 |

---

## Points forts

### Architecture
- Stack moderne et cohérente avec des choix justifiés à chaque couche
- Edge Functions bien séparées par domaine métier
- Système de plans à 3 niveaux (datadiag → growthpilot → loyaltyloop) avec gating propre via `LockedTabOverlay`
- RLS (Row-Level Security) activé sur toutes les tables Supabase
- Validation des formulaires solide avec React Hook Form + Zod

### UI/UX
- Design system cohérent avec variables CSS HSL + utilitaires custom (`.apple-card`, `.surface`, etc.)
- shadcn/ui + Radix UI pour l'accessibilité des composants
- Framer Motion pour les animations
- Responsive mobile-first (Tailwind breakpoints)

### Paiements
- Intégration Stripe complète : checkout session, webhooks, annulation, polling d'état

---

## Faiblesses techniques

### Critique

| # | Problème | Détail |
|---|----------|--------|
| 1 | **TypeScript laxiste** | `strict: false`, `noImplicitAny: false`, `strictNullChecks: false` dans `tsconfig.app.json` |
| 2 | **Zéro tests réels** | 1 seul fichier exemple, aucune couverture sur les flux critiques |
| 3 | **Secrets mal gérés** | Clés Supabase hardcodées dans `src/integrations/supabase/client.ts`, `.env` potentiellement commité |

### Important

| # | Problème | Détail |
|---|----------|--------|
| 4 | **Pas d'Error Boundaries** | Une exception non catchée fait crasher toute l'app silencieusement |
| 5 | **SEO statique** | Meta tags identiques sur toutes les pages, pas de sitemap, pas de JSON-LD |
| 6 | **Polling naïf sur Stripe** | Vérification toutes les 60s dans le contexte global → re-renders inutiles |
| 7 | **Dashboard monolithique** | `DashboardOverview` cumule trop d'état local (activeTab, wizard, AI results, etc.) |

### Mineur

| # | Problème | Détail |
|---|----------|--------|
| 8 | **Pas de virtualisation** | Longues listes sans `react-virtual` |
| 9 | **ESLint trop permissif** | `no-unused-vars: off`, pas de pre-commit hooks (husky/lint-staged) |
| 10 | **Duplication pages prix** | `/pricing` et `/tarifs` — même contenu, pas de vraie gestion i18n |
| 11 | **robots.txt/sitemap absents** | Mauvaise indexation moteurs de recherche |

---

## Améliorations priorisées

### P0 — Sécurité & Stabilité *(à faire immédiatement)*

1. **Activer `strict: true` dans `tsconfig.app.json`** et corriger les erreurs progressivement
2. **Sortir les clés du code source** — utiliser uniquement `import.meta.env.VITE_*`, ajouter `.env` au `.gitignore`, créer un `.env.example`
3. **Ajouter des Error Boundaries** — au minimum sur le Dashboard et chaque tab IA

### P1 — Qualité & Maintenabilité

4. **Tests** — couvrir a minima : `AuthContext`, `ProtectedRoute`, les 3 tabs IA, et le flux de paiement Stripe
5. **Refactorer `DashboardOverview`** — extraire l'état dans des hooks dédiés (`useDataDiag`, `useGrowthPilot`, `useLoyaltyLoop`)
6. **ESLint strict + husky + lint-staged** — bloquer les commits non conformes

### P2 — Performance

7. **Remplacer le polling Stripe** par un listener Supabase Realtime sur la table `profiles` → zéro re-render superflu
8. **Lazy loading des tabs dashboard** — charger chaque tab uniquement à l'accès (`React.lazy` + `Suspense`)
9. **Virtualiser les listes** si les résultats IA dépassent 50 lignes (`@tanstack/react-virtual`)

### P3 — SEO & Croissance

10. **Meta tags dynamiques** par route via `react-helmet-async`
11. **Unifier `/pricing` et `/tarifs`** avec une gestion i18n simple (objet de traductions ou `i18next`)
12. **Générer `sitemap.xml`** automatiquement et compléter `robots.txt`
13. **Ajouter du JSON-LD** (schema.org `SoftwareApplication` ou `Product`) pour le SEO enrichi

### P4 — DX & Architecture long terme

14. **Typage partagé frontend/backend** — un fichier `src/types/api.ts` référencé par les Edge Functions et le frontend
15. **CI/CD GitHub Actions** — lint + tests + build check sur chaque PR

---

## Résumé

Le projet est bien structuré pour une v1 rapide avec un bon choix de stack. Les fondations (Supabase, Stripe, shadcn/ui, React Query) sont solides. Le travail prioritaire est de le solidifier pour la production : TypeScript strict, tests, gestion propre des secrets, et découplage du dashboard monolithique. Le reste relève du polissage et de l'optimisation.
