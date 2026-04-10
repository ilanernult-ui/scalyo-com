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
  generatingType: ReportType | null;
  generateReport: (type: ReportType, companyName?: string) => Promise<Report | null>;
  markEmailSent: (id: string) => Promise<void>;
}

const SUMMARIES: Record<ReportType, string> = {
  weekly: "Cette semaine, votre MRR a progressé de +3,2%. 2 recommandations P0 ont été traitées, récupérant ~4 200€.",
  monthly: "Ce mois-ci : MRR de 41 500€ (+12% MoM), ARR projeté de 498k€. Score business global : 74/100.",
  diagnostic: "Diagnostic complet : Score 360° à 74/100. Potentiel d'optimisation : ~7 500€/mois.",
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

const db = supabase as any;

export function useReports(userId: string | undefined): UseReportsReturn {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingType, setGeneratingType] = useState<ReportType | null>(null);

  const fetch = useCallback(async () => {
    if (!userId) return;
    const { data } = await db.from("reports").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (data) setReports(data as Report[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetch(); }, [fetch]);

  const generateReport = useCallback(async (type: ReportType, companyName = "Votre entreprise"): Promise<Report | null> => {
    if (!userId) return null;
    setGeneratingType(type);
    const { data: inserted } = await db.from("reports").insert({
      user_id: userId, type,
      title: `Rapport ${type === "weekly" ? "hebdomadaire" : type === "monthly" ? "mensuel" : "de diagnostic"} — ${companyName}`,
      period_label: PERIOD_LABELS[type](), status: "generating",
    }).select().single();
    if (inserted) setReports((prev: Report[]) => [inserted as Report, ...prev]);

    await new Promise((r) => setTimeout(r, 2200));
    const reportId = (inserted as Report | null)?.id;
    if (!reportId) { setGeneratingType(null); return null; }

    const { data: updated } = await db.from("reports").update({ status: "ready", summary: SUMMARIES[type], updated_at: new Date().toISOString() }).eq("id", reportId).eq("user_id", userId).select().single();
    if (updated) setReports((prev: Report[]) => prev.map((r) => r.id === reportId ? updated as Report : r));
    setGeneratingType(null);
    return (updated as Report) ?? null;
  }, [userId]);

  const markEmailSent = useCallback(async (id: string) => {
    if (!userId) return;
    const { data } = await db.from("reports").update({ email_sent: true, updated_at: new Date().toISOString() }).eq("id", id).eq("user_id", userId).select().single();
    if (data) setReports((prev: Report[]) => prev.map((r) => r.id === id ? data as Report : r));
  }, [userId]);

  return { reports, loading, generatingType, generateReport, markEmailSent };
}
