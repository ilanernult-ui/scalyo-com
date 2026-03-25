import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY not configured");

    // Authenticate user
    const authHeader = req.headers.get("authorization");
    if (!authHeader) throw new Error("Missing authorization header");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) throw new Error("Unauthorized");
    const userId = claimsData.claims.sub as string;

    const { messages, activeTab } = await req.json();
    if (!Array.isArray(messages)) throw new Error("messages must be an array");

    // Fetch company data for context
    const { data: companyData } = await supabase
      .from("company_data")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    // Fetch AI results for context
    const { data: aiResults } = await supabase
      .from("ai_results")
      .select("service, results")
      .eq("user_id", user.id);

    // Build context from real data
    let dataContext = "";
    if (companyData) {
      dataContext = `
Données de l'entreprise de l'utilisateur :
- Entreprise : ${companyData.company_name || "Non renseigné"}
- Secteur : ${companyData.sector || "Non renseigné"}
- Taille : ${companyData.company_size || "Non renseigné"}
- Salariés : ${companyData.employees ?? "Non renseigné"}
- CA annuel : ${companyData.annual_revenue ? companyData.annual_revenue + " €" : "Non renseigné"}
- CA mensuel en cours : ${companyData.current_month_revenue ? companyData.current_month_revenue + " €" : "Non renseigné"}
- Historique CA (6 mois) : ${JSON.stringify(companyData.revenue_history)}
- Charges fixes : ${companyData.fixed_costs ? companyData.fixed_costs + " €" : "Non renseigné"}
- Charges variables : ${companyData.variable_costs ? companyData.variable_costs + " €" : "Non renseigné"}
- Trésorerie disponible : ${companyData.cash_available ? companyData.cash_available + " €" : "Non renseigné"}
- Marge brute : ${companyData.gross_margin ? companyData.gross_margin + "%" : "Non renseigné"}
- Marge nette : ${companyData.net_margin ? companyData.net_margin + "%" : "Non renseigné"}
- Résultat net : ${companyData.net_income ? companyData.net_income + " €" : "Non renseigné"}
- Factures impayées : ${companyData.unpaid_invoices ?? "Non renseigné"} (${companyData.unpaid_amount ? companyData.unpaid_amount + " €" : ""})
- Délai paiement clients : ${companyData.avg_client_payment_days ? companyData.avg_client_payment_days + " jours" : "Non renseigné"}
- Délai paiement fournisseurs : ${companyData.avg_supplier_payment_days ? companyData.avg_supplier_payment_days + " jours" : "Non renseigné"}
- Clients actifs : ${companyData.active_clients ?? "Non renseigné"}
- Total clients : ${companyData.total_clients ?? "Non renseigné"}
- Clients actifs 30j : ${companyData.active_clients_30d ?? "Non renseigné"}
- Inactifs 60j : ${companyData.inactive_60d ?? "Non renseigné"}
- Inactifs 90j : ${companyData.inactive_90d ?? "Non renseigné"}
- Panier moyen : ${companyData.avg_basket ? companyData.avg_basket + " €" : "Non renseigné"}
- Transactions/mois : ${companyData.monthly_transactions ?? "Non renseigné"}
- Canal principal : ${companyData.main_sales_channel || "Non renseigné"}
- Budget marketing : ${companyData.marketing_budget ? companyData.marketing_budget + " €" : "Non renseigné"}
- CAC : ${companyData.cac ? companyData.cac + " €" : "Non renseigné"}
- LTV : ${companyData.ltv ? companyData.ltv + " €" : "Non renseigné"}
- Taux upsell : ${companyData.upsell_rate ? companyData.upsell_rate + "%" : "Non renseigné"}
- NPS : ${companyData.nps_score ?? "Non renseigné"}
- Taux rétention : ${companyData.retention_rate ? companyData.retention_rate + "%" : "Non renseigné"}
- Taux renouvellement : ${companyData.renewal_rate ? companyData.renewal_rate + "%" : "Non renseigné"}
- Historique churn : ${JSON.stringify(companyData.churn_history)}
- Clients VIP : ${companyData.vip_clients ?? "Non renseigné"} (CA VIP : ${companyData.vip_revenue ? companyData.vip_revenue + " €" : ""})
- Motif principal de départ : ${companyData.main_churn_reason || "Non renseigné"}
- Objectif croissance 6m : ${companyData.growth_target_6m ? companyData.growth_target_6m + "%" : "Non renseigné"}
- Objectif croissance 12m : ${companyData.growth_target_12m ? companyData.growth_target_12m + "%" : "Non renseigné"}
`;
    } else {
      dataContext = "L'utilisateur n'a pas encore connecté ses données d'entreprise. Encourage-le à le faire pour des analyses plus précises.";
    }

    // Add AI analysis results if available
    let aiContext = "";
    if (aiResults && aiResults.length > 0) {
      aiContext = "\n\nRésultats des analyses IA précédentes :\n";
      for (const r of aiResults) {
        aiContext += `\n--- ${r.service.toUpperCase()} ---\n${JSON.stringify(r.results, null, 2)}\n`;
      }
    }

    const tabContext = activeTab ? `\nL'utilisateur est actuellement sur l'onglet : ${activeTab}. Adapte tes réponses en conséquence.` : "";

    const systemPrompt = `Tu es l'assistant IA intégré au tableau de bord Scalyo. Scalyo est une plateforme d'analyse et de croissance pour PME/startups.

${dataContext}
${aiContext}
${tabContext}

Ton rôle : analyser ces données et donner des recommandations **concrètes, actionnables et priorisées** à l'utilisateur.

Règles :
- Réponds toujours en français
- Sois direct et précis, pas de blabla
- Donne des actions concrètes (ex: "Lancez une campagne de réengagement pour les clients inactifs")
- Structure tes réponses avec des emojis pour la lisibilité (✅ pour les actions, ⚠️ pour les alertes, 📈 pour les opportunités)
- Reste focalisé sur les données du dashboard
- Maximum 4-5 phrases par réponse pour rester concis
- Si l'utilisateur n'a pas de données connectées, donne des conseils génériques mais encourage-le à connecter ses données`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages: messages.slice(-20), // Keep last 20 messages for context
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", response.status, errorText);
      throw new Error("AI service error");
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "Désolé, je n'ai pas pu générer une réponse.";

    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("scalyo-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
