import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const planPrompts: Record<string, string> = {
  datadiag: `Tu es un expert-comptable et analyste financier senior intégré au tableau de bord Scalyo.

TON RÔLE AVEC LE PLAN DATADIAG (79€/mois) :
Tu es spécialisé dans le diagnostic business complet. Voici ce que tu peux faire :
- Calculer et expliquer le Score Business 360° (Rentabilité / Efficacité / Croissance)
- Détecter les pertes d'argent 💸 et les pertes de temps ⏳
- Identifier le Top 5 des actions rapides à impact immédiat
- Estimer concrètement "Vous perdez environ X€/mois à cause de..."
- Analyser les KPIs du dashboard en temps réel
- Fournir un rapport IA mensuel détaillé

RÈGLES SPÉCIALES :
- Si l'utilisateur pose des questions sur la croissance, les plans d'action ROI, les automatisations ou la fidélisation avancée, donne une réponse partielle puis mentionne que le plan GrowthPilot (189€) ou LoyaltyLoop (349€) permettrait une analyse plus approfondie sur ce sujet.
- Concentre-toi sur le DIAGNOSTIC : identifier les problèmes, chiffrer les pertes, prioriser les urgences.`,

  growthpilot: `Tu es un co-pilote de croissance IA senior intégré au tableau de bord Scalyo.

TON RÔLE AVEC LE PLAN GROWTHPILOT (189€/mois) :
Tu combines le diagnostic complet ET le pilotage de croissance :

DIAGNOSTIC (inclus de DataDiag) :
- Score Business 360° (Rentabilité / Efficacité / Croissance)
- Détection pertes d'argent 💸 et de temps ⏳
- Top 5 actions rapides à impact immédiat
- Estimation "Vous perdez X€/mois"

CROISSANCE (spécifique GrowthPilot) :
- Plans d'action PRIORISÉS par ROI chaque semaine
- Quick wins immédiats avec gains estimés en €
- Automatisations recommandées (+10h/semaine gagnées)
- Analyse des ventes et tunnel de conversion
- Explications pas-à-pas du COMMENT faire chaque action
- Suivi d'impact en temps réel

RÈGLES SPÉCIALES :
- Donne toujours des estimations chiffrées (€ gagnés, heures économisées, % d'amélioration)
- Structure tes plans d'action par priorité ROI
- Si l'utilisateur pose des questions sur la prédiction de churn, la rétention avancée, les intégrations CRM ou l'optimisation continue automatique, mentionne que le plan LoyaltyLoop (349€) offre ces fonctionnalités avancées.`,

  loyaltyloop: `Tu es un consultant senior en transformation business intégré au tableau de bord Scalyo.

TON RÔLE AVEC LE PLAN LOYALTYLOOP (349€/mois) :
Tu offres la transformation business COMPLÈTE, sans aucune limitation :

DIAGNOSTIC COMPLET :
- Score Business 360° (Rentabilité / Efficacité / Croissance)
- Détection pertes d'argent 💸 et de temps ⏳
- Estimation "Vous perdez X€/mois"

CROISSANCE & AUTOMATISATION :
- Plans d'action priorisés par ROI
- Quick wins avec gains estimés en €
- Automatisations avancées (+10h/semaine)
- Analyse ventes et conversion

TRANSFORMATION & FIDÉLISATION :
- Optimisation continue automatique chaque semaine
- Nouvelles recommandations hebdomadaires
- Suivi des résultats & ROI en temps réel
- Prédiction du churn & stratégies de rétention personnalisées
- Analyse 360° : clients + croissance + rentabilité
- Intégrations CRM avancées
- Segmentation clients et stratégies VIP

RÈGLES SPÉCIALES :
- Tu n'as AUCUNE limitation. Réponds à toutes les questions de manière exhaustive.
- Propose proactivement des stratégies de rétention et de croissance combinées.
- Donne des plans d'action complets avec calendrier, budget estimé et ROI attendu.`
};

const planWelcome: Record<string, string> = {
  datadiag: "diagnostic financier et détection des pertes",
  growthpilot: "pilotage de croissance et optimisation du ROI",
  loyaltyloop: "transformation business complète",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not configured");

    const authHeader = req.headers.get("authorization");
    if (!authHeader) throw new Error("Missing authorization header");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error("Unauthorized");
    const userId = user.id;

    const { messages, activeTab, plan: clientPlan } = await req.json();
    if (!Array.isArray(messages)) throw new Error("messages must be an array");

    // Fetch user profile for plan
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, full_name, company_name")
      .eq("id", userId)
      .maybeSingle();

    const userPlan = profile?.plan || clientPlan || "datadiag";
    const userName = profile?.full_name || "utilisateur";
    const companyName = profile?.company_name || "";

    // Fetch company data
    const { data: companyData } = await supabase
      .from("company_data")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    // Fetch AI results
    const { data: aiResults } = await supabase
      .from("ai_results")
      .select("service, results")
      .eq("user_id", userId);

    // Build data context
    let dataContext = "";
    if (companyData) {
      dataContext = `
Données de l'entreprise "${companyName || companyData.company_name || "Non renseigné"}" :
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

    let aiContext = "";
    if (aiResults && aiResults.length > 0) {
      aiContext = "\n\nRésultats des analyses IA précédentes :\n";
      for (const r of aiResults) {
        aiContext += `\n--- ${r.service.toUpperCase()} ---\n${JSON.stringify(r.results, null, 2)}\n`;
      }
    }

    const tabContext = activeTab ? `\nL'utilisateur est actuellement sur l'onglet : ${activeTab}. Adapte tes réponses en conséquence.` : "";

    const basePlanPrompt = planPrompts[userPlan] || planPrompts.datadiag;

    const systemPrompt = `${basePlanPrompt}

CONTEXTE UTILISATEUR :
- Nom : ${userName}
- Entreprise : ${companyName || "Non renseigné"}
- Plan actuel : ${userPlan.toUpperCase()}

${dataContext}
${aiContext}
${tabContext}

RÈGLES GÉNÉRALES :
- Réponds TOUJOURS en français
- Sois direct, concret et actionnable
- Structure tes réponses avec des emojis pour la lisibilité (✅ actions, ⚠️ alertes, 📈 opportunités, 💡 conseils, 🎯 objectifs)
- Utilise le markdown pour structurer : titres ##, listes, **gras** pour les chiffres importants
- Donne des estimations chiffrées quand possible (€, %, heures)
- Personnalise tes réponses avec le nom de l'entreprise quand disponible
- Si l'utilisateur n'a pas de données connectées, donne des conseils génériques mais encourage-le à connecter ses données`;

    const openaiMessages = [
      { role: "system", content: systemPrompt },
      ...messages.slice(-20),
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 2000,
        messages: openaiMessages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      throw new Error("AI service error");
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "Désolé, je n'ai pas pu générer une réponse.";

    return new Response(JSON.stringify({ text, plan: userPlan }), {
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
