
Diagnostic rapide

Le problème ne vient probablement pas de Stripe ni de la Edge Function.

Ce que j’ai vérifié :
- `create-checkout` répond bien en `200`
- la fonction crée bien une session Stripe
- elle retourne une vraie URL Checkout `https://checkout.stripe.com/...`
- le `origin` utilisé est déjà celui du preview Lovable, pas `localhost`
- après le clic, le bouton charge puis redevient actif, mais la navigation ne se fait pas correctement

Cause la plus probable

La page blanche arrive parce que le checkout Stripe est lancé depuis la preview intégrée Lovable. Aujourd’hui `Tarifs.tsx` fait :

```ts
window.location.assign(data.url)
```

Donc la preview essaie de naviguer elle-même vers `checkout.stripe.com`. Or Stripe Checkout n’est pas fait pour être affiché dans un contexte embarqué/iframe, ce qui produit typiquement une page blanche.

En bref :
- backend OK
- URL Stripe OK
- redirection dans la preview KO

Plan de correction

1. Corriger la redirection frontend
- remplacer la navigation actuelle par une redirection “hors preview”
- essayer d’abord une navigation top-level :
  ```ts
  window.top?.location.assign(data.url)
  ```
- si bloqué par le contexte navigateur, fallback vers :
  ```ts
  window.open(data.url, "_blank", "noopener,noreferrer")
  ```

2. Ajouter un fallback visible pour l’utilisateur
- si aucune redirection ne part, afficher un message clair avec un vrai lien cliquable :
  - “Le paiement va s’ouvrir dans un nouvel onglet”
  - bouton “Ouvrir le paiement Stripe”
- ça évite toute page blanche bloquante

3. Renforcer les logs côté frontend
- logger :
  - URL reçue
  - contexte de navigation (`window.self !== window.top`)
  - méthode de redirection utilisée
- utile pour confirmer qu’on est bien dans un contexte embarqué

4. Garder la Edge Function presque telle quelle
- elle fonctionne déjà
- seulement compléter les logs avec :
  - `origin`
  - `session.url`
- pas besoin de refactor Stripe tant que l’URL est bien générée, ce qui est déjà le cas

5. Vérifier le flux complet
- tester depuis `/tarifs`
- confirmer que le clic ouvre bien Stripe hors preview
- vérifier le retour :
  - succès → `/dashboard?checkout=success`
  - annulation → `/tarifs?checkout=cancelled`

Fichiers concernés
- `src/pages/Tarifs.tsx` : corriger la redirection et ajouter le fallback utilisateur
- `supabase/functions/create-checkout/index.ts` : améliorer les logs uniquement

Conclusion

La page blanche n’est pas un “paiement cassé” : la session Stripe est bien créée. Le vrai bug est la façon dont la preview tente d’ouvrir Checkout dans son propre contexte. La bonne correction est d’ouvrir Stripe au niveau de la fenêtre principale ou dans un nouvel onglet, avec un lien de secours visible.
