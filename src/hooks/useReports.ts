import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ReportType = "weekly" | "monthly" | "diagnostic";
export type ReportStatus = "generating" | "ready" | "error";

export interface Report {
  id: string;
  user_id: string;
  type: ReportType;
  title: string;
  period_label: string | null;
  status: ReportStatus;
  summary: string | null;
  file_url: string | null;
  email_sent: boolean;
  created_at: string;
  updated_at: string;
}

interface UseReportsReturn {
  reports: Report[];
  loading: boolean;
  generating: boolean;
  generateReport: (type: ReportType, companyName?: string) => Promise<void>;
  markEmailSent: (id: string) => Promise<void>;
}

// Simulated report summaries per type
const SUMMARIES: Record<ReportType, string> = {
  weekly: "Cette semaine, votre MRR a progressé de +3,2%. 2 recommandations P0 ont été traitées, récupérant ~4 200€. Les canaux SEO et email continuent de surperformer. Action prioritaire : relancer 3 clients inactifs depuis 45+ jours.",
  monthly: "Ce mois-ci : MRR de 41 500€ (+12% MoM), ARR projeté de 498k€. Taux de churn en baisse à 4,2% (-26% vs M-6). 5 recommandations IA appliquées pour un impact estimé de +6 800€. Score business global : 74/100.",
  diagnostic: "Diagnostic complet de votre business : Score 360° à 74/100. Points forts : marge brute (68%) et NPS (38). Points d'amélioration : délai moyen de paiement (45 jours) et adoption des connecteurs (48%). Potentiel d'optimisation : ~7 500€/mois.",
};

const PERIOD_LABELS: Record<ReportType, () => string> = {
  weekly: () => {
    const d = new Date();
    const monday = new Date(d.setDate(d.getDate() - d.getDay() + 1));
    return `Semaine du ${monday.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`;
  },
  monthly: () => new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" }),
  diagnostic: () => `Diagnostic du ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`,
};

export function useReports(userId: string | undefined): UseReportsReturn {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetch = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("reports")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (data) setReports(data as unknown as Report[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetch(); }, [fetch]);

  const generateReport = useCallback(async (type: ReportType, companyName = "Votre entreprise") => {
    if (!userId) return;
    setGenerating(true);

    // Insert report in "generating" state
    const { data: inserted } = await supabase
      .from("reports")
      .insert({
        user_id: userId,
        type,
        title: `Rapport ${type === "weekly" ? "hebdomadaire" : type === "monthly" ? "mensuel" : "de diagnostic"} — ${companyName}`,
        period_label: PERIOD_LABELS[type](),
        status: "generating",
      })
      .select()
      .single();

    if (inserted) {
      setReports((prev) => [inserted as unknown as Report, ...prev]);
    }

    // Simulate PDF generation (replace with Edge Function)
    await new Promise((r) => setTimeout(r, 2200));

    const reportId = (inserted as unknown as Report | null)?.id;
    if (!reportId) { setGenerating(false); return; }

    const { data: updated } = await supabase
      .from("reports")
      .update({ status: "ready", summary: SUMMARIES[type], updated_at: new Date().toISOString() })
      .eq("id", reportId)
      .eq("user_id", userId)
      .select()
      .single();

    if (updated) {
      setReports((prev) => prev.map((r) => r.id === reportId ? updated as unknown as Report : r));
    }
    setGenerating(false);
  }, [userId]);

  const markEmailSent = useCallback(async (id: string) => {
    if (!userId) return;
    const { data } = await supabase
      .from("reports")
      .update({ email_sent: true, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();
    if (data) {
      setReports((prev) => prev.map((r) => r.id === id ? data as unknown as Report : r));
    }
  }, [userId]);

  return { reports, loading, generating, generateReport, markEmailSent };
}
