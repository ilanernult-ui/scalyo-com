import type { ReactNode } from "react";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import type { ReportType } from "@/hooks/useReports";
import scalyoLogo from "@/assets/scalyo-logo.png";

interface PdfGenerationSection {
  title: string;
  content: string;
}

interface ReportData {
  companyName: string;
  period: string;
  focus: string;
  ca: number;
  growth: number;
  churn: number;
  nps: number;
  clients: number;
  score: number;
  heures: number;
  date: string;
  reportSections?: PdfGenerationSection[];
}

interface UniversalReportPDFProps {
  type: ReportType;
  data: ReportData;
}

const reportTypeLabels: Record<ReportType, string> = {
  weekly: "Rapport Hebdomadaire",
  monthly: "Rapport Mensuel",
  diagnostic: "Diagnostic Complet",
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    padding: 30,
    color: "#111827",
    lineHeight: 1.5,
  },
  cover: {
    flex: 1,
    backgroundColor: "#0A1628",
    color: "#FFFFFF",
    padding: 40,
    justifyContent: "center",
  },
  coverTitle: {
    fontSize: 30,
    fontWeight: 700,
    marginBottom: 10,
  },
  coverSubtitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  coverPeriod: {
    fontSize: 14,
    marginBottom: 20,
    color: "#A5B4FC",
  },
  coverDate: {
    fontSize: 10,
    opacity: 0.75,
  },
  section: {
    marginBottom: 18,
  },
  header: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 8,
    color: "#0F172A",
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 8,
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 12,
    color: "#475569",
    marginBottom: 16,
  },
  kpiRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 12,
  },
  kpiLabel: {
    fontSize: 10,
    color: "#475569",
    marginBottom: 6,
  },
  kpiValue: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 4,
  },
  kpiMeta: {
    fontSize: 10,
    color: "#0F172A",
  },
  card: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 6,
  },
  cardRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 10,
    color: "#475569",
  },
  cardValue: {
    fontSize: 10,
    color: "#0F172A",
    fontWeight: 700,
  },
  list: {
    marginTop: 6,
    paddingLeft: 12,
  },
  listItem: {
    fontSize: 10,
    marginBottom: 3,
  },
  recommendation: {
    marginBottom: 8,
  },
  recommendationIndex: {
    fontSize: 10,
    fontWeight: 700,
    marginBottom: 2,
  },
  recommendationText: {
    fontSize: 10,
    color: "#0F172A",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    fontSize: 9,
    color: "#6B7280",
  },
});

const renderFocusSection = (focus: string): { title: string; rows: ReactNode[] } => {
  const lower = focus.toLowerCase();
  const financial = lower.includes("financ") || lower.includes("performance financière");
  const retention = lower.includes("rétention") || lower.includes("retention");
  const churn = lower.includes("churn");
  const growth = lower.includes("croissance");
  const all = lower.includes("tout");

  const financialRows = [
    { label: "Pertes logistique", value: "9 200 €" },
    { label: "Frais marketing inefficaces", value: "7 400 €" },
    { label: "Stocks immobilisés", value: "5 300 €" },
  ];

  const retentionRows = [
    { label: "Segment VIP", value: "taux rétention 92 %" },
    { label: "Clients à risque", value: "10 %" },
    { label: "Churn projeté", value: "4,2 %" },
  ];

  const growthRows = [
    { label: "Campagne SEO optimisée", value: "+9 400 €" },
    { label: "Parrainage client", value: "+5 200 €" },
    { label: "Upsell produit premium", value: "+7 100 €" },
  ];

  const rows: ReactNode[] = [];

  if (financial || all) {
    rows.push(
      <View key="financial">
        <Text style={styles.cardTitle}>Priorités financières</Text>
        {financialRows.map((row) => (
          <View key={row.label} style={styles.cardRow}>
            <Text style={styles.cardLabel}>{row.label}</Text>
            <Text style={styles.cardValue}>{row.value}</Text>
          </View>
        ))}
      </View>,
    );
  }

  if ((retention || churn) || all) {
    rows.push(
      <View key="retention" style={{ marginTop: 8 }}>
        <Text style={styles.cardTitle}>Analyse fidélisation</Text>
        {retentionRows.map((row) => (
          <View key={row.label} style={styles.cardRow}>
            <Text style={styles.cardLabel}>{row.label}</Text>
            <Text style={styles.cardValue}>{row.value}</Text>
          </View>
        ))}
      </View>,
    );
  }

  if ((growth && !all) || all) {
    rows.push(
      <View key="growth" style={{ marginTop: 8 }}>
        <Text style={styles.cardTitle}>Actions croissance</Text>
        {growthRows.map((row) => (
          <View key={row.label} style={styles.cardRow}>
            <Text style={styles.cardLabel}>{row.label}</Text>
            <Text style={styles.cardValue}>{row.value}</Text>
          </View>
        ))}
      </View>,
    );
  }

  if (rows.length === 0) {
    rows.push(
      <Text key="default" style={styles.listItem}>
        Aucun focus spécifique détecté. Le rapport inclut les principales métriques business.
      </Text>,
    );
  }

  return { title: `Métriques — ${focus}`, rows };
};

export const UniversalReportPDF = ({ type, data }: UniversalReportPDFProps) => {
  const focusSection = renderFocusSection(data.focus);
  const recommendations = [
    "Optimiser les campagnes SEO et réduire les coûts Google Ads.",
    "Lancer un programme de fidélité pour les clients VIP et réduire le churn.",
    "Automatiser le reporting financier pour accélérer les décisions stratégiques.",
  ];
  const reportSections = data.reportSections?.length ? data.reportSections : null;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.cover}>
          <Image src={scalyoLogo} style={styles.logo} />
          <Text style={styles.coverTitle}>{reportTypeLabels[type]}</Text>
          <Text style={styles.coverSubtitle}>{data.companyName}</Text>
          <Text style={styles.coverPeriod}>{data.period}</Text>
          <Text style={styles.coverDate}>Date : {data.date}</Text>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>SCALYO · {reportTypeLabels[type]} · {data.period}</Text>
          <Text style={styles.subtitle}>Analyse professionnelle, métriques clés et recommandations actionnables.</Text>
        </View>

        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>CA</Text>
            <Text style={styles.kpiValue}>{data.ca.toLocaleString("fr-FR")}€</Text>
            <Text style={styles.kpiMeta}>+{data.growth}%</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Score performance</Text>
            <Text style={styles.kpiValue}>{data.score}/100</Text>
            <Text style={styles.kpiMeta}>NPS {data.nps}</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Clients actifs</Text>
            <Text style={styles.kpiValue}>{data.clients.toLocaleString("fr-FR")}</Text>
            <Text style={styles.kpiMeta}>{data.heures}h analyse</Text>
          </View>
        </View>

        {reportSections ? (
          reportSections.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.title}>{section.title}</Text>
              <Text>{section.content}</Text>
            </View>
          ))
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.title}>{focusSection.title}</Text>
              {focusSection.rows}
            </View>

            <View style={styles.section}>
              <Text style={styles.title}>Recommandations prioritaires</Text>
              {recommendations.map((recommendation, index) => (
                <View key={recommendation} style={styles.recommendation}>
                  <Text style={styles.recommendationIndex}>{index + 1}. Priorité haute</Text>
                  <Text style={styles.recommendationText}>{recommendation}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <Text style={styles.footer}>Rapport confidentiel Scalyo — {data.date}</Text>
      </Page>
    </Document>
  );
};
