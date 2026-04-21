

## Diagnostic : chargement de 30 minutes anormal

Non, 30 minutes de chargement n'est **absolument pas normal**. La page devrait s'afficher en 1-3 secondes. Il y a un blocage à investiguer.

### Causes probables identifiées

D'après l'historique récent (Lot 1 + correctifs sécurité), trois causes possibles :

1. **Migration SQL non appliquée** — La dernière migration (tables `detected_problems`, `loss_history`, `savings_log`, `notifications`) n'a peut-être pas été exécutée. Le hook `useDashboardEnrichment` boucle alors sur des requêtes en erreur 404.
2. **Warning React `forwardRef` sur `ConnectDataWizard`** — Présent dans les logs, peut bloquer le rendu du Dashboard.
3. **Edge functions en timeout** — Les fonctions `datadiag/growthpilot/loyaltyloop` viennent d'être modifiées (auth JWT). Si l'appel reste bloqué, le bouton "Générer" tourne indéfiniment.

### Plan d'action en 3 étapes

**Étape 1 — Vérifier l'état réel de la base et des logs**
- Lire les logs du dev-server (`/tmp/dev-server-logs/dev-server.log`) pour repérer les erreurs Vite/build
- Interroger Supabase pour confirmer que les 4 tables existent bien
- Récupérer les logs récents des edge functions pour détecter les timeouts

**Étape 2 — Corriger ce qui bloque le rendu**
- Si tables manquantes : relancer la migration des tables `detected_problems`, `loss_history`, `savings_log`, `notifications`
- Corriger le warning `forwardRef` sur `ConnectDataWizard` (envelopper dans `React.forwardRef` ou retirer le ref qui lui est passé)
- Ajouter un timeout (15s max) + état d'erreur visible dans `useDashboardEnrichment` pour qu'aucune requête ne puisse bloquer indéfiniment l'UI

**Étape 3 — Sécuriser le chargement du Dashboard**
- Afficher un skeleton avec message clair après 3s ("Chargement de vos données…")
- Bouton "Recharger" visible après 10s si rien ne s'affiche
- Logs console explicites pour chaque étape de fetch (problèmes / pertes / économies / notifications)

### Détails techniques

```text
useDashboardEnrichment.ts
  ├─ Promise.all([4 requêtes]) ──► si 1 échoue, tout casse
  └─ FIX : Promise.allSettled + timeout 10s par requête + état error/loading

ConnectDataWizard.tsx
  └─ Recevoir forwardRef ou ne pas être passé en child d'un Dialog avec ref

Dashboard.tsx
  └─ Skeleton de fallback + message "Si rien ne s'affiche, rechargez la page"
```

### Ce que je vais livrer après approbation
1. Diagnostic exact (logs DB + edge functions + dev-server)
2. Migration de rattrapage si tables manquantes
3. Correctif `forwardRef` sur `ConnectDataWizard`
4. Refacto `useDashboardEnrichment` avec `Promise.allSettled` + timeouts
5. Skeleton + état d'erreur dans `Dashboard.tsx`

**En attendant**, peux-tu rafraîchir la page (Cmd/Ctrl+Shift+R) ? Si elle reste blanche après 10 secondes, on lance le diagnostic immédiatement.

