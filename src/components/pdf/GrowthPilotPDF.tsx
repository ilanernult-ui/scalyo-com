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
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#FFFFFF",
    padding: 24,
    backgroundColor: "#0D1117",
  },
  cover: {
    flex: 1,
    justifyContent: "space-between",
    padding: 24,
    backgroundColor: "#161B22",
  },
  coverLabel: {
    fontSize: 12,
    color: "#00FF88",
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
    color: "#A8BFC9",
    marginTop: 12,
    lineHeight: 1.5,
  },
  coverMeta: {
    marginTop: 24,
  },
  coverMetaText: {
    fontSize: 10,
    color: "#C0C9D4",
    marginBottom: 4,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.6,
    color: "#C0C9D4",
    marginBottom: 8,
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  metricCard: {
    width: "48%",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#0D1117",
    borderWidth: 1,
    borderColor: "#1E2530",
  },
  metricLabel: {
    fontSize: 8,
    color: "#A8BFC9",
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 16,
    color: "#00FF88",
    fontWeight: "bold",
  },
  table: {
    width: "100%",
    borderWidth: 0.5,
    borderColor: "#2C323F",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0D1117",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tableHeaderText: {
    color: "#00FF88",
    fontSize: 9,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderColor: "#2C323F",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    color: "#E6EDF3",
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
    backgroundColor: "#00FF88",
    borderRadius: 2,
    marginTop: 7,
    marginRight: 8,
  },
  bulletText: {
    fontSize: 9,
    color: "#E6EDF3",
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    fontSize: 8,
    color: "#8A98A9",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const evolution = [
  ["Janvier", "42 000 €", "+7 %", "8 h"],
  ["Février", "48 500 €", "+15 %", "10 h"],
  ["Mars", "55 800 €", "+18 %", "12 h"],
];

const actions = [
  ["Automatisation des relances e-mail", "+3 200 €"],
  ["Optimisation des campagnes Ads", "+2 900 €"],
  ["Recommandation produit personnalisée", "+4 500 €"],
];

const recommendations = [
  ["Déployer un test A/B sur la page produit", "ROI estimé 18 %"],
  ["Activer le scoring client IA pour les upsells", "ROI estimé 22 %"],
  ["Rationaliser les workflows de qualification", "ROI estimé 16 %"],
];

export default function GrowthPilotPDF({ companyName, sector, monthlyRevenue, clientsCount, industry, generatedAt }: GrowthPilotPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.cover}>
        <View>
          <Text style={styles.coverLabel}>Rapport GrowthPilot</Text>
          <Text style={styles.coverTitle}>Votre co-pilote IA — Performance du mois</Text>
          <Text style={styles.coverSubtitle}>
            Une synthèse orientée croissance avec les actions IA les plus impactantes et le suivi des objectifs mensuels.
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
        <Text style={styles.sectionTitle}>Tableau de bord croissance</Text>
        <View style={styles.metricGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>CA actuel</Text>
            <Text style={styles.metricValue}>{monthlyRevenue.toLocaleString("fr-FR")} €</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Objectif +15%</Text>
            <Text style={styles.metricValue}>{Math.round(monthlyRevenue * 1.15).toLocaleString("fr-FR")} €</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Heures économisées</Text>
            <Text style={styles.metricValue}>10 h</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Objectif heures</Text>
            <Text style={styles.metricValue}>+10 h</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Résumé mensuel</Text>
        <Text style={styles.paragraph}>
          La performance du mois montre un alignement solide avec les objectifs IA. Le copilote GrowthPilot a permis de gagner du temps et d'augmenter les revenus tout en maintenant un rythme d'exécution rigoureux.
        </Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Évolution sur 3 mois</Text>
        <View style={[styles.table, { marginBottom: 12 }]}> 
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, { flex: 1.5, color: "#00FF88" }]}>Mois</Text>
            <Text style={styles.tableCell}>CA</Text>
            <Text style={styles.tableCell}>Croissance</Text>
            <Text style={styles.tableCell}>Heures</Text>
          </View>
          {evolution.map((row, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>{row[0]}</Text>
              <Text style={styles.tableCell}>{row[1]}</Text>
              <Text style={styles.tableCell}>{row[2]}</Text>
              <Text style={styles.tableCell}>{row[3]}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Actions IA réalisées ce mois</Text>
        <View style={styles.bulletList}>
          {actions.map((row, index) => (
            <View style={styles.bulletItem} key={index}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>{index + 1}. {row[0]} — impact estimé {row[1]}.</Text>
            </View>
          ))}
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Recommandations IA prioritaires</Text>
        <View style={styles.bulletList}>
          {recommendations.map((row, index) => (
            <View style={styles.bulletItem} key={index}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>{index + 1}. {row[0]} — {row[1]}.</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Score de performance global</Text>
        <Text style={styles.metricValue}>89 / 100</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Analyse et recommandations</Text>
        <Text style={styles.paragraph}>
          Le copilote IA est sur la bonne trajectoire. La priorité est d'accélérer les tests de contenu commercial et de structurer les scénarios de conversion sur les segments les plus rentables.
        </Text>
        <Text style={styles.paragraph}>
          Avec une organisation plus fine des actions IA et un reporting hebdomadaire, l'objectif de +15 % peut être dépassé tout en consolidant le gain de temps opérationnel.
        </Text>

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) =>
            `Page ${pageNumber} / ${totalPages} • Rapport mensuel GrowthPilot — Scalyo IA`
          }
          fixed
        />
      </Page>
    </Document>
  );
}
