import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type PlanType = "datadiag" | "growthpilot" | "loyaltyloop";
export type PlanStatus = "active" | "cancelled" | "past_due";

interface SubscriptionInfo {
  plan: PlanType;
  planStatus: PlanStatus;
  subscriptionEnd: string | null;
  stripeSubscriptionId: string | null;
  subscribed: boolean;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  plan: PlanType;
  planStatus: PlanStatus;
  subscriptionEnd: string | null;
  stripeSubscriptionId: string | null;
  refreshSubscription: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  plan: "datadiag",
  planStatus: "active",
  subscriptionEnd: null,
  stripeSubscriptionId: null,
  refreshSubscription: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [sub, setSub] = useState<SubscriptionInfo>({
    plan: "datadiag",
    planStatus: "active",
    subscriptionEnd: null,
    stripeSubscriptionId: null,
    subscribed: false,
  });

  const checkSubscription = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) {
        console.error("check-subscription error:", error);
        return;
      }
      if (data) {
        setSub({
          plan: (data.plan as PlanType) || "datadiag",
          planStatus: (data.plan_status as PlanStatus) || "active",
          subscriptionEnd: data.subscription_end || null,
          stripeSubscriptionId: data.stripe_subscription_id || null,
        });
      }
    } catch (e) {
      console.error("Failed to check subscription:", e);
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user) {
          setTimeout(() => checkSubscription(), 0);
        } else {
          setSub({ plan: "datadiag", planStatus: "active", subscriptionEnd: null, stripeSubscriptionId: null });
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) checkSubscription();
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [checkSubscription]);

  // Auto-refresh subscription every 60s
  useEffect(() => {
    if (!session?.user) return;
    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [session?.user, checkSubscription]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSub({ plan: "datadiag", planStatus: "active", subscriptionEnd: null, stripeSubscriptionId: null });
  };

  return (
    <AuthContext.Provider value={{
      session,
      user: session?.user ?? null,
      loading,
      plan: sub.plan,
      planStatus: sub.planStatus,
      subscriptionEnd: sub.subscriptionEnd,
      stripeSubscriptionId: sub.stripeSubscriptionId,
      refreshSubscription: checkSubscription,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
