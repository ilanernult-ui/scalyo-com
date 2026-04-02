

## Plan : Intégrer les nouveaux dashboards premium et remettre le chat en bas

### Probleme
1. Les onglets DataDiag, GrowthPilot et LoyaltyLoop dans le dashboard affichent toujours les anciens composants simples (DataDiagTab, GrowthPilotTab, LoyaltyLoopTab) au lieu des nouveaux dashboards premium construits (DataDiagDashboard, GrowthPilotDashboard, LoyaltyLoopDashboard)
2. Le chat IA est positionné à droite (`xl:flex-row`) au lieu d'en bas comme avant

### Modifications

**`src/pages/Dashboard.tsx`**

1. **Importer les nouveaux dashboards** : `DataDiagDashboard`, `GrowthPilotDashboard`, `LoyaltyLoopDashboard`

2. **Remplacer le contenu des onglets** dans `renderTab()` :
   - `case "datadiag"` → afficher `<DataDiagDashboard />` (au lieu de `<DataDiagTab />`)
   - `case "growthpilot"` → afficher `<GrowthPilotDashboard />` (au lieu de `<GrowthPilotTab />`)
   - `case "loyaltyloop"` → afficher `<LoyaltyLoopDashboard />` (au lieu de `<LoyaltyLoopTab />`)
   - Garder la logique `EmptyStateOverlay` + `LockedTabOverlay` qui entoure le contenu (connexion données + verrouillage plan)

3. **Remettre le chat en bas** : Changer le layout de `flex-col xl:flex-row` à `flex-col` uniquement, et retirer le `xl:w-auto` du conteneur chat. Le chat s'affichera toujours sous le contenu principal, sur toute la largeur.

4. **Adaptation des dashboards premium** : Les dashboards premium (DataDiagDashboard, GrowthPilotDashboard, LoyaltyLoopDashboard) ont chacun leur propre sidebar interne. Quand ils sont intégrés dans le dashboard principal (qui a déjà une sidebar), il faut masquer leur sidebar interne pour éviter un doublon. On ajoutera une prop `embedded={true}` à chaque dashboard pour cacher leur sidebar et utiliser seulement le contenu principal.

### Fichiers modifiés
- `src/pages/Dashboard.tsx` — layout chat + imports dashboards
- `src/components/dashboard/datadiag/DataDiagDashboard.tsx` — ajouter prop `embedded` pour masquer sidebar
- `src/components/dashboard/growthpilot/GrowthPilotDashboard.tsx` — idem
- `src/components/dashboard/loyaltyloop/LoyaltyLoopDashboard.tsx` — idem

