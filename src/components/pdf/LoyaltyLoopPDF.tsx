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
  cover: {
    flex: 1,
    padding: 40,
    backgroundColor: "#0C0A1E",
  },
  coverLabel: {
    fontSize: 10,
    color: "#FFFFFF",
    letterSpacing: 1.5,
    fontWeight: "bold",
  },
  coverTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    lineHeight: 1.1,
  },
  coverSubtitle: {
    fontSize: 11,
    color: "#D8C3FF",
    marginTop: 12,
    lineHeight: 1.4,
  },
  coverFooterLine: {
    width: 120,
    height: 3,
    backgroundColor: "#FFD700",
    marginTop: 20,
  },
  coverFooterText: {
    fontSize: 9,
    color: "#C6C0DB",
    marginTop: 8,
  },
  page: {
    flex: 1,
    padding: 30,
    backgroundColor: "#FFFFFF",
    color: "#1A1A1A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#333333",
  },
  headerSubtitle: {
    fontSize: 8,
    color: "#555555",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 8,
    lineHeight: 1.4,
    color: "#333333",
    marginBottom: 8,
  },
  metricRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 10,
  },
  metricCard: {
    flex: 1,
    minWidth: 110,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderLeftWidth: 4,
    borderLeftColor: "#FFD700",
  },
  metricLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
  },
  table: {
    width: "100%",
    borderWidth: 0.5,
    borderColor: "#E0E0E0",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1A1535",
    padding: 6,
  },
  tableHeaderText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  tableRow: {
    flexDirection: "row",
    padding: 6,
    borderBottomWidth: 0.5,
    borderColor: "#E0E0E0",
  },
  tableCell: {
    fontSize: 8,
    color: "#1A1A1A",
  },
  highlightBox: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: "rgba(155,89,182,0.1)",
    borderLeftWidth: 4,
    borderLeftColor: "#9B59B6",
    marginBottom: 10,
  },
  highlightTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#4A235A",
    marginBottom: 4,
  },
  highlightText: {
    fontSize: 8,
    color: "#4A235A",
    lineHeight: 1.4,
  },
  actionBox: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgba(0,255,136,0.12)",
    borderLeftWidth: 4,
    borderLeftColor: "#00FF88",
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  actionText: {
    fontSize: 8,
    color: "#333333",
    lineHeight: 1.4,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    color: "#555555",
  },
});

const clientCohorts = [
  ["Jan 2026", "143", "91 %", "78 %", "68 %", "12 400 €"],
  ["Fév 2026", "167", "93 %", "81 %", "—", "14 200 €"],
  ["Mar 2026", "201", "94 %", "—", "—", "16 800 €"],
];

const riskRows = [
  ["Clients 30-60j sans achat", "34", "78 %", "4 200 €", "Email réactivation"],
  ["Acheteurs 1 fois seulement", "29", "65 %", "2 900 €", "Offre fidélité J+7"],
  ["Panier moyen en baisse", "24", "71 %", "3 600 €", "Programme points"],
];

const roadmapRows = [
  ["Phase 1 (Mai)", "Activation programme fidélité", "Réduire churn à 3.5%"],
  ["Phase 2 (Juin)", "Déploiement segmentation avancée", "NPS > 65"],
  ["Phase 3 (Juil)", "Automatisation campagnes rétention", "Croissance +22%"],
];

export default function LoyaltyLoopPDF({ companyName, sector, monthlyRevenue, clientsCount, industry, generatedAt }: LoyaltyLoopPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.cover}>
        <View>
          <Text style={styles.coverLabel}>SCALYO LoyaltyLoop</Text>
        </View>

        <View style={{ marginTop: 120 }}>
          <Text style={styles.coverTitle}>Rapport de Transformation Business</Text>
          <Text style={styles.coverSubtitle}>Analyse stratégique · Confidentiel · Avril 2026</Text>
        </View>

        <View>
          <View style={styles.coverFooterLine} />
          <Text style={styles.coverFooterText}>Ne pas diffuser</Text>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>LoyaltyLoop</Text>
            <Text style={styles.headerSubtitle}>Vue d'ensemble — Transformation en cours</Text>
          </View>
          <Text style={styles.headerSubtitle}>{generatedAt}</Text>
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Croissance réalisée</Text>
            <Text style={styles.metricValue}>+18 %</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Churn actuel</Text>
            <Text style={styles.metricValue}>4.2 %</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>NPS Score</Text>
            <Text style={styles.metricValue}>62</Text>
          </View>
        </View>

        <Text style={styles.paragraph}>Votre transformation est à 72 % de l'objectif 6 mois. Le programme démontre des progrès significatifs sur la fidélisation et la protection des revenus.</Text>

        <Text style={styles.sectionTitle}>Analyse de la rétention par cohorte</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 1.4 }]}>Cohorte</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Clients</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>J30</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>J60</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Revenu</Text>
          </View>
          {clientCohorts.map((row, index) => (
            <View key={index} style={[styles.tableRow, { backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F5F5F5" }]}> 
              <Text style={[styles.tableCell, { flex: 1.4 }]}>{row[0]}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{row[1]}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{row[2]}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{row[3]}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{row[5]}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Détection prédictive — Ce mois</Text>
        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>87 clients identifiés à risque de churn ce mois</Text>
          <Text style={styles.highlightText}>Ces segments représentent un revenu critique à protéger avec des actions ciblées.</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Segment</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Clients</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Score risque</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Revenu</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Action</Text>
          </View>
          {riskRows.map((row, index) => (
            <View key={index} style={[styles.tableRow, { backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F5F5F5" }]}> 
              <Text style={[styles.tableCell, { flex: 1.5 }]}>{row[0]}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{row[1]}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{row[2]}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{row[3]}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{row[4]}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Plan de transformation — Q2 2026</Text>
        {roadmapRows.map((row, index) => (
          <View key={index} style={styles.actionBox}>
            <Text style={styles.actionTitle}>{row[0]} — {row[1]}</Text>
            <Text style={styles.actionText}>{row[2]}</Text>
          </View>
        ))}

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) =>
            `Page ${pageNumber} / ${totalPages} • ${generatedAt}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}
