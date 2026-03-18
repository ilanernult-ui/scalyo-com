import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

const plans = [
  {
    name: "Starter",
    monthly: 149,
    description: "Pour les petites entreprises qui veulent comprendre leurs données.",
    features: [
      { name: "1 à 5 utilisateurs", included: true },
      { name: "DataDiag basique", included: true },
      { name: "GrowthPilot", included: false },
      { name: "LoyaltyLoop", included: false },
      { name: "Support email", included: true },
      { name: "3 intégrations", included: true },
    ],
    popular: false,
    cta: "Commencer",
  },
  {
    name: "Business",
    monthly: 399,
    description: "Pour les entreprises en croissance qui veulent aller plus loin.",
    features: [
      { name: "6 à 25 utilisateurs", included: true },
      { name: "DataDiag avancé", included: true },
      { name: "GrowthPilot", included: true },
      { name: "LoyaltyLoop", included: true },
      { name: "Support prioritaire", included: true },
      { name: "10 intégrations", included: true },
    ],
    popular: true,
    cta: "Commencer",
  },
  {
    name: "Enterprise",
    monthly: null,
    description: "Pour les grandes organisations avec des besoins spécifiques.",
    features: [
      { name: "Utilisateurs illimités", included: true },
      { name: "DataDiag complet", included: true },
      { name: "GrowthPilot", included: true },
      { name: "LoyaltyLoop", included: true },
      { name: "Support dédié", included: true },
      { name: "Intégrations illimitées", included: true },
    ],
    popular: false,
    cta: "Nous contacter",
  },
];

const faq = [
  { q: "Puis-je annuler à tout moment ?", a: "Oui, sans engagement. Vous pouvez annuler votre abonnement à tout moment depuis votre compte." },
  { q: "Y a-t-il un essai gratuit ?", a: "Oui, 14 jours d'essai gratuit sans carte bancaire sur tous les plans." },
  { q: "Mes données sont-elles sécurisées ?", a: "Absolument. Chiffrement AES-256, conformité RGPD, hébergement en Europe. Vos données ne sont jamais vendues." },
  { q: "Puis-je changer de plan ?", a: "Oui, vous pouvez upgrader ou downgrader à tout moment. La différence est proratisée." },
  { q: "Quelles intégrations sont disponibles ?", a: "Salesforce, HubSpot, Google Analytics, Stripe, QuickBooks, et bien d'autres via notre API." },
  { q: "Proposez-vous un accompagnement ?", a: "Oui, le plan Enterprise inclut un account manager dédié. Les autres plans bénéficient du support email/prioritaire." },
];

const Pricing = () => {
  const navigate = useNavigate();
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-4">Tarifs</h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              Des tarifs simples et transparents. Sans engagement, annulation à tout moment.
            </p>

            {/* Toggle */}
            <div className="inline-flex items-center gap-3 glass-card rounded-full px-4 py-2">
              <span className={`text-sm font-medium ${!annual ? "text-foreground" : "text-muted-foreground"}`}>Mensuel</span>
              <button
                onClick={() => setAnnual(!annual)}
                className={`relative w-12 h-6 rounded-full transition-colors ${annual ? "bg-primary" : "bg-border"}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-foreground transition-transform ${annual ? "left-7" : "left-1"}`} />
              </button>
              <span className={`text-sm font-medium ${annual ? "text-foreground" : "text-muted-foreground"}`}>
                Annuel <span className="text-accent text-xs font-semibold">-20%</span>
              </span>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-24">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative glass-card rounded-2xl p-8 ${plan.popular ? "border-primary/50 glow" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                    Populaire
                  </div>
                )}
                <h3 className="text-xl font-heading font-bold text-foreground mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="mb-6">
                  {plan.monthly ? (
                    <>
                      <span className="text-4xl font-heading font-extrabold text-foreground">
                        {annual ? Math.round(plan.monthly * 0.8) : plan.monthly}€
                      </span>
                      <span className="text-muted-foreground text-sm">/mois</span>
                    </>
                  ) : (
                    <span className="text-2xl font-heading font-bold text-foreground">Sur devis</span>
                  )}
                </div>
                <Button
                  className={`w-full mb-6 font-semibold ${plan.popular ? "gradient-primary text-primary-foreground shimmer" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => navigate(plan.monthly ? "/dashboard" : "/contact")}
                >
                  {plan.cta}
                </Button>
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f.name} className="flex items-center gap-2 text-sm">
                      <Check className={`h-4 w-4 shrink-0 ${f.included ? "text-accent" : "text-muted-foreground/30"}`} />
                      <span className={f.included ? "text-muted-foreground" : "text-muted-foreground/40 line-through"}>{f.name}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Reassurance */}
          <div className="text-center mb-24">
            <p className="text-sm text-muted-foreground">
              Sans engagement · Annulation à tout moment · Données sécurisées ISO 27001
            </p>
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-heading font-extrabold text-foreground text-center mb-8">Questions fréquentes</h2>
            <div className="space-y-4">
              {faq.map((item) => (
                <details key={item.q} className="glass-card rounded-xl p-4 group">
                  <summary className="text-sm font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
                    {item.q}
                    <span className="text-primary group-open:rotate-45 transition-transform text-lg">+</span>
                  </summary>
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Pricing;
