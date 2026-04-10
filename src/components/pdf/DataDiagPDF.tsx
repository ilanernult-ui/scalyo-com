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
  cover: {
    flex: 1,
    padding: 40,
    backgroundColor: "#0A1628",
  },
  coverLabel: {
    fontSize: 10,
    color: "#FFFFFF",
    letterSpacing: 1.5,
    fontWeight: "bold",
  },
  coverSubLabel: {
    fontSize: 8,
    color: "#00D4FF",
    marginTop: 4,
  },
  coverTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 1.1,
  },
  coverSubtitle: {
    fontSize: 12,
    color: "#00D4FF",
    marginTop: 14,
    textAlign: "center",
    lineHeight: 1.4,
  },
  coverFooterLine: {
    width: 80,
    height: 3,
    backgroundColor: "#00D4FF",
    marginTop: 20,
  },
  coverFooterText: {
    fontSize: 8,
    color: "rgba(255,255,255,0.6)",
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
    color: "#00D4FF",
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 8,
    lineHeight: 1.4,
    color: "#333333",
    marginBottom: 8,
  },
  scoreCard: {
    width: 220,
    padding: 10,
    borderRadius: 12,
    backgroundColor: "rgba(0,212,255,0.1)",
    borderLeftWidth: 3,
    borderLeftColor: "#00D4FF",
    marginBottom: 10,
  },
  scoreLabel: {
    fontSize: 8,
    color: "#333333",
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00D4FF",
  },
  metricRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 10,
  },
  metricCard: {
    flex: 1,
    minWidth: 100,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgba(0,212,255,0.08)",
    borderLeftWidth: 3,
    borderLeftColor: "#00D4FF",
  },  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 10,
  },  metricLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00D4FF",
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
    backgroundColor: "#00D4FF",
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
  alertBox: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgba(0,212,255,0.08)",
    borderLeftWidth: 3,
    borderLeftColor: "#00D4FF",
    marginBottom: 10,
  },
  alertTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  actionItem: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  actionNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0,212,255,0.14)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionNumberText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#00D4FF",
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

const lossRows = [
  ["Abandon panier non relancé", "3 200 €", "38 400 €", "🔴 Critique"],
  ["Stocks immobilisés", "1 800 €", "21 600 €", "🟠 Haute"],
  ["Marge fournisseur non négociée", "1 100 €", "13 200 €", "🟠 Haute"],
  ["Frais bancaires optimisables", "420 €", "5 040 €", "🟡 Moyenne"],
];

const planActions = [
  { title: "Mettre en place séquence email abandon panier", description: "Automatiser les relances pour récupérer les ventes perdues." },
  { title: "Audit fournisseurs top 5", description: "Négocier les conditions tarifaires sur les principaux fournisseurs." },
  { title: "Optimiser campagnes Google Ads", description: "Réduire le coût par acquisition et prioriser les annonces les plus performantes." },
  { title: "Automatiser relances clients", description: "Déployer une séquence de relance pour récupérer les paniers abandonnés." },
];

export default function DataDiagPDF({ companyName, sector, monthlyRevenue, clientsCount, industry, generatedAt }: DataDiagPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.cover}>
        <View>
          <Text style={styles.coverLabel}>SCALYO</Text>
          <Text style={styles.coverSubLabel}>DataDiag</Text>
        </View>

        <View style={{ marginTop: 120 }}>
          <Text style={styles.coverTitle}>Rapport de Diagnostic Business</Text>
          <Text style={styles.coverSubtitle}>Analyse complète · Démo Commerce SAS</Text>
        </View>

        <View>
          <View style={styles.coverFooterLine} />
          <Text style={styles.coverFooterText}>{generatedAt}</Text>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>DataDiag</Text>
            <Text style={styles.headerSubtitle}>Synthèse du diagnostic</Text>
          </View>
          <Text style={styles.headerSubtitle}>{companyName}</Text>
        </View>

        <Text style={styles.sectionTitle}>Synthèse du diagnostic</Text>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Score global</Text>
          <Text style={styles.scoreValue}>78 / 100</Text>
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Santé financière</Text>
            <Text style={styles.metricValue}>82 / 100</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Efficacité opérationnelle</Text>
            <Text style={styles.metricValue}>71 / 100</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Potentiel de croissance</Text>
            <Text style={styles.metricValue}>81 / 100</Text>
          </View>
        </View>

        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Pertes financières identifiées</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>Catégorie</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Montant</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Impact</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Priorité</Text>
          </View>
          {lossRows.map((row, index) => (
            <View key={index} style={[styles.tableRow, { backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F5F5F5" }]}> 
              <Text style={[styles.tableCell, { flex: 2 }]}>{row[0]}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{row[1]}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{row[2]}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{row[3]}</Text>
            </View>
          ))}
          <View style={[styles.tableRow, { backgroundColor: "#FFFFFF", borderBottomWidth: 0 }]}> 
            <Text style={[styles.tableCell, { flex: 2, fontSize: 8, fontWeight: "bold" }]}>TOTAL</Text>
            <Text style={[styles.tableCell, { flex: 1, fontSize: 8, fontWeight: "bold" }]}>8 060 €</Text>
            <Text style={[styles.tableCell, { flex: 1, fontSize: 8, fontWeight: "bold" }]}>96 720 €</Text>
            <Text style={[styles.tableCell, { flex: 1 }]} />
          </View>
        </View>

        <View style={styles.alertBox}>
          <Text style={styles.alertTitle}>Alerte</Text>
          <Text style={styles.paragraph}>Vous perdez estimativement 8 060 € par mois en raison de ruptures de parcours et de coûts fixes trop élevés.</Text>
        </View>

        <Text style={styles.sectionTitle}>Plan d'action recommandé</Text>
        {planActions.map((item, index) => (
          <View key={index} style={styles.actionItem}>
            <View style={styles.actionNumber}>
              <Text style={styles.actionNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.actionText}>{item.title} — {item.description}</Text>
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
