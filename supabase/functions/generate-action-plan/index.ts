import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AIAction {
  title: string;
  description: string;
  category: "finance" | "marketing" | "operations" | "rh";
  difficulty: "facile" | "moyen" | "difficile";
  delay: "aujourd_hui" | "cette_semaine" | "ce_mois";
  impact_eur: number;
  impact_hours_weekly: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY missing");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing auth" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;

    // Pull company context for personalization
    const { data: company } = await supabase
      .from("company_data")
      .select("company_name,sector,annual_revenue,gross_margin,net_margin,active_clients,unpaid_amount")
      .eq("user_id", userId)
      .maybeSingle();

    const companyCtx = company
      ? `Entreprise: ${company.company_name ?? "N/A"} · Secteur: ${company.sector ?? "N/A"} · CA: ${company.annual_revenue ?? "N/A"}€ · Marge brute: ${company.gross_margin ?? "N/A"}% · Marge nette: ${company.net_margin ?? "N/A"}% · Clients actifs: ${company.active_clients ?? "N/A"} · Impayés: ${company.unpaid_amount ?? 0}€`
      : "Aucune donnée d'entreprise. Génère des actions génériques pour une PME française.";

    const systemPrompt = `Tu es un consultant business senior. Tu génères des actions opérationnelles pour un Kanban "Plan d'action IA".
Réponds STRICTEMENT en JSON valide, sans markdown ni texte autour, avec ce format :
{"actions":[{"title":"...","description":"...","category":"finance|marketing|operations|rh","difficulty":"facile|moyen|difficile","delay":"aujourd_hui|cette_semaine|ce_mois","impact_eur":1500,"impact_hours_weekly":2}]}
Génère 6 actions concrètes, variées (couvre les 4 catégories), avec impact chiffré réaliste.`;

    const userPrompt = `Contexte : ${companyCtx}\nGénère 6 actions priorisées par ROI/effort.`;

    const aiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 1500,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!aiResp.ok) {
      const t = await aiResp.text();
      console.error("OpenAI error", aiResp.status, t);
      throw new Error("AI service error");
    }

    const aiData = await aiResp.json();
    const content: string = aiData.choices?.[0]?.message?.content ?? "{}";
    let parsed: { actions?: AIAction[] };
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error("Réponse IA non JSON");
    }
    const actions = (parsed.actions ?? []).slice(0, 6);
    if (actions.length === 0) throw new Error("Aucune action générée");

    // Determine starting position
    const { data: existing } = await supabase
      .from("action_plan")
      .select("position")
      .eq("user_id", userId)
      .eq("status", "todo")
      .order("position", { ascending: false })
      .limit(1);
    const startPos = (existing?.[0]?.position ?? -1) + 1;

    const rows = actions.map((a, i) => ({
      user_id: userId,
      title: String(a.title ?? "Action").slice(0, 200),
      description: String(a.description ?? ""),
      category: ["finance", "marketing", "operations", "rh"].includes(a.category) ? a.category : "operations",
      difficulty: ["facile", "moyen", "difficile"].includes(a.difficulty) ? a.difficulty : "moyen",
      delay: ["aujourd_hui", "cette_semaine", "ce_mois"].includes(a.delay) ? a.delay : "cette_semaine",
      status: "todo",
      impact_eur: Number(a.impact_eur) || 0,
      impact_hours_weekly: Number(a.impact_hours_weekly) || 0,
      position: startPos + i,
    }));

    const { data: inserted, error: insErr } = await supabase
      .from("action_plan")
      .insert(rows)
      .select("*");

    if (insErr) {
      console.error("insert error", insErr);
      throw insErr;
    }

    return new Response(JSON.stringify({ actions: inserted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-action-plan error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
