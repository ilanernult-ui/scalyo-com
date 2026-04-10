import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

interface DataDiagPDFProps {
  companyName: string;
  sector: string;
  monthlyRevenue: number;
  clientsCount: number;
  industry: string;
  generatedAt: string;
}

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#0A1628",
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  cover: {
    flex: 1,
    justifyContent: "space-between",
    padding: 24,
    backgroundColor: "#0A1628",
  },
  coverTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  coverSubtitle: {
    fontSize: 12,
    color: "#B3D8FF",
    marginTop: 12,
  },
  coverMeta: {
    marginTop: 24,
  },
  coverMetaText: {
    fontSize: 10,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#0A1628",
    marginBottom: 8,
    fontWeight: "bold",
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.6,
    color: "#283A5C",
    marginBottom: 8,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 8,
  },
  metricCard: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#F4F8FF",
  },
  metricLabel: {
    fontSize: 8,
    color: "#1E3A5F",
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0A1628",
  },
  table: {
    width: "100%",
    borderWidth: 0.5,
    borderColor: "#D9E2F5",
    borderRadius: 6,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0A1628",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tableHeaderText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderColor: "#D9E2F5",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    color: "#0A1628",
  },
  accentText: {
    color: "#00D4FF",
    fontWeight: "bold",
  },
  bulletList: {
    marginTop: 6,
    paddingLeft: 10,
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 4,
  },
  bulletDot: {
    width: 4,
    height: 4,
    backgroundColor: "#0A1628",
    borderRadius: 2,
    marginTop: 6,
    marginRight: 6,
  },
  bulletText: {
    fontSize: 9,
    color: "#0A1628",
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    fontSize: 8,
    color: "#5B6B84",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const losses = [
  ["Abonnements SaaS non optimisés", "8 500 €", "Haute"],
  ["Factures impayées", "4 300 €", "Moyenne"],
  ["Retards de paiement", "3 200 €", "Moyenne"],
  ["Retour produits non traités", "2 100 €", "Basse"],
  ["Processus manuels redondants", "6 900 €", "Haute"],
];

const improvements = [
  "Rationaliser les abonnements SaaS et négocier les tarifs.",
  "Automatiser les relances clients et réduire les délais de paiement.",
  "Optimiser les processus de facturation et de recouvrement.",
  "Réduire les tâches manuelles les plus chronophages.",
  "Déployer un suivi KPI hebdomadaire pour piloter la performance.",
];

const planActions = [
  "Cartographier les sources de perte de marge pendant les 7 premiers jours.",
  "Mettre en place des relances clients automatisées d'ici le jour 14.",
  "Auditer les abonnements SaaS et identifier 3 réductions de coût immédiates.",
  "Organiser un point de revue opérationnelle à J21.",
  "Prioriser les 3 axes de croissance rapide pour le mois suivant.",
];

export default function DataDiagPDF({ companyName, sector, monthlyRevenue, clientsCount, industry, generatedAt }: DataDiagPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.cover}>
        <View>
          <Text style={{ fontSize: 14, color: "#00D4FF", fontWeight: "bold" }}>Rapport de Diagnostic Business</Text>
          <Text style={styles.coverTitle}>Analyse complète en 48h</Text>
          <Text style={styles.coverSubtitle}>
            Un diagnostic structuré avec les opportunités à gains rapides pour votre entreprise.
          </Text>
        </View>

        <View style={styles.coverMeta}>
          <Text style={styles.coverMetaText}>Entreprise : {companyName}</Text>
          <Text style={styles.coverMetaText}>Secteur : {sector}</Text>
          <Text style={styles.coverMetaText}>CA mensuel : {monthlyRevenue.toLocaleString("fr-FR")} €</Text>
          <Text style={styles.coverMetaText}>Clients actifs : {clientsCount}</Text>
          <Text style={styles.coverMetaText}>Date : {generatedAt}</Text>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Résumé exécutif</Text>
        <Text style={styles.paragraph}>
          Ce rapport DataDiag présente une analyse claire de la santé financière, de l'efficacité opérationnelle et du potentiel de croissance. Les points clés ci-dessous permettent de gagner du temps, réduire les coûts et générer des marges plus saines.
        </Text>
        <Text style={styles.paragraph}>
          Sur la base des données disponibles, nous avons identifié des pertes mensuelles évitables, des frictions métier et des leviers de croissance rapide. Ce document propose un plan d'action pragmatique à 30 jours.
        </Text>

        <Text style={styles.sectionTitle}>Indicateurs clés</Text>
        <View style={styles.cardRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Score global</Text>
            <Text style={styles.metricValue}>82 / 100</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Santé financière</Text>
            <Text style={styles.metricValue}>74 / 100</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Efficacité opérationnelle</Text>
            <Text style={styles.metricValue}>68 / 100</Text>
          </View>
        </View>
        <View style={[styles.cardRow, { marginTop: 8 }]}> 
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Potentiel de croissance</Text>
            <Text style={styles.metricValue}>+12 %</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Perte estimée</Text>
            <Text style={styles.metricValue}>25 000 € / mois</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Synthèse rapide</Text>
        <Text style={styles.paragraph}>
          L'analyse indique un potentiel de hausse de marge immédiat de 12 % en réduisant les frais fixes et en automatisant les relances clients. La structure de coûts reste l'axe prioritaire pour sécuriser les résultats.
        </Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Tableau des pertes détectées</Text>
        <View style={[styles.table, { marginBottom: 12 }]}> 
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, { flex: 2 }]}>Catégorie</Text>
            <Text style={styles.tableCell}>Montant</Text>
            <Text style={[styles.tableCell, { flex: 0.8 }]}>Priorité</Text>
          </View>
          {losses.map((row, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={[styles.tableCell, { flex: 2 }]}>{row[0]}</Text>
              <Text style={styles.tableCell}>{row[1]}</Text>
              <Text style={[styles.tableCell, { flex: 0.8 }]}>{row[2]}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Top 5 axes d'amélioration</Text>
        <View style={styles.bulletList}>
          {improvements.map((item, index) => (
            <View style={styles.bulletItem} key={index}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Plan d'action recommandé sur 30 jours</Text>
        <View style={styles.bulletList}>
          {planActions.map((step, index) => (
            <View style={styles.bulletItem} key={index}>
              <Text style={[styles.tableCell, { width: 16, fontSize: 10, color: "#0A1628" }]}>{index + 1}.</Text>
              <Text style={styles.bulletText}>{step}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>À surveiller</Text>
        <Text style={styles.paragraph}>
          Prioriser la réduction des coûts récurrents et mesurer l'impact en temps réel. La réussite de ce plan dépend d'un pilotage serré des actions à J7, J15 et J30.
        </Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Recommandations IA</Text>
        <Text style={styles.paragraph}>
          Utiliser un assistant IA pour identifier automatiquement les abonnements dupliqués, prédire les retards de paiement et proposer des scenarii de réduction de coûts.
        </Text>
        <View style={styles.bulletList}>
          <View style={styles.bulletItem}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>Surveiller les clients à risque et automatiser la relance pour réduire le DSO.</Text>
          </View>
          <View style={styles.bulletItem}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>Segmenter les dépenses pour isoler les économies rapides.</Text>
          </View>
        </View>

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) =>
            `Page ${pageNumber} / ${totalPages} • Rapport généré par Scalyo DataDiag — Valable 30 jours`
          }
          fixed
        />
      </Page>
    </Document>
  );
}
