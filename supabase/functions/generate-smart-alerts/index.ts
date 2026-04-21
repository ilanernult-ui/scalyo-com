import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing auth" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const user = userData.user;

    // Load context
    const { data: company } = await supabase
      .from("company_data").select("*").eq("user_id", user.id).maybeSingle();

    const { data: problems } = await supabase
      .from("detected_problems").select("title, description, monthly_loss_eur, criticality")
      .eq("user_id", user.id).order("rank").limit(5);

    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) {
      return new Response(JSON.stringify({ error: "OPENAI_API_KEY missing" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `Tu es un analyste business IA. Génère 4 à 6 alertes intelligentes hiérarchisées pour cette PME française. Chaque alerte doit identifier un signal faible ou un risque concret basé sur les données.

Réponds STRICTEMENT en JSON valide :
{"alerts":[{
  "severity":"red|orange|green",
  "category":"finance|marketing|operations|clients|general",
  "title":"Titre court (max 80 car)",
  "description":"Description claire et factuelle (2 phrases)",
  "impact_estimate":"Impact chiffré ex: -2 400€/mois ou +5h/sem",
  "recommended_action":"Action concrète à mener immédiatement"
}]}

Règles : red = urgent (perte importante), orange = attention (à surveiller), green = opportunité (gain possible).`;

    const userPrompt = `Contexte entreprise :
${JSON.stringify({
  sector: company?.sector,
  revenue: company?.annual_revenue,
  margin: company?.gross_margin,
  unpaid: company?.unpaid_amount,
  churn: company?.main_churn_reason,
  cash: company?.cash_available,
}, null, 2)}

Problèmes détectés :
${JSON.stringify(problems ?? [], null, 2)}

Génère les alertes IA maintenant.`;

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${openaiKey}` },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      }),
    });

    if (!aiRes.ok) {
      const t = await aiRes.text();
      return new Response(JSON.stringify({ error: "AI failed", detail: t }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiRes.json();
    const content = aiJson.choices?.[0]?.message?.content ?? "{}";
    let parsed: any = {};
    try { parsed = JSON.parse(content); } catch { parsed = { alerts: [] }; }

    const alerts = (parsed.alerts ?? []).slice(0, 6).map((a: any) => ({
      user_id: user.id,
      severity: ["red", "orange", "green"].includes(a.severity) ? a.severity : "orange",
      category: a.category ?? "general",
      title: String(a.title ?? "Alerte").slice(0, 200),
      description: String(a.description ?? ""),
      impact_estimate: a.impact_estimate ?? null,
      recommended_action: a.recommended_action ?? null,
      status: "active",
    }));

    if (alerts.length > 0) {
      const { error: insErr } = await supabase.from("smart_alerts").insert(alerts);
      if (insErr) console.error("[smart-alerts] insert error", insErr);
    }

    return new Response(JSON.stringify({ ok: true, count: alerts.length, alerts }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("[generate-smart-alerts] error", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
