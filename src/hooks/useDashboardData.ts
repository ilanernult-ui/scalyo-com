import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

interface UseDashboardDataReturn {
  companyData: Record<string, unknown> | null;
  dataConnected: boolean;
  aiResults: Record<string, Json>;
  loadAiResults: () => Promise<void>;
  onWizardComplete: () => void;
  resetUserData: () => Promise<{ error: string | null }>;
}

export function useDashboardData(userId: string | undefined): UseDashboardDataReturn {
  const [companyData, setCompanyData] = useState<Record<string, unknown> | null>(null);
  const [aiResults, setAiResults] = useState<Record<string, Json>>({});

  const dataConnected = useMemo(
    () => !!companyData || Object.keys(aiResults).length > 0,
    [companyData, aiResults],
  );

  const loadAiResults = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("ai_results")
      .select("service, results")
      .eq("user_id", userId);
    if (data) {
      const map: Record<string, Json> = {};
      data.forEach((r) => { map[r.service] = r.results; });
      setAiResults(map);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from("company_data")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setCompanyData(data as unknown as Record<string, unknown>);
        }
      });
    loadAiResults();
  }, [userId, loadAiResults]);

  const onWizardComplete = useCallback(() => {
    if (userId) {
      supabase
        .from("company_data")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle()
        .then(({ data }) => {
          if (data) setCompanyData(data as unknown as Record<string, unknown>);
        });
    }
    loadAiResults();
  }, [userId, loadAiResults]);

  const resetUserData = useCallback(async () => {
    if (!userId) return { error: "Utilisateur non identifié" };
    const [companyRes, aiRes] = await Promise.all([
      supabase.from("company_data").delete().eq("user_id", userId),
      supabase.from("ai_results").delete().eq("user_id", userId),
    ]);
    if (companyRes.error || aiRes.error) {
      return { error: companyRes.error?.message || aiRes.error?.message || "Erreur" };
    }
    setCompanyData(null);
    setAiResults({});
    return { error: null };
  }, [userId]);

  return { companyData, dataConnected, aiResults, loadAiResults, onWizardComplete, resetUserData };
}
