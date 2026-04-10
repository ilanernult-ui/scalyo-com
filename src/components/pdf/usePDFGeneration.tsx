import { useCallback, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import type { ReportType } from "@/hooks/useReports";
import DataDiagPDF from "./DataDiagPDF";
import GrowthPilotPDF from "./GrowthPilotPDF";
import LoyaltyLoopPDF from "./LoyaltyLoopPDF";

export interface PdfGenerationData {
  companyName?: string;
  sector?: string;
  monthlyRevenue?: number;
  clientsCount?: number;
  industry?: string;
  generatedAt?: string;
}

const DEFAULTS = {
  companyName: "Démo Commerce SAS",
  sector: "E-commerce",
  monthlyRevenue: 48500,
  clientsCount: 1247,
  industry: "E-commerce",
};

const PLAN_SLUG: Record<ReportType, string> = {
  diagnostic: "datadiag",
  monthly: "growthpilot",
  weekly: "loyaltyloop",
};

function normalizeData(data: PdfGenerationData) {
  return {
    companyName: data.companyName ?? DEFAULTS.companyName,
    sector: data.sector ?? DEFAULTS.sector,
    monthlyRevenue: data.monthlyRevenue ?? DEFAULTS.monthlyRevenue,
    clientsCount: data.clientsCount ?? DEFAULTS.clientsCount,
    industry: data.industry ?? data.sector ?? DEFAULTS.industry,
    generatedAt: data.generatedAt ?? new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };
}

function buildDocument(type: ReportType, data: PdfGenerationData) {
  const normalized = normalizeData(data);

  if (type === "diagnostic") {
    return <DataDiagPDF {...normalized} />;
  }

  if (type === "monthly") {
    return <GrowthPilotPDF {...normalized} />;
  }

  return <LoyaltyLoopPDF {...normalized} />;
}

export function usePDFGeneration() {
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const generatePdf = useCallback(
    async (type: ReportType, data: PdfGenerationData, fileName?: string): Promise<string> => {
      setGeneratingPdf(true);
      try {
        const document = buildDocument(type, data);
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
