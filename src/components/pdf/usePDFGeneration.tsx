import { useCallback, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import type { ReportType } from "@/hooks/useReports";

export interface PdfGenerationData {
  companyName?: string;
  period?: string;
  focus?: string;
  ca?: number;
  growth?: number;
  churn?: number;
  nps?: number;
  clients?: number;
  score?: number;
  heures?: number;
  date?: string;
}

const DEFAULTS = {
  companyName: "Démo Commerce SAS",
  period: "Ce mois",
  focus: "📦 Tout inclure",
  ca: 48500,
  growth: 12,
  churn: 4.2,
  nps: 62,
  clients: 1247,
  score: 84,
  heures: 8.5,
};

const PLAN_SLUG: Record<ReportType, string> = {
  diagnostic: "datadiag",
  monthly: "growthpilot",
  weekly: "loyaltyloop",
};

function normalizeData(data: PdfGenerationData) {
  return {
    companyName: data.companyName ?? DEFAULTS.companyName,
    period: data.period ?? DEFAULTS.period,
    focus: data.focus ?? DEFAULTS.focus,
    ca: data.ca ?? DEFAULTS.ca,
    growth: data.growth ?? DEFAULTS.growth,
    churn: data.churn ?? DEFAULTS.churn,
    nps: data.nps ?? DEFAULTS.nps,
    clients: data.clients ?? DEFAULTS.clients,
    score: data.score ?? DEFAULTS.score,
    heures: data.heures ?? DEFAULTS.heures,
    date: data.date ?? new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };
}

async function buildDocument(type: ReportType, data: PdfGenerationData) {
  const normalized = normalizeData(data);
  const { UniversalReportPDF } = await import("./UniversalReportPDF");

  return <UniversalReportPDF type={type} data={normalized} />;
}

export function usePDFGeneration() {
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const generatePdf = useCallback(
    async (type: ReportType, data: PdfGenerationData, fileName?: string): Promise<string> => {
      setGeneratingPdf(true);
      try {
        const document = await buildDocument(type, data);
        const blob = await pdf(document).toBlob();
        const generatedName = fileName ?? `scalyo-${PLAN_SLUG[type]}-rapport-${new Date().toISOString().slice(0, 7)}.pdf`;

        if (!blob) {
          throw new Error("Impossible de générer le PDF.");
        }

        saveAs(blob, generatedName);
        return generatedName;
      } finally {
        setGeneratingPdf(false);
      }
    },
    []
  );

  return { generatingPdf, generatePdf };
}
