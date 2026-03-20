import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const PLAN_MAP: Record<string, string> = {
  "prod_UBZTlbbO4BaYmV": "datadiag",
  "prod_UBZT1MrAufTdsD": "growthpilot",
  "prod_UBZTdDuYqxEXVq": "loyaltyloop",
};

const logStep = (step: string, details?: any) => {
  console.log(`[STRIPE-WEBHOOK] ${step}${details ? ` - ${JSON.stringify(details)}` : ''}`);
};

serve(async (req) => {
  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!stripeKey || !webhookSecret) throw new Error("Missing Stripe config");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");
    if (!sig) throw new Error("No stripe-signature header");

    const event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret);
    logStep("Event verified", { type: event.type });

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (!userId) {
          logStep("No user_id in metadata, skipping");
          break;
        }

        // Get subscription to determine plan
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const productId = subscription.items.data[0].price.product as string;
        const plan = PLAN_MAP[productId] || "datadiag";
        const periodEnd = new Date(subscription.current_period_end * 1000).toISOString();

        await supabaseAdmin.from("profiles").update({
          plan,
          plan_status: "active",
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          plan_expires_at: periodEnd,
        }).eq("id", userId);

        logStep("Profile updated after checkout", { userId, plan });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const productId = subscription.items.data[0].price.product as string;
        const plan = PLAN_MAP[productId] || "datadiag";
        const periodEnd = new Date(subscription.current_period_end * 1000).toISOString();
        const planStatus = subscription.cancel_at_period_end ? "cancelled" : 
                          subscription.status === "past_due" ? "past_due" : "active";

        const { data: profiles } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .limit(1);

        if (profiles && profiles.length > 0) {
          await supabaseAdmin.from("profiles").update({
            plan,
            plan_status: planStatus,
            stripe_subscription_id: subscription.id,
            plan_expires_at: periodEnd,
          }).eq("id", profiles[0].id);
          logStep("Subscription updated", { userId: profiles[0].id, plan, planStatus });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { data: profiles } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .limit(1);

        if (profiles && profiles.length > 0) {
          await supabaseAdmin.from("profiles").update({
            plan: "datadiag",
            plan_status: "active",
            stripe_subscription_id: null,
            plan_expires_at: null,
          }).eq("id", profiles[0].id);
          logStep("Subscription deleted, reverted to free plan", { userId: profiles[0].id });
        }
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: msg });
    return new Response(JSON.stringify({ error: msg }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});
