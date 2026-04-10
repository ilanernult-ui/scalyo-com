import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

interface GrowthPilotPDFProps {
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
    backgroundColor: "#0D1117",
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
    color: "#A8BFC9",
    marginTop: 12,
    lineHeight: 1.4,
  },
  coverFooterLine: {
    width: 120,
    height: 3,
    backgroundColor: "#00FF88",
    marginTop: 20,
  },
  coverFooterText: {
    fontSize: 9,
    color: "#A8BFC9",
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
    color: "#00FF88",
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 8,
    lineHeight: 1.4,
    color: "#333333",
    marginBottom: 8,
  },
  cardRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 10,
  },
  bigCard: {
    flex: 1,
    minWidth: 150,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(0,255,136,0.1)",
    borderLeftWidth: 3,
    borderLeftColor: "#00FF88",
  },
  smallCard: {
    flex: 1,
    minWidth: 120,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  cardLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00FF88",
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
    backgroundColor: "#0D1117",
    padding: 6,
  },
  tableHeaderText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#00FF88",
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
  actionBox: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#F0FFF8",
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

const evolutionRows = [
  ["Février", "41 200 €", "+6 %", "5 h", "71 / 100"],
  ["Mars", "44 800 €", "+9 %", "7 h", "78 / 100"],
  ["Avril", "48 500 €", "+12 %", "8.5 h", "84 / 100"],
];

const recommendations = [
  ["Lancer programme parrainage clients", "+2 100 €"],
  ["A/B test page produit bestseller", "+1 400 €"],
  ["Réactiver segment clients inactifs 60j", "+1 800 €"],
];

export default function GrowthPilotPDF({ companyName, sector, monthlyRevenue, clientsCount, industry, generatedAt }: GrowthPilotPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.cover}>
        <View>
          <Text style={styles.coverLabel}>SCALYO GrowthPilot</Text>
        </View>

        <View style={{ marginTop: 120 }}>
          <Text style={styles.coverTitle}>Rapport de Performance Mensuel</Text>
          <Text style={styles.coverSubtitle}>Avril 2026 · Démo Commerce SAS</Text>
        </View>

        <View>
          <View style={styles.coverFooterLine} />
          <Text style={styles.coverFooterText}>{companyName} · {sector}</Text>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>GrowthPilot</Text>
            <Text style={styles.headerSubtitle}>Performance du mois</Text>
          </View>
          <Text style={styles.headerSubtitle}>{generatedAt}</Text>
        </View>

        <View style={styles.cardRow}>
          <View style={styles.bigCard}>
            <Text style={styles.cardLabel}>CA ce mois</Text>
            <Text style={styles.cardValue}>{monthlyRevenue.toLocaleString("fr-FR")} €</Text>
            <Text style={styles.paragraph}>(+12 % vs mois dernier)</Text>
          </View>
          <View style={styles.bigCard}>
            <Text style={styles.cardLabel}>Heures économisées</Text>
            <Text style={styles.cardValue}>8.5 h</Text>
            <Text style={styles.paragraph}>cette semaine</Text>
          </View>
        </View>

        <View style={styles.cardRow}>
          <View style={styles.smallCard}>
            <Text style={styles.cardLabel}>Objectif croissance</Text>
            <Text style={styles.cardValue}>12 %</Text>
            <Text style={styles.paragraph}>Sur 15 % attendu</Text>
          </View>
          <View style={styles.smallCard}>
            <Text style={styles.cardLabel}>Objectif heures</Text>
            <Text style={styles.cardValue}>8.5 h</Text>
            <Text style={styles.paragraph}>Sur 10 h attendu</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Historique de performance</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 1.1 }]}>Mois</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>CA</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Croissance</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Heures</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Score</Text>
          </View>
          {evolutionRows.map((row, index) => (
            <View key={index} style={[styles.tableRow, { backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F5F5F5" }]}> 
              <Text style={[styles.tableCell, { flex: 1.1 }]}>{row[0]}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{row[1]}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{row[2]}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{row[3]}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{row[4]}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Actions prioritaires — Mai 2026</Text>
        {recommendations.map((item, index) => (
          <View key={index} style={styles.actionBox}>
            <Text style={styles.actionTitle}>{item[0]}</Text>
            <Text style={styles.actionText}>ROI estimé : {item[1]}</Text>
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
