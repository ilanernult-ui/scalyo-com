import { jsPDF } from "jspdf";
import type { ReportType } from "@/hooks/useReports";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface PdfKpi {
  label: string;
  value: string;
}

export interface PdfReportData {
  type: ReportType;
  title: string;
  periodLabel: string;
  companyName: string;
  sector?: string;
  summary?: string | null;
  kpis: PdfKpi[];
}

// ─── Formatters ───────────────────────────────────────────────────────────────
const eur = (v: unknown) =>
  v != null && v !== "" ? `${Number(v).toLocaleString("fr-FR")} €` : "—";
const pct = (v: unknown) =>
  v != null && v !== "" ? `${v}%` : "—";
const str = (v: unknown) =>
  v != null && v !== "" ? String(v) : "—";

// ─── Build KPIs from raw company_data ─────────────────────────────────────────
export function buildKpis(
  type: ReportType,
  cd: Record<string, unknown> | null
): PdfKpi[] {
  if (type === "weekly") {
    return [
      { label: "CA mensuel",        value: eur(cd?.current_month_revenue) },
      { label: "Marge brute",       value: pct(cd?.gross_margin) },
      { label: "Trésorerie",        value: eur(cd?.cash_available) },
      { label: "Factures impayées", value: eur(cd?.unpaid_amount) },
    ];
  }
  if (type === "monthly") {
    return [
      { label: "CA mensuel",     value: eur(cd?.current_month_revenue) },
      { label: "Charges fixes",  value: eur(cd?.fixed_costs) },
      { label: "Marge brute",    value: pct(cd?.gross_margin) },
      { label: "Trésorerie",     value: eur(cd?.cash_available) },
      { label: "Clients actifs", value: str(cd?.active_clients) },
      { label: "Panier moyen",   value: eur(cd?.avg_basket) },
    ];
  }
  // diagnostic
  return [
    { label: "Score 360°",     value: "74 / 100" },
    { label: "CA mensuel",     value: eur(cd?.current_month_revenue) },
    { label: "Marge brute",    value: pct(cd?.gross_margin) },
    { label: "Charges fixes",  value: eur(cd?.fixed_costs) },
    { label: "Trésorerie",     value: eur(cd?.cash_available) },
    { label: "Potentiel opt.", value: "~7 500 €/mois" },
  ];
}

// ─── Default summaries (used for auto-download on generate) ───────────────────
export const DEFAULT_SUMMARIES: Record<ReportType, string> = {
  weekly:
    "Cette semaine, votre MRR a progressé de +3,2 %. 2 recommandations P0 ont été traitées, récupérant ~4 200 €.",
  monthly:
    "Ce mois-ci : MRR de 41 500 € (+12 % MoM), ARR projeté à 498 k€. Score business global : 74/100.",
  diagnostic:
    "Diagnostic complet — Score 360° : 74/100. Potentiel d'optimisation détecté : ~7 500 €/mois sur vos charges et impayés.",
};

// ─── Actions per report type ──────────────────────────────────────────────────
const ACTIONS: Record<ReportType, string[]> = {
  weekly: [
    "Traiter les recommandations P0 en suspens",
    "Analyser les variations de CA par rapport à la semaine précédente",
    "Valider les automatisations déclenchées cette semaine",
  ],
  monthly: [
    "Relancer les factures impayées de plus de 30 jours",
    "Optimiser les postes de charges variables identifiées",
    "Planifier les actions de croissance pour le mois suivant",
  ],
  diagnostic: [
    "Relancer les factures impayées (> 60 j) — récupérer ~4 200 €",
    "Supprimer les abonnements SaaS inutilisés — économiser ~89 €/mois",
    "Automatiser les relances clients — gagner +6 h/semaine",
  ],
};

// ─── Main PDF generator ───────────────────────────────────────────────────────
export function generatePdf(data: PdfReportData): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const mg = 18;
  const cW = W - mg * 2;
  let y = 0;

  // ── Blue header ─────────────────────────────────────────────────────────────
  doc.setFillColor(0, 113, 227);
  doc.rect(0, 0, W, 46, "F");

  // SCALYO wordmark
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(21);
  doc.text("SCALYO", mg, 17);

  // Report type subtitle
  const typeLabel: Record<ReportType, string> = {
    weekly:     "RAPPORT HEBDOMADAIRE",
    monthly:    "RAPPORT MENSUEL",
    diagnostic: "RAPPORT DE DIAGNOSTIC",
  };
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(179, 216, 255);
  doc.text(typeLabel[data.type], mg, 27);

  // Right column: company + dates
  const genDate = new Date().toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.text(data.companyName, W - mg, 17, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(179, 216, 255);
  doc.text(data.periodLabel, W - mg, 26, { align: "right" });
  doc.text(`Généré le ${genDate}`, W - mg, 33, { align: "right" });

  if (data.sector) {
    doc.text(`Secteur : ${data.sector}`, mg, 38);
  }

  y = 56;

  // ── Report title ────────────────────────────────────────────────────────────
  doc.setTextColor(29, 29, 31);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text(data.title, mg, y);
  y += 5;

  doc.setDrawColor(0, 113, 227);
  doc.setLineWidth(0.7);
  doc.line(mg, y, mg + 55, y);
  y += 9;

  // ── Summary box ─────────────────────────────────────────────────────────────
  const summaryText = data.summary ?? DEFAULT_SUMMARIES[data.type];
  {
    const lines = doc.splitTextToSize(summaryText, cW - 10) as string[];
    const boxH = lines.length * 5.5 + 9;
    doc.setFillColor(245, 245, 247);
    doc.roundedRect(mg, y, cW, boxH, 3, 3, "F");
    doc.setTextColor(50, 50, 55);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(lines, mg + 5, y + 7);
    y += boxH + 10;
  }

  // ── KPIs grid ───────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(29, 29, 31);
  doc.text("Indicateurs clés", mg, y);
  y += 6;

  const cols = 3;
  const kW = cW / cols;
  const kH = 23;
  const kGap = 3;

  data.kpis.forEach((kpi, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = mg + col * kW;
    const ky = y + row * (kH + kGap);

    doc.setFillColor(245, 245, 247);
    doc.roundedRect(x + 1, ky, kW - 2, kH, 2, 2, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(110, 110, 115);
    doc.text(kpi.label, x + 5, ky + 7);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12.5);
    doc.setTextColor(29, 29, 31);
    doc.text(kpi.value, x + 5, ky + 17);
  });

  const kRows = Math.ceil(data.kpis.length / cols);
  y += kRows * (kH + kGap) + 10;

  // ── Actions / Plan d'optimisation ───────────────────────────────────────────
  const sectionTitle =
    data.type === "diagnostic" ? "Plan d'optimisation" : "Actions prioritaires";
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(29, 29, 31);
  doc.text(sectionTitle, mg, y);
  y += 7;

  ACTIONS[data.type].forEach((action, i) => {
    // Numbered circle
    doc.setFillColor(0, 113, 227);
    doc.circle(mg + 3.5, y - 1.2, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text(String(i + 1), mg + 3.5, y - 0.4, { align: "center" });

    doc.setTextColor(29, 29, 31);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    const lines = doc.splitTextToSize(action, cW - 11) as string[];
    doc.text(lines, mg + 9, y);
    y += lines.length * 5.5 + 3;
  });

  // ── Footer ──────────────────────────────────────────────────────────────────
  const footerY = 284;
  doc.setDrawColor(215, 215, 220);
  doc.setLineWidth(0.3);
  doc.line(mg, footerY, W - mg, footerY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(150, 150, 155);
  doc.text("scalyo.com — Document confidentiel", mg, footerY + 5);
  doc.text(genDate, W - mg, footerY + 5, { align: "right" });

  // ── Download ────────────────────────────────────────────────────────────────
  const slug = { weekly: "hebdo", monthly: "mensuel", diagnostic: "diagnostic" }[data.type];
  doc.save(`scalyo-rapport-${slug}-${new Date().toISOString().slice(0, 10)}.pdf`);
}
