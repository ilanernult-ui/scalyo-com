import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export const ONBOARDING_TOTAL_STEPS = 5;

interface OnboardingState {
  step: number;
  done: boolean;
  loading: boolean;
}

interface UseOnboardingReturn extends OnboardingState {
  setStep: (step: number) => Promise<void>;
  complete: () => Promise<void>;
}

export function useOnboarding(userId: string | undefined): UseOnboardingReturn {
  const [state, setState] = useState<OnboardingState>({ step: 0, done: false, loading: true });

  useEffect(() => {
    if (!userId) return;
    (supabase as any)
      .from("profiles")
      .select("onboarding_step, onboarding_done")
      .eq("id", userId)
      .single()
      .then(({ data }: any) => {
        if (data) {
          setState({
            step: data.onboarding_step ?? 0,
            done: data.onboarding_done ?? false,
            loading: false,
          });
        } else {
          setState((s) => ({ ...s, loading: false }));
        }
      });
  }, [userId]);

  const setStep = useCallback(async (step: number) => {
    if (!userId) return;
    setState((s) => ({ ...s, step }));
    await (supabase as any)
      .from("profiles")
      .update({ onboarding_step: step, updated_at: new Date().toISOString() })
      .eq("id", userId);
  }, [userId]);

  const complete = useCallback(async () => {
    if (!userId) return;
    setState((s) => ({ ...s, done: true, step: ONBOARDING_TOTAL_STEPS }));
    await (supabase as any)
      .from("profiles")
      .update({ onboarding_done: true, onboarding_step: ONBOARDING_TOTAL_STEPS, updated_at: new Date().toISOString() })
      .eq("id", userId);
  }, [userId]);

  return { ...state, setStep, complete };
}
