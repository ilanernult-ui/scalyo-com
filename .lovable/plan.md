

## Probleme

Le bouton "Telecharger PDF" dans ReportsTab n'a aucun `onClick` handler — il ne fait rien quand on clique. De plus, aucun PDF reel n'est genere : le hook `useReports` simule juste un delai de 2.2s puis met le statut a "ready" sans creer de fichier.

## Solution

Generer un vrai PDF cote client avec **jsPDF** quand l'utilisateur clique sur "Telecharger PDF". Le PDF contiendra les infos du rapport (titre, periode, resume, date) avec le branding Scalyo.

## Fichiers a modifier

### 1. `src/components/dashboard/ReportsTab.tsx`
- Importer `jsPDF` depuis `jspdf`
- Creer une fonction `downloadReportPdf(report: Report)` qui :
  - Cree un document A4 avec jsPDF
  - Ajoute le logo/titre "Scalyo", le type de rapport, la periode, le resume
  - Ajoute la date de generation et un footer
  - Declenche le telechargement du fichier PDF
- Ajouter `onClick={() => downloadReportPdf(report)}` sur le bouton "Telecharger PDF" dans ReportCard

### 2. Installation
- Ajouter la dependance `jspdf` au projet

### Details techniques
- Pas besoin de html2canvas car le contenu est genere programmatiquement (texte uniquement)
- Le PDF sera en francais avec gestion des accents via la police Helvetica integree
- Nom du fichier : `rapport-{type}-{date}.pdf`

