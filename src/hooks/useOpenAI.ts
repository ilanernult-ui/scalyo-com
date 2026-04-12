import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { PlanType } from "@/contexts/AuthContext";

export interface OpenAIMessage {
  role: "assistant" | "user";
  content: string;
}

const buildSystemPrompt = (activeTab: string, plan: PlanType) => {
  const basePrompt = `Tu es un assistant business Scalyo pour le plan ${plan}. Réponds en français de façon claire, concise et orientée action.`;
  const tabPrompt = activeTab === "growthpilot"
    ? "Tu réponds en tant que co-pilote croissance : optimise le CA, le MRR et les leviers marketing."
    : activeTab === "loyaltyloop"
      ? "Tu réponds en tant qu'expert fidélisation : réduis le churn et améliore la rétention client."
      : activeTab === "datadiag"
        ? "Tu réponds en tant qu'expert diagnostic : analyse la santé financière, les marges et les opportunités de gains."
        : "Tu réponds en tant qu'assistant business général.";

  return `${basePrompt} ${tabPrompt}`;
};

const getFallbackResponse = (activeTab: string, messages: OpenAIMessage[]) => {
  const lastUserMessage = messages.filter((message) => message.role === "user").slice(-1)[0]?.content ?? "";
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

  return "L’IA est temporairement indisponible. Réessayez dans quelques instants ou vérifiez votre configuration OpenAI.";
};

export function useOpenAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "";
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY ?? "";

  const sendChat = useCallback(async (
    messages: OpenAIMessage[],
    activeTab: string,
    plan: PlanType
  ) => {
    setError(null);
    setIsLoading(true);

    const systemPrompt = buildSystemPrompt(activeTab, plan);

    try {
      if (SUPABASE_URL) {
        try {
          const { data, error: invokeError } = await supabase.functions.invoke("scalyo-chat", {
            body: { messages, activeTab, plan },
          });

          if (!invokeError && data && typeof data === "object" && "text" in data && typeof (data as { text?: unknown }).text === "string") {
            return String((data as { text?: string }).text);
          }

          console.warn("Supabase function failed or returned invalid payload. Falling back to OpenAI direct.", invokeError, data);
        } catch (supabaseError) {
          console.warn("Supabase function failed, trying OpenAI directly.", supabaseError);
        }
      }

      if (!OPENAI_API_KEY) {
        console.warn("Missing VITE_OPENAI_API_KEY in .env. Add it to use direct OpenAI fallback.");
      } else {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "system", content: systemPrompt }, ...messages],
            max_tokens: 400,
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.choices?.[0]?.message?.content) {
            return String(data.choices[0].message.content);
          }

          console.warn("OpenAI direct response invalid", data);
        } else {
          const payload = await response.text();
          console.warn("OpenAI direct request failed", response.status, payload);
        }
      }

      return getFallbackResponse(activeTab, messages);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setError(message);
      console.warn("useOpenAI sendChat error:", err);
      return getFallbackResponse(activeTab, messages);
    } finally {
      setIsLoading(false);
    }
  }, [SUPABASE_URL, OPENAI_API_KEY]);

  return {
    isLoading,
    error,
    sendChat,
  };
}
