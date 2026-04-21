import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface DetectedProblem {
  id: string;
  title: string;
  description: string;
  criticality: "critical" | "important" | "moderate";
  category: string | null;
  monthly_loss_eur: number;
  weekly_hours_lost: number;
  probable_cause: string | null;
  trend: "up" | "down" | "stable";
  trend_delta_pct: number;
  resolved: boolean;
  rank: number;
}

export interface LossPoint {
  period_month: string;
  category: string;
  amount_eur: number;
  explanation: string | null;
}

export interface SavingsSummary {
  thisMonth: number;
  total: number;
  recent: { id: string; amount_eur: number; description: string | null; occurred_at: string }[];
}

export interface NotificationItem {
  id: string;
  type: "info" | "success" | "warning" | "critical";
  title: string;
  message: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
}

// Wrap a promise with a timeout so a hung request can never block the UI.
function withTimeout<T>(promise: PromiseLike<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`[${label}] timeout after ${ms}ms`)), ms);
    Promise.resolve(promise).then(
      (v) => { clearTimeout(timer); resolve(v); },
      (e) => { clearTimeout(timer); reject(e); },
    );
  });
}

export function useDashboardEnrichment(userId: string | undefined) {
  const [problems, setProblems] = useState<DetectedProblem[]>([]);
  const [losses, setLosses] = useState<LossPoint[]>([]);
  const [savings, setSavings] = useState<SavingsSummary>({ thisMonth: 0, total: 0, recent: [] });
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const TIMEOUT = 10000;

    const [problemsRes, lossesRes, savingsRes, notifsRes] = await Promise.allSettled([
      withTimeout(
        supabase.from("detected_problems").select("*").eq("user_id", userId).order("rank", { ascending: true }).limit(5),
        TIMEOUT, "detected_problems"
      ),
      withTimeout(
        supabase.from("loss_history").select("period_month,category,amount_eur,explanation").eq("user_id", userId).order("period_month", { ascending: true }),
        TIMEOUT, "loss_history"
      ),
      withTimeout(
        supabase.from("savings_log").select("id,amount_eur,description,occurred_at").eq("user_id", userId).order("occurred_at", { ascending: false }),
        TIMEOUT, "savings_log"
      ),
      withTimeout(
        supabase.from("notifications").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(20),
        TIMEOUT, "notifications"
      ),
    ]);

    const failures: string[] = [];

    if (problemsRes.status === "fulfilled") {
      setProblems(((problemsRes.value as { data: unknown }).data ?? []) as DetectedProblem[]);
    } else {
      console.warn("[useDashboardEnrichment] problems failed:", problemsRes.reason);
      failures.push("problems");
      setProblems([]);
    }

    if (lossesRes.status === "fulfilled") {
      setLosses(((lossesRes.value as { data: unknown }).data ?? []) as LossPoint[]);
    } else {
      console.warn("[useDashboardEnrichment] losses failed:", lossesRes.reason);
      failures.push("losses");
      setLosses([]);
    }

    if (savingsRes.status === "fulfilled") {
      const allSavings = ((savingsRes.value as { data: SavingsSummary["recent"] | null }).data) ?? [];
      const thisMonth = allSavings
        .filter((s) => new Date(s.occurred_at) >= startOfMonth)
        .reduce((sum, s) => sum + Number(s.amount_eur), 0);
      const total = allSavings.reduce((sum, s) => sum + Number(s.amount_eur), 0);
      setSavings({ thisMonth, total, recent: allSavings.slice(0, 5) });
    } else {
      console.warn("[useDashboardEnrichment] savings failed:", savingsRes.reason);
      failures.push("savings");
      setSavings({ thisMonth: 0, total: 0, recent: [] });
    }

    if (notifsRes.status === "fulfilled") {
      setNotifications(((notifsRes.value as { data: unknown }).data ?? []) as NotificationItem[]);
    } else {
      console.warn("[useDashboardEnrichment] notifications failed:", notifsRes.reason);
      failures.push("notifications");
      setNotifications([]);
    }

    if (failures.length > 0) {
      setError(`Certaines données n'ont pas pu être chargées (${failures.join(", ")}).`);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => { reload(); }, [reload]);

  const markAllNotificationsRead = useCallback(async () => {
    if (!userId) return;
    await supabase.from("notifications").update({ read: true }).eq("user_id", userId).eq("read", false);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { problems, losses, savings, notifications, unreadCount, loading, error, reload, markAllNotificationsRead };
}
