

## Problemes identifies

1. **Les 3 boutons "Generer" se desactivent tous en meme temps** : le state `generating` est un seul booleen. Quand on clique sur un type, les 3 cartes affichent le spinner car `disabled={generating}` est partage.

2. **Le PDF ne se telecharge pas automatiquement apres generation** : le flux actuel genere le rapport en base, mais ne declenche pas `downloadReportPdf` — l'utilisateur doit ensuite cliquer manuellement sur "Telecharger PDF" dans l'historique.

## Solution

### 1. `src/hooks/useReports.ts` — State par type au lieu de booleen global
- Remplacer `generating: boolean` par `generatingType: ReportType | null`
- Mettre `generatingType` au type en cours, et le remettre a `null` a la fin
- Retourner `generatingType` au lieu de `generating`

### 2. `src/components/dashboard/ReportsTab.tsx` — Isoler le spinner + auto-download
- Dans `GenerateCard`, comparer `generatingType === type.type` au lieu de `generating` pour le disabled et le spinner
- Dans `handleGenerate`, apres `generateReport`, recuperer le rapport genere depuis le state et appeler `downloadReportPdf` automatiquement pour telecharger le PDF immediatement

### Details techniques
- `GenerateCard` recevra `generatingType: ReportType | null` au lieu de `generating: boolean`
- Chaque carte ne sera disabled que si `generatingType === type.type`
- Apres generation, le PDF est telecharge automatiquement via `downloadReportPdf`

