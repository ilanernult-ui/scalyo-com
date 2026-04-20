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

export function useDashboardEnrichment(userId: string | undefined) {
  const [problems, setProblems] = useState<DetectedProblem[]>([]);
  const [losses, setLosses] = useState<LossPoint[]>([]);
  const [savings, setSavings] = useState<SavingsSummary>({ thisMonth: 0, total: 0, recent: [] });
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [problemsRes, lossesRes, savingsRes, notifsRes] = await Promise.all([
      supabase.from("detected_problems").select("*").eq("user_id", userId).order("rank", { ascending: true }).limit(5),
      supabase.from("loss_history").select("period_month,category,amount_eur,explanation").eq("user_id", userId).order("period_month", { ascending: true }),
      supabase.from("savings_log").select("id,amount_eur,description,occurred_at").eq("user_id", userId).order("occurred_at", { ascending: false }),
      supabase.from("notifications").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(20),
    ]);

    setProblems((problemsRes.data ?? []) as DetectedProblem[]);
    setLosses((lossesRes.data ?? []) as LossPoint[]);

    const allSavings = savingsRes.data ?? [];
    const thisMonth = allSavings
      .filter((s) => new Date(s.occurred_at) >= startOfMonth)
      .reduce((sum, s) => sum + Number(s.amount_eur), 0);
    const total = allSavings.reduce((sum, s) => sum + Number(s.amount_eur), 0);
    setSavings({ thisMonth, total, recent: allSavings.slice(0, 5) });

    setNotifications((notifsRes.data ?? []) as NotificationItem[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => { reload(); }, [reload]);

  const markAllNotificationsRead = useCallback(async () => {
    if (!userId) return;
    await supabase.from("notifications").update({ read: true }).eq("user_id", userId).eq("read", false);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { problems, losses, savings, notifications, unreadCount, loading, reload, markAllNotificationsRead };
}
