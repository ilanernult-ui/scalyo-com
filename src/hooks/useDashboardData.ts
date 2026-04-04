import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

interface UseDashboardDataReturn {
  companyData: Record<string, unknown> | null;
  dataConnected: boolean;
  aiResults: Record<string, Json>;
  loadAiResults: () => Promise<void>;
  onWizardComplete: () => void;
}

export function useDashboardData(userId: string | undefined): UseDashboardDataReturn {
  const [companyData, setCompanyData] = useState<Record<string, unknown> | null>(null);
  const [dataConnected, setDataConnected] = useState(false);
  const [aiResults, setAiResults] = useState<Record<string, Json>>({});

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
          setDataConnected(true);
          setCompanyData(data as unknown as Record<string, unknown>);
        }
      });
    loadAiResults();
  }, [userId, loadAiResults]);

  const onWizardComplete = useCallback(() => {
    setDataConnected(true);
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

  return { companyData, dataConnected, aiResults, loadAiResults, onWizardComplete };
}
