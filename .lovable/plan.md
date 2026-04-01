

## Plan : Améliorer le chat IA avec adaptation au plan et conseils détaillés

### Objectif
Transformer le chat assistant en un vrai consultant business qui s'adapte au plan souscrit (DataDiag/GrowthPilot/LoyaltyLoop), donne des réponses plus riches et détaillées, et propose des suggestions contextuelles selon l'abonnement.

### Fichiers à modifier

**1. `supabase/functions/scalyo-chat/index.ts`** — Le backend est déjà sur OpenAI, mais on améliore :
- Récupérer le plan de l'utilisateur depuis la table `profiles`
- Adapter le system prompt selon le plan :
  - **DataDiag** : expert diagnostic financier, détection pertes, Score Business 360°, estimation "vous perdez X€/mois"
  - **GrowthPilot** : tout DataDiag + co-pilote croissance, plans d'action priorisés ROI, quick wins en €, automatisations (+10h/semaine)
  - **LoyaltyLoop** : tout GrowthPilot + transformation complète, optimisation continue, prédiction churn, stratégies rétention, CRM
- Augmenter `max_tokens` à 2000 pour des réponses plus détaillées
- Mentionner dans le prompt les fonctionnalités exactes du plan pour que l'IA puisse les expliquer et les exploiter
- Ajouter une instruction pour que l'IA suggère l'upgrade quand une question dépasse le scope du plan actuel

**2. `src/components/dashboard/AIChatPanel.tsx`** — Adapter le frontend :
- Recevoir le `plan` en prop (depuis Dashboard qui a déjà `useAuth`)
- Envoyer le `plan` dans le body de la requête au backend
- Adapter les suggestions rapides selon le plan :
  - DataDiag : "Score Business", "Pertes d'argent", "Actions prioritaires", "Estimation pertes"
  - GrowthPilot : + "Plan de croissance ROI", "Quick wins", "Automatisations"
  - LoyaltyLoop : + "Prédiction churn", "Stratégie rétention", "Optimisation 360°"
- Adapter le message de bienvenue selon le plan
- Ajouter le rendu markdown avec `react-markdown` pour des réponses mieux formatées
- Afficher un badge du plan actif dans le header du chat

**3. `src/pages/Dashboard.tsx`** — Passer le `plan` en prop au `AIChatPanel`

### Détail technique
- La table `profiles` contient déjà le champ `plan` — on le fetch côté Edge Function avec le service role ou via l'auth user
- Le system prompt sera structuré en sections cumulatives (DataDiag = base, GrowthPilot = base + croissance, LoyaltyLoop = tout)
- Les suggestions rapides changent dynamiquement selon le plan pour guider l'utilisateur vers les bonnes questions
- `react-markdown` sera ajouté comme dépendance pour le rendu des réponses formatées

