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

// Simulated AI-generated recommendations (replace with Edge Function call)
const GENERATED_RECOS: Omit<Recommendation, "id" | "user_id" | "created_at" | "updated_at">[] = [
  {
    title: "Relancer 3 factures impayées > 60 jours",
    description: "3 factures totalisant 4 200€ sont en retard de plus de 60 jours. Une relance ciblée par email + téléphone peut récupérer ~80% du montant.",
    priority: "P0",
    status: "pending",
    impact_label: "~4 200€ récupérés",
    impact_type: "revenue",
    source: "ai",
    week_of: new Date().toISOString().slice(0, 10),
    completed_at: null,
  },
  {
    title: "Supprimer 2 abonnements SaaS inutilisés",
    description: "Notion Pro (34€/mois) et Loom Business (55€/mois) affichent 0 connexion depuis 45 jours. Résiliation immédiate recommandée.",
    priority: "P0",
    status: "pending",
    impact_label: "89€/mois économisés",
    impact_type: "savings",
    source: "ai",
    week_of: new Date().toISOString().slice(0, 10),
    completed_at: null,
  },
  {
    title: "Automatiser les relances clients",
    description: "6h/semaine sont consacrées à des relances manuelles. Un outil de séquence email (Brevo, Lemlist) peut automatiser 90% de ce flux.",
    priority: "P1",
    status: "pending",
    impact_label: "6h/semaine gagnées",
    impact_type: "time",
    source: "ai",
    week_of: new Date().toISOString().slice(0, 10),
    completed_at: null,
  },
  {
    title: "Lancer un programme de parrainage",
    description: "Vos clients bouche-à-oreille convertissent 2.2x mieux que vos canaux payants. Un programme structuré peut doubler ces leads.",
    priority: "P1",
    status: "pending",
    impact_label: "+8 leads qualifiés/mois",
    impact_type: "revenue",
    source: "ai",
    week_of: new Date().toISOString().slice(0, 10),
    completed_at: null,
  },
  {
    title: "Réduire budget LinkedIn Ads de 40%",
    description: "Le CPA LinkedIn est 3x supérieur au SEO organique (142€ vs 12€). Réallouer ce budget vers du contenu SEO a un ROI supérieur.",
    priority: "P1",
    status: "pending",
    impact_label: "−284€/mois économisés",
    impact_type: "savings",
    source: "ai",
    week_of: new Date().toISOString().slice(0, 10),
    completed_at: null,
  },
  {
    title: "Déployer tutoriel in-app connecteurs données",
    description: "Le taux d'adoption des connecteurs est de 48%. Un guide interactif dans les 5 premiers jours peut augmenter l'activation de 23%.",
    priority: "P2",
    status: "pending",
    impact_label: "+23% activation",
    impact_type: "other",
    source: "ai",
    week_of: new Date().toISOString().slice(0, 10),
    completed_at: null,
  },
  {
    title: "Enquête NPS sur segment PME Tech",
    description: "Ce segment affiche un score churn de 42/100. Une enquête de satisfaction ciblée permettra d'identifier les irritants clés.",
    priority: "P2",
    status: "pending",
    impact_label: "Identifier friction onboarding",
    impact_type: "other",
    source: "ai",
    week_of: new Date().toISOString().slice(0, 10),
    completed_at: null,
  },
  {
    title: "Automatiser le reporting hebdomadaire",
    description: "3h/semaine sont consacrées à la compilation manuelle de métriques. Un tableau de bord automatisé récupère ce temps.",
    priority: "P3",
    status: "pending",
    impact_label: "3h/semaine gagnées",
    impact_type: "time",
    source: "ai",
    week_of: new Date().toISOString().slice(0, 10),
    completed_at: null,
  },
];

export function useRecommendations(userId: string | undefined): UseRecommendationsReturn {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetch = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("recommendations")
      .select("*")
      .eq("user_id", userId)
      .order("priority", { ascending: true })
      .order("created_at", { ascending: false });
    if (data) setRecommendations(data as unknown as Recommendation[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetch(); }, [fetch]);

  const updateStatus = useCallback(async (id: string, status: RecommendationStatus) => {
    if (!userId) return;
    const completed_at = status === "done" ? new Date().toISOString() : null;
    const { data } = await supabase
      .from("recommendations")
      .update({ status, completed_at, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();
    if (data) {
      setRecommendations((prev) =>
        prev.map((r) => r.id === id ? data as unknown as Recommendation : r)
      );
    }
  }, [userId]);

  const generateWeekly = useCallback(async () => {
    if (!userId) return;
    setGenerating(true);
    // Simulate AI generation delay (replace with Edge Function call)
    await new Promise((r) => setTimeout(r, 1800));

    // Check if already generated this week
    const weekOf = new Date().toISOString().slice(0, 10);
    const existing = recommendations.filter((r) => r.week_of === weekOf && r.source === "ai");
    if (existing.length > 0) {
      setGenerating(false);
      return;
    }

    // Insert generated recommendations
    const rows = GENERATED_RECOS.map((r) => ({ ...r, user_id: userId }));
    const { data } = await supabase
      .from("recommendations")
      .insert(rows)
      .select();
    if (data) {
      setRecommendations((prev) => [...(data as unknown as Recommendation[]), ...prev]);
    }
    setGenerating(false);
  }, [userId, recommendations]);

  return { recommendations, loading, updateStatus, generateWeekly, generating };
}
