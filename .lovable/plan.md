

## Plan: Remplacer "Démarrer gratuitement" par "Essayer" avec redirection conditionnelle

### Comportement souhaité
- Texte du bouton : **"Essayer"** (au lieu de "Démarrer gratuitement")
- Si l'utilisateur est **connecté** → redirige vers `/tarifs`
- Si l'utilisateur est **non connecté** → redirige vers `/auth`

### Fichiers à modifier

1. **`src/components/landing/HeroSection.tsx`**
   - Importer `useAuth`
   - Changer le bouton "Démarrer gratuitement" → "Essayer"
   - Logique : `navigate(user ? "/tarifs" : "/auth")`

2. **`src/components/landing/FinalCTA.tsx`**
   - Importer `useAuth`
   - Même changement de texte et de logique de redirection

3. **`src/components/landing/Navbar.tsx`**
   - Le bouton "Démarrer gratuitement" dans la navbar (visible quand non connecté) → "Essayer"
   - Redirection vers `/auth` (déjà le cas, mais on change le texte)

4. **`src/pages/Pricing.tsx`**
   - Même changement texte + logique conditionnelle

### Détail technique
- Utilisation du hook `useAuth()` déjà disponible dans le projet pour vérifier `user`
- Suppression du texte "14 jours gratuits · Sans carte bancaire · Sans engagement" dans FinalCTA (plus cohérent avec "Essayer")

