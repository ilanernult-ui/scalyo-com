import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

interface LoyaltyLoopPDFProps {
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
    color: "#FFFFFF",
    padding: 24,
    backgroundColor: "#0C0A1E",
  },
  cover: {
    flex: 1,
    justifyContent: "space-between",
    padding: 24,
    backgroundColor: "#1A1535",
  },
  coverLabel: {
    fontSize: 12,
    color: "#FFD700",
    fontWeight: "bold",
    marginBottom: 8,
  },
  coverTitle: {
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  coverSubtitle: {
    fontSize: 11,
    color: "#D8C3FF",
    marginTop: 12,
    lineHeight: 1.5,
  },
  coverMeta: {
    marginTop: 24,
  },
  coverMetaText: {
    fontSize: 10,
    color: "#C6C0DB",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.6,
    color: "#E7E3F7",
    marginBottom: 8,
  },
  metricGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 8,
  },
  metricCard: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#161238",
  },
  metricLabel: {
    fontSize: 8,
    color: "#C6C0DB",
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFD700",
  },
  table: {
    width: "100%",
    borderWidth: 0.5,
    borderColor: "#312E54",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1A1535",
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
    borderColor: "#312E54",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    color: "#E7E3F7",
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
    backgroundColor: "#FFD700",
    borderRadius: 2,
    marginTop: 7,
    marginRight: 8,
  },
  bulletText: {
    fontSize: 9,
    color: "#E7E3F7",
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    fontSize: 8,
    color: "#B8AEDC",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const cohortRows = [
  ["Cohorte A", "82 %", "76 %", "69 %"],
  ["Cohorte B", "78 %", "70 %", "62 %"],
  ["Cohorte C", "65 %", "58 %", "51 %"],
];

const segmentation = [
  ["VIP", "124", "26 800 €"],
  ["Réguliers", "530", "11 450 €"],
  ["À risque", "298", "6 200 €"],
  ["Perdus", "95", "2 100 €"],
];

const campaigns = [
  ["Retention Premium", "Actif", "720", "-12 % churn"],
  ["Offre Reactivation", "En test", "325", "-8 % churn"],
  ["Programme VIP", "Planifié", "410", "-15 % churn"],
];

const predictive = [
  ["Clients à risque détectés", "52"],
  ["Revenu protégé estimé", "18 400 €"],
];

const roadmap = [
  "Renforcer le programme VIP et le tracker de churn.",
  "Segmenter les parcours à risque et automatiser les relances.",
  "Mesurer l’impact des campagnes sur J30/J60/J90.",
  "Déployer les recommandations IA pour renforcer la rétention.",
];

export default function LoyaltyLoopPDF({ companyName, sector, monthlyRevenue, clientsCount, industry, generatedAt }: LoyaltyLoopPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.cover}>
        <View>
          <Text style={styles.coverLabel}>Rapport de Transformation Business</Text>
          <Text style={styles.coverTitle}>LoyaltyLoop — Analyse stratégique</Text>
          <Text style={styles.coverSubtitle}>
            Une étude complète des leviers de fidélisation, de la rétention et du churn pour transformer votre base client.
          </Text>
        </View>

        <View style={styles.coverMeta}>
          <Text style={styles.coverMetaText}>Entreprise : {companyName}</Text>
          <Text style={styles.coverMetaText}>Secteur : {sector}</Text>
          <Text style={styles.coverMetaText}>CA mensuel : {monthlyRevenue.toLocaleString("fr-FR")} €</Text>
          <Text style={styles.coverMetaText}>Clients : {clientsCount}</Text>
          <Text style={styles.coverMetaText}>Date : {generatedAt}</Text>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Indicateurs de transformation</Text>
        <View style={styles.metricGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Croissance réalisée</Text>
            <Text style={styles.metricValue}>+27 %</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Objectif croissance</Text>
            <Text style={styles.metricValue}>+25 %</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Churn actuel</Text>
            <Text style={styles.metricValue}>-38 %</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Objectif churn</Text>
            <Text style={styles.metricValue}>-40 %</Text>
          </View>
        </View>
        <Text style={[styles.paragraph, { marginTop: 12 }]}>Le programme LoyaltyLoop montre déjà une amélioration sensible de la fidélité client et des revenus protégés, avec des chutes de churn significatives sur les derniers mois.</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Analyse de la rétention client</Text>
        <View style={[styles.table, { marginBottom: 12 }]}> 
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, { flex: 1.5 }]}>Cohorte</Text>
            <Text style={styles.tableCell}>Taux J30</Text>
            <Text style={styles.tableCell}>Taux J60</Text>
            <Text style={styles.tableCell}>Taux J90</Text>
          </View>
          {cohortRows.map((row, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>{row[0]}</Text>
              <Text style={styles.tableCell}>{row[1]}</Text>
              <Text style={styles.tableCell}>{row[2]}</Text>
              <Text style={styles.tableCell}>{row[3]}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Segmentation clients</Text>
        <View style={[styles.table, { marginBottom: 12 }]}> 
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, { flex: 1.5 }]}>Segment</Text>
            <Text style={styles.tableCell}>Effectifs</Text>
            <Text style={styles.tableCell}>CA associé</Text>
          </View>
          {segmentation.map((row, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>{row[0]}</Text>
              <Text style={styles.tableCell}>{row[1]}</Text>
              <Text style={styles.tableCell}>{row[2]}</Text>
            </View>
          ))}
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Campagnes de fidélisation actives</Text>
        <View style={[styles.table, { marginBottom: 12 }]}> 
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, { flex: 1.5 }]}>Nom</Text>
            <Text style={styles.tableCell}>Statut</Text>
            <Text style={styles.tableCell}>Clients touchés</Text>
            <Text style={styles.tableCell}>Impact churn</Text>
          </View>
          {campaigns.map((row, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>{row[0]}</Text>
              <Text style={styles.tableCell}>{row[1]}</Text>
              <Text style={styles.tableCell}>{row[2]}</Text>
              <Text style={styles.tableCell}>{row[3]}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Analyse prédictive IA</Text>
        {predictive.map((row, index) => (
          <View style={styles.bulletItem} key={index}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>{row[0]} : {row[1]}</Text>
          </View>
        ))}
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Feuille de route transformation sur 90 jours</Text>
        <View style={styles.bulletList}>
          {roadmap.map((item, index) => (
            <View style={styles.bulletItem} key={index}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>{index + 1}. {item}</Text>
            </View>
          ))}
        </View>
        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) =>
            `Page ${pageNumber} / ${totalPages} • Rapport LoyaltyLoop Confidentiel — Scalyo IA — Ne pas diffuser`
          }
          fixed
        />
      </Page>
    </Document>
  );
}
