import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { PlanType } from "@/contexts/AuthContext";
import type { Json } from "@/integrations/supabase/types";

const planHierarchy: Record<PlanType, number> = { datadiag: 0, growthpilot: 1, loyaltyloop: 2 };
const hasAccess = (userPlan: PlanType, required: PlanType) =>
  planHierarchy[userPlan] >= planHierarchy[required];

interface UseAiGenerationReturn {
  generatingAnalysis: boolean;
  generate: (
    userId: string,
    plan: PlanType,
    companyData: Record<string, unknown> | null,
    onSuccess: () => Promise<void>
  ) => Promise<{ ok: boolean; message: string }>;
}

export function useAiGeneration(): UseAiGenerationReturn {
  const [generatingAnalysis, setGeneratingAnalysis] = useState(false);

  const generate = useCallback(async (
    userId: string,
    plan: PlanType,
    companyData: Record<string, unknown> | null,
    onSuccess: () => Promise<void>
  ) => {
    setGeneratingAnalysis(true);
    try {
      const services: PlanType[] = ["datadiag"];
      if (hasAccess(plan, "growthpilot")) services.push("growthpilot");
      if (hasAccess(plan, "loyaltyloop")) services.push("loyaltyloop");

      for (const service of services) {
        const { data, error } = await supabase.functions.invoke(service, {
          body: companyData ?? {},
        });
        if (error) { console.error(`${service} error:`, error); continue; }
        await supabase.from("ai_results").upsert(
          { user_id: userId, service, results: data as Json },
          { onConflict: "user_id,service" }
        );
      }
      await onSuccess();
      return { ok: true, message: "Analyse terminée !" };
    } catch (e) {
      console.error("Generate error:", e);
      return { ok: false, message: "Impossible de générer l'analyse." };
    } finally {
      setGeneratingAnalysis(false);
    }
  }, []);

  return { generatingAnalysis, generate };
}
