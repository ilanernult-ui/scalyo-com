import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PLAN_MAP: Record<string, string> = {
  "prod_UBZTlbbO4BaYmV": "datadiag",
  "prod_UBZT1MrAufTdsD": "growthpilot",
  "prod_UBZTdDuYqxEXVq": "loyaltyloop",
};

// Admin override for testing — only affects this specific user
const PLAN_OVERRIDES: Record<string, string> = {
  "821e34ea-4a7a-4c9a-9790-e56147dba679": "loyaltyloop",
};

const logStep = (step: string, details?: any) => {
  console.log(`[CHECK-SUBSCRIPTION] ${step}${details ? ` - ${JSON.stringify(details)}` : ''}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError) throw new Error(`Auth error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });

    if (customers.data.length === 0) {
      logStep("No Stripe customer found");
      return new Response(JSON.stringify({ subscribed: false, plan: "datadiag", plan_status: "active" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const customerId = customers.data[0].id;
    logStep("Customer found", { customerId });

    // Check active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    // Also check canceled (still active until period end)
    const canceledSubs = await stripe.subscriptions.list({
      customer: customerId,
      status: "canceled",
      limit: 1,
    });

    let plan = "datadiag";
    let planStatus = "active";
    let subscriptionEnd: string | null = null;
    let stripeSubscriptionId: string | null = null;

    if (subscriptions.data.length > 0) {
      const sub = subscriptions.data[0];
      const productId = sub.items.data[0]?.price?.product as string;
      plan = PLAN_MAP[productId] || "datadiag";
      planStatus = sub.cancel_at_period_end ? "cancelled" : "active";
      stripeSubscriptionId = sub.id;
      if (sub.current_period_end && typeof sub.current_period_end === "number") {
        subscriptionEnd = new Date(sub.current_period_end * 1000).toISOString();
      }
      logStep("Active subscription", { plan, planStatus, subscriptionEnd });
    } else if (canceledSubs.data.length > 0) {
      const sub = canceledSubs.data[0];
      if (sub.current_period_end && typeof sub.current_period_end === "number") {
        const periodEnd = new Date(sub.current_period_end * 1000);
        if (periodEnd > new Date()) {
          const productId = sub.items.data[0]?.price?.product as string;
          plan = PLAN_MAP[productId] || "datadiag";
          planStatus = "cancelled";
          subscriptionEnd = periodEnd.toISOString();
          stripeSubscriptionId = sub.id;
        }
      }
    }

    // Apply admin override for testing
    if (PLAN_OVERRIDES[user.id]) {
      plan = PLAN_OVERRIDES[user.id];
      logStep("Plan override applied", { userId: user.id, plan });
    }

    // Sync to profiles
    await supabaseAdmin.from("profiles").update({
      plan,
      plan_status: planStatus,
      stripe_customer_id: customerId,
      stripe_subscription_id: stripeSubscriptionId,
      plan_expires_at: subscriptionEnd,
    }).eq("id", user.id);

    return new Response(JSON.stringify({
      subscribed: plan !== "datadiag" || subscriptions.data.length > 0,
      plan,
      plan_status: planStatus,
      subscription_end: subscriptionEnd,
      stripe_subscription_id: stripeSubscriptionId,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: msg });
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
