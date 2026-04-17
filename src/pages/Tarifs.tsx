import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Minus, Shield, CreditCard, Gift, Headphones, ArrowLeft, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth, PlanType } from "@/contexts/AuthContext";
import { STRIPE_PLANS } from "@/lib/stripe-plans";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const planOrder: PlanType[] = ["datadiag", "growthpilot", "loyaltyloop"];
const planHierarchy: Record<PlanType, number> = { datadiag: 0, growthpilot: 1, loyaltyloop: 2 };

const comparisonRows = [
  { feature: "Score Business 360°", datadiag: "✓", growth: "✓", loyalty: "✓" },
  { feature: "Détection pertes d'argent & temps", datadiag: "✓", growth: "✓", loyalty: "✓" },
  { feature: "Top 5 actions rapides", datadiag: "✓", growth: "✓", loyalty: "✓" },
  { feature: "Estimation perte financière", datadiag: "✓", growth: "✓", loyalty: "✓" },
  { feature: "Dashboard KPIs", datadiag: "Essentiel", growth: "Avancé", loyalty: "Complet 360°" },
  { feature: "Plan d'action priorisé par ROI", datadiag: "—", growth: "Hebdomadaire", loyalty: "Hebdomadaire" },
  { feature: "Quick wins avec gains en €", datadiag: "—", growth: "✓", loyalty: "✓" },
  { feature: "Automatisations recommandées", datadiag: "—", growth: "+10h/sem", loyalty: "+15h/sem" },
  { feature: "Optimisation continue automatique", datadiag: "—", growth: "—", loyalty: "✓" },
  { feature: "Prédiction churn & rétention", datadiag: "—", growth: "—", loyalty: "✓" },
  { feature: "Intégrations CRM", datadiag: "—", growth: "—", loyalty: "Illimité" },
  { feature: "Utilisateurs", datadiag: "1-3", growth: "Jusqu'à 10", loyalty: "Illimité" },
  { feature: "Support", datadiag: "Email 48h", growth: "Prioritaire 4h", loyalty: "Account manager" },
];

const reassurance = [
  { icon: Shield, title: "Données sécurisées", desc: "Hébergement en France · RGPD · chiffrement SSL" },
  { icon: CreditCard, title: "Sans engagement", desc: "Résiliez à tout moment en 1 clic" },
  { icon: Gift, title: "14 jours gratuits", desc: "Aucune carte bancaire requise" },
  { icon: Headphones, title: "Support inclus", desc: "Une équipe disponible pour vous accompagner" },
];

const faq = [
  { q: "Puis-je changer de plan à tout moment ?", a: "Oui, upgrade ou downgrade depuis l'espace client, effectif immédiatement, montant ajusté au prorata." },
  { q: "Que se passe-t-il après les 14 jours ?", a: "Vous choisissez un plan ou le compte est désactivé sans frais." },
  { q: "Mes données sont-elles sécurisées ?", a: "Hébergement France, chiffrement, conformité RGPD, aucune revente." },
  { q: "Le plan annuel, comment ça fonctionne ?", a: "2 mois offerts soit -17%, prélevé en une fois." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const Tarifs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, plan: currentPlan, planStatus, stripeSubscriptionId, subscriptionEnd } = useAuth();
  const { toast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null);
  const [stripeUrl, setStripeUrl] = useState<string | null>(null);

  const subscriptionMessage = (location.state as any)?.subscriptionMessage as string | undefined;
  const isExpired = planStatus === "cancelled" && subscriptionEnd && new Date(subscriptionEnd) < new Date();
  const hasActiveSubscription = !!stripeSubscriptionId && !isExpired;
  const hasPaidSubscription = !!stripeSubscriptionId && !isExpired;

  const isLoggedIn = !!user;
  const currentLevel = planHierarchy[currentPlan];

  const handleChoosePlan = async (targetPlan: PlanType) => {
    setTimeout(() => window.scrollTo({ top: 0, behavior: "instant" }), 0);
    if (!isLoggedIn) {
      navigate("/auth");
      return;
    }

    setLoadingPlan(targetPlan);
    try {
      const planConfig = STRIPE_PLANS[targetPlan];

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: planConfig.priceId },
      });

      if (error) throw new Error(error.message || "Erreur lors de l'appel à create-checkout");
      if (data?.error) throw new Error(data.error);
      if (!data?.url) throw new Error("Aucune URL de paiement retournée");

      // Escape iframe context for Stripe Checkout
      const isInIframe = window.self !== window.top;
      console.log("[Tarifs] Stripe URL received:", data.url, "isInIframe:", isInIframe);

      if (isInIframe) {
        // Try top-level redirect first
        try {
          window.top!.location.assign(data.url);
          return;
        } catch {
          // Cross-origin restriction — fallback to new tab
          console.log("[Tarifs] top-level redirect blocked, opening new tab");
        }
        // Fallback: open in new tab
        const opened = window.open(data.url, "_blank", "noopener,noreferrer");
        if (!opened) {
          // Popup blocked — show manual link
          setStripeUrl(data.url);
          toast({
            title: "Ouverture bloquée",
            description: "Cliquez sur le lien ci-dessous pour accéder au paiement.",
          });
        }
      } else {
        window.location.assign(data.url);
      }
    } catch (e: any) {
      toast({
        title: "Erreur de paiement",
        description: e?.message || "Impossible de créer la session. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  const getButtonState = (targetPlan: PlanType) => {
    const targetLevel = planHierarchy[targetPlan];
    if (!isLoggedIn) return { label: "Commencer l'essai gratuit", disabled: false, variant: "default" as const };
    
    // No paid subscription = all plans available
    if (!hasPaidSubscription) {
      return { label: `Choisir ce plan — ${STRIPE_PLANS[targetPlan].monthly}€/mois`, disabled: false, variant: "default" as const };
    }
    
    if (targetPlan === currentPlan) return { label: "Votre plan actuel", disabled: true, variant: "secondary" as const };
    if (targetLevel < currentLevel) return { label: "Plan inférieur", disabled: true, variant: "secondary" as const };
    return { label: `Choisir ce plan — ${STRIPE_PLANS[targetPlan].monthly}€/mois`, disabled: false, variant: "default" as const };
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Stripe fallback link */}
      {stripeUrl && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-primary text-primary-foreground rounded-xl px-6 py-4 shadow-lg flex items-center gap-4 max-w-md">
          <div className="text-sm">
            <p className="font-medium">Le paiement est prêt</p>
            <p className="opacity-80 text-xs">Cliquez pour ouvrir la page de paiement Stripe</p>
          </div>
          <a
            href={stripeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-primary-foreground text-primary rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            Payer <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <button onClick={() => setStripeUrl(null)} className="absolute -top-2 -right-2 bg-background text-foreground rounded-full w-6 h-6 text-xs border border-border flex items-center justify-center">✕</button>
        </div>
      )}

      {isLoggedIn && !hasActiveSubscription && (
        <div className="bg-primary/10 border-b border-primary/20" style={{ paddingTop: "clamp(90px, 11vh, 120px)" }}>
          <div className="container mx-auto px-6 max-w-[1200px] py-4">
            <p className="text-sm text-primary font-medium text-center">
              {subscriptionMessage || "Vous n'avez pas encore d'abonnement actif. Choisissez un plan ci-dessous pour accéder à votre dashboard."}
            </p>
          </div>
        </div>
      )}

      {/* Back to dashboard */}
      {isLoggedIn && hasActiveSubscription && (
        <div className="container mx-auto px-6 max-w-[1200px]" style={{ paddingTop: "clamp(90px, 11vh, 120px)" }}>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Retour au dashboard
          </button>
        </div>
      )}

      {/* HERO */}
      <section style={{ paddingTop: isLoggedIn ? (hasActiveSubscription ? "20px" : (!hasActiveSubscription ? "30px" : "20px")) : "clamp(100px, 12vh, 140px)", paddingBottom: "60px" }}>
        <div className="container mx-auto px-6 max-w-[1200px]">
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <p className="apple-label mb-4">Tarifs simples et transparents</p>
            <h1 className="text-foreground mb-5" style={{ fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.05 }}>
              {isLoggedIn ? "Changez de plan" : "Choisissez le plan qui correspond"}{" "}
              <br className="hidden sm:block" />
              {isLoggedIn ? "en un clic." : "à votre ambition."}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto" style={{ fontSize: 19 }}>
              Sans engagement. Résiliation à tout moment. Paiement sécurisé par Stripe.
            </p>
          </motion.div>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section style={{ paddingBottom: 100 }}>
        <div className="container mx-auto px-6 max-w-[1200px]">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start">
            {planOrder.map((planId, i) => {
              const plan = STRIPE_PLANS[planId];
              const isPopular = planId === "growthpilot";
              const isCurrent = isLoggedIn && hasPaidSubscription && planId === currentPlan;
              const btnState = getButtonState(planId);
              const isLower = isLoggedIn && hasPaidSubscription && planHierarchy[planId] < currentLevel;

              return (
                <motion.div
                  key={planId}
                  initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
                  variants={fadeUp}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative rounded-[18px] p-8 lg:p-10 transition-shadow duration-300 ${
                    isLower ? "opacity-50" : ""
                  } ${
                    isCurrent
                      ? "border-2 border-primary shadow-[0_8px_32px_rgba(0,113,227,0.15)] bg-[hsl(211,100%,97%)]"
                      : isPopular && !isCurrent
                      ? "border-2 border-primary shadow-[0_8px_32px_rgba(0,113,227,0.12)] scale-[1.03] origin-center bg-[hsl(211,100%,97%)]"
                      : "border border-border bg-background shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-1"
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-5 py-1.5 text-xs font-semibold whitespace-nowrap">
                        Votre plan actuel
                      </Badge>
                    </div>
                  )}
                  {isPopular && !isCurrent && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-5 py-1.5 rounded-full whitespace-nowrap">
                      Le plus populaire
                    </div>
                  )}

                  <h3 className="text-xl font-semibold text-foreground tracking-tight">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-5">{plan.tagline}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground tracking-tight">{plan.monthly}€</span>
                    <span className="text-muted-foreground text-sm ml-1">/mois</span>
                  </div>

                  <Button
                    className="w-full mb-2"
                    variant={btnState.variant === "secondary" ? "secondary" : (isPopular || isCurrent) ? "default" : "outline"}
                    size="lg"
                    disabled={btnState.disabled || loadingPlan === planId}
                    onClick={() => handleChoosePlan(planId)}
                  >
                    {loadingPlan === planId && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    {btnState.label}
                  </Button>

                  <ul className="space-y-2.5 mt-4">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <Check className="h-4 w-4 shrink-0 mt-0.5 text-success" />
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="surface" style={{ padding: "100px 0" }}>
        <div className="container mx-auto px-6 max-w-[1200px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-foreground mb-3" style={{ fontSize: "clamp(28px, 4vw, 44px)" }}>
              Comparez les plans en détail
            </h2>
          </motion.div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse rounded-xl overflow-hidden border border-border text-sm">
              <thead>
                <tr>
                  <th className="text-left p-4 bg-background text-muted-foreground font-medium border-b border-border w-[30%]">Fonctionnalité</th>
                  {planOrder.map((p) => (
                    <th key={p} className={`p-4 font-semibold border-b text-center ${
                      p === currentPlan && isLoggedIn ? "bg-primary/5 text-primary border-primary/20" :
                      p === "growthpilot" ? "bg-[hsl(211,100%,97%)] text-primary border-primary/20" :
                      "bg-background text-foreground border-border"
                    }`}>
                      {STRIPE_PLANS[p].name} {p === currentPlan && isLoggedIn ? "✓" : p === "growthpilot" ? "⭐" : ""}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-background" : "bg-secondary/30"}>
                    <td className="p-4 text-foreground font-medium border-b border-border/50">{row.feature}</td>
                    {[row.datadiag, row.growth, row.loyalty].map((val, ci) => (
                      <td key={ci} className={`p-4 text-center border-b border-border/50 ${ci === 1 ? "bg-[hsl(211,100%,97%)]" : ""}`}>
                        {val === "✓" ? <Check className="h-4 w-4 text-success mx-auto" /> :
                         val === "—" ? <Minus className="h-4 w-4 text-muted-foreground/30 mx-auto" /> :
                         <span className="text-muted-foreground">{val}</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* REASSURANCE */}
      <section style={{ padding: "80px 0" }}>
        <div className="container mx-auto px-6 max-w-[1200px]">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {reassurance.map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-14 h-14 rounded-full bg-background border border-border flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="surface" style={{ padding: "100px 0" }}>
        <div className="container mx-auto px-6 max-w-2xl">
          <h2 className="text-foreground text-center mb-10" style={{ fontSize: "clamp(28px, 4vw, 40px)" }}>
            Questions fréquentes
          </h2>
          <Accordion type="single" collapsible className="space-y-3">
            {faq.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-background rounded-2xl border border-border px-6">
                <AccordionTrigger className="text-left text-foreground font-medium py-5 hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Tarifs;
