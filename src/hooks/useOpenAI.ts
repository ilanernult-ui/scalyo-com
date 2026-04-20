import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { PlanType } from "@/contexts/AuthContext";

export interface OpenAIMessage {
  role: "assistant" | "user";
  content: string;
}

const getFallbackResponse = (activeTab: string, messages: OpenAIMessage[]) => {
  const lastUserMessage = messages.filter((m) => m.role === "user").slice(-1)[0]?.content ?? "";
  const normalized = lastUserMessage.toLowerCase();

  if (activeTab === "growthpilot" || normalized.includes("croiss") || normalized.includes("mrr") || normalized.includes("ca")) {
    return "Je ne peux pas accéder à l’IA pour le moment. En attendant, concentrez-vous sur vos leviers de croissance les plus performants, suivez votre MRR chaque semaine et optimisez vos canaux à meilleur ROI.";
  }
  if (activeTab === "loyaltyloop" || normalized.includes("churn") || normalized.includes("fidél")) {
    return "L’IA est temporairement indisponible. Analysez vos clients à risque, segmentez vos VIP et lancez des actions de réengagement ciblées pour réduire le churn.";
  }
  if (activeTab === "datadiag" || normalized.includes("diagn") || normalized.includes("marge") || normalized.includes("coût")) {
    return "Je ne peux pas accéder à l’IA actuellement. Vérifiez vos marges, identifiez vos coûts fixes élevés et priorisez les actions à fort impact sur la rentabilité.";
  }
  return "L’IA est temporairement indisponible. Réessayez dans quelques instants.";
};

export function useOpenAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendChat = useCallback(async (
    messages: OpenAIMessage[],
    activeTab: string,
    plan: PlanType
  ) => {
    setError(null);
    setIsLoading(true);

    try {
      const { data, error: invokeError } = await supabase.functions.invoke("scalyo-chat", {
        body: { messages, activeTab, plan },
      });

      if (!invokeError && data && typeof data === "object" && "text" in data && typeof (data as { text?: unknown }).text === "string") {
        return String((data as { text?: string }).text);
      }

      console.warn("scalyo-chat function failed:", invokeError, data);
      return getFallbackResponse(activeTab, messages);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setError(message);
      console.warn("useOpenAI sendChat error:", err);
      return getFallbackResponse(activeTab, messages);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, sendChat };
}
