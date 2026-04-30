import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type RecommendationPriority = "P0" | "P1" | "P2" | "P3";
export type RecommendationStatus = "pending" | "in_progress" | "done";
export type RecommendationImpactType = "revenue" | "savings" | "time" | "other";

export interface Recommendation {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  priority: RecommendationPriority;
  status: RecommendationStatus;
  impact_label: string | null;
  impact_type: RecommendationImpactType | null;
  source: "ai" | "manual";
  week_of: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

interface UseRecommendationsReturn {
  recommendations: Recommendation[];
  loading: boolean;
  updateStatus: (id: string, status: RecommendationStatus) => Promise<void>;
  generateWeekly: () => Promise<void>;
  generating: boolean;
}

// No fake data: AI recommendations are only created from a real generation source.
const GENERATED_RECOS: Omit<Recommendation, "id" | "user_id" | "created_at" | "updated_at">[] = [];

const db = supabase as any;

export function useRecommendations(userId: string | undefined): UseRecommendationsReturn {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetch = useCallback(async () => {
    if (!userId) return;
    const { data } = await db.from("recommendations").select("*").eq("user_id", userId).order("priority", { ascending: true }).order("created_at", { ascending: false });
    if (data) setRecommendations(data as Recommendation[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetch(); }, [fetch]);

  const updateStatus = useCallback(async (id: string, status: RecommendationStatus) => {
    if (!userId) return;
    const completed_at = status === "done" ? new Date().toISOString() : null;
    const { data } = await db.from("recommendations").update({ status, completed_at, updated_at: new Date().toISOString() }).eq("id", id).eq("user_id", userId).select().single();
    if (data) setRecommendations((prev: Recommendation[]) => prev.map((r) => r.id === id ? data as Recommendation : r));
  }, [userId]);

  const generateWeekly = useCallback(async () => {
    if (!userId) return;
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1800));
    const weekOf = new Date().toISOString().slice(0, 10);
    const existing = recommendations.filter((r) => r.week_of === weekOf && r.source === "ai");
    if (existing.length > 0) { setGenerating(false); return; }
    const rows = GENERATED_RECOS.map((r) => ({ ...r, user_id: userId }));
    const { data } = await db.from("recommendations").insert(rows).select();
    if (data) setRecommendations((prev: Recommendation[]) => [...(data as Recommendation[]), ...prev]);
    setGenerating(false);
  }, [userId, recommendations]);

  return { recommendations, loading, updateStatus, generateWeekly, generating };
}
