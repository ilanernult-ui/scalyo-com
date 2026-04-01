

## Plan : Ajouter un bouton "Données de test" pour remplir le formulaire avec des données fictives

### Objectif
Permettre de tester rapidement le chat IA et les analyses sans remplir manuellement le formulaire, en injectant des données d'entreprise fictives réalistes.

### Approche
Ajouter un bouton **"Remplir avec des données de test"** dans le `ConnectDataWizard` qui pré-remplit tous les champs avec des données fictives d'une PME française réaliste, puis soumet automatiquement.

### Fichier à modifier

**`src/components/dashboard/ConnectDataWizard.tsx`**

- Ajouter une fonction `fillTestData()` qui set toutes les valeurs d'état avec des données fictives :
  - Entreprise : "TechShop Paris", secteur E-commerce, PME, 25 salariés
  - CA annuel : 850 000€, CA mensuel : 72 000€, historique 6 mois réaliste
  - Charges fixes : 35 000€, variables : 18 000€, trésorerie : 95 000€
  - Marges, impayés, délais paiement, clients actifs, panier moyen, etc.
  - Données clients/fidélisation pour LoyaltyLoop : churn, NPS, VIP, rétention
- Ajouter un bouton visible uniquement à l'étape 1 (ou en header) : `🧪 Remplir données test`
- Quand cliqué : remplit tout et passe à l'étape récapitulatif

### Données fictives prévues

```text
Entreprise: TechShop Paris | E-commerce | PME (11-250) | 25 employés
CA annuel: 850 000€ | CA mensuel: 72 000€
Historique: [58000, 62000, 65000, 71000, 68000, 72000]
Charges fixes: 35 000€ | Variables: 18 000€
Trésorerie: 95 000€ | Marge brute: 42% | Marge nette: 12%
Impayés: 8 factures / 15 200€
Clients actifs: 340 | Total: 1200 | Panier moyen: 85€
CAC: 45€ | LTV: 520€ | NPS: 38 | Rétention: 62%
Budget marketing: 5 000€ | Objectif croissance 6m: 15%
```

### Résultat
Un clic → données injectées → analyse IA lancée → chat et dashboard fonctionnels avec des données réalistes pour tester.

