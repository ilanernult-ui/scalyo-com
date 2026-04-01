

## Plan : Restaurer les noms d'onglets originaux dans la sidebar du Dashboard

### Probleme
Lors de l'ajout du chat IA, les labels de la sidebar ont été changés :
- "Vue d'ensemble" → "Dashboard"
- "DataDiag" → "Diagnostic"
- "GrowthPilot" → "Croissance"
- "LoyaltyLoop" → "Fidélisation"

Le tableau de bord et ses options doivent rester comme avant. Seul le chat IA devait être modifié.

### Correction

**`src/pages/Dashboard.tsx`** — Remettre les labels originaux dans `navItems` :
- "Dashboard" → "Vue d'ensemble"
- "Diagnostic" → "DataDiag"
- "Croissance" → "GrowthPilot"
- "Fidélisation" → "LoyaltyLoop"

Cela correspond aux noms dans `DashboardSidebar.tsx` (le composant original). Le reste du dashboard (onglets, contenu, plan locking, chat IA) reste inchangé.

