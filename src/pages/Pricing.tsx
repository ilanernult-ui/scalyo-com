import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Check, Minus, Shield, CreditCard, Gift, Headphones, ChevronDown, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const plans = [
  {
    name: "DataDiag",
    monthly: 79,
    tagline: "Diagnostic business complet en 48h",
    features: [
      { name: "Score Business 360° (Rentabilité · Efficacité · Croissance)", included: true },
      { name: "Détection des pertes d'argent 💸 et de temps ⏳", included: true },
      { name: "Top 5 actions rapides à impact immédiat", included: true },
      { name: "Estimation « vous perdez X€/mois »", included: true },
      { name: "Dashboard KPIs en temps réel", included: true },
      { name: "Rapport IA mensuel", included: true },
    ],
    excluded: [
      "Plan d'action priorisé par ROI",
      "Automatisations recommandées",
      "Optimisation continue",
    ],
    popular: false,
    target: "Idéal pour savoir exactement où part votre argent",
  },
  {
    name: "GrowthPilot",
    monthly: 189,
    tagline: "Co-pilote IA · +15% de croissance · +10h/semaine",
    features: [
      { name: "Tout DataDiag inclus", included: true },
      { name: "Plan d'action PRIORISÉ par ROI chaque semaine", included: true },
      { name: "Quick wins immédiats avec gains estimés en €", included: true },
      { name: "Automatisations recommandées (+10h gagnées/semaine)", included: true },
      { name: "Analyse ventes & tunnel de conversion", included: true },
      { name: "IA qui explique le COMMENT pas-à-pas", included: true },
      { name: "Suivi d'impact en temps réel", included: true },
      { name: "Support prioritaire < 4h", included: true },
    ],
    excluded: [
      "Optimisation continue automatique",
      "Prédiction du churn",
    ],
    popular: true,
    target: "+15% de croissance possible · +10h gagnées/semaine",
  },
  {
    name: "LoyaltyLoop",
    monthly: 349,
    tagline: "Transformation business complète · +25% de croissance",
    features: [
      { name: "Tout GrowthPilot inclus", included: true },
      { name: "Optimisation continue automatique chaque semaine", included: true },
      { name: "Nouvelles recommandations hebdomadaires", included: true },
      { name: "Suivi des résultats & ROI en temps réel", included: true },
      { name: "Automatisations avancées prêtes à déployer", included: true },
      { name: "Analyse 360° : clients + croissance + rentabilité", included: true },
      { name: "Prédiction du churn & stratégies de rétention", included: true },
      { name: "Intégrations CRM avancées · Utilisateurs illimités", included: true },
    ],
    excluded: [],
    popular: false,
    target: "+25% de croissance · -40% de churn · +15h gagnées/semaine",
  },
];

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
  { feature: "Prix mensuel", datadiag: "79€", growth: "189€", loyalty: "349€" },
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
  { q: "Tarifs grandes entreprises ?", a: "Contactez l'équipe commerciale pour un devis personnalisé au-delà de 500 salariés." },
  { q: "Quels types de données puis-je connecter ?", a: "CSV, Excel, logiciel comptable, CRM, outils RH. Liste complète dans l'espace client." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [annual, setAnnual] = useState(false);

  const getPrice = (monthly: number) => annual ? Math.round(monthly * 0.83) : monthly;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section style={{ paddingTop: "clamp(100px, 12vh, 140px)", paddingBottom: "80px" }}>
        <div className="container mx-auto px-6 max-w-[1200px]">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <p className="apple-label mb-4">Tarifs simples et transparents</p>
            <h1
              className="text-foreground mb-5"
              style={{ fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.05 }}
            >
              Choisissez le plan qui correspond{" "}
              <br className="hidden sm:block" />
              à votre ambition.
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10" style={{ fontSize: 19 }}>
              Sans engagement. Annulation à tout moment. Essai gratuit 14 jours sur tous les plans.
            </p>

            {/* Toggle */}
            <div className="inline-flex items-center gap-3 surface rounded-full px-5 py-2.5">
              <span className={`text-sm font-medium transition-colors ${!annual ? "text-foreground" : "text-muted-foreground"}`}>
                Mensuel
              </span>
              <button
                onClick={() => setAnnual(!annual)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${annual ? "bg-primary" : "bg-border"}`}
                aria-label="Toggle annual pricing"
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-background shadow-sm transition-transform duration-200 ${annual ? "translate-x-[26px]" : "translate-x-1"}`}
                />
              </button>
              <span className={`text-sm font-medium transition-colors ${annual ? "text-foreground" : "text-muted-foreground"}`}>
                Annuel{" "}
                <span className="text-success text-xs font-semibold ml-1 bg-success/10 px-2 py-0.5 rounded-full">
                  2 mois offerts -17%
                </span>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section style={{ paddingBottom: 100 }}>
        <div className="container mx-auto px-6 max-w-[1200px]">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={`relative rounded-[18px] p-8 lg:p-10 transition-shadow duration-300 ${
                  plan.popular
                    ? "border-2 border-primary shadow-[0_8px_32px_rgba(0,113,227,0.12)] scale-[1.03] origin-center bg-[hsl(211,100%,97%)]"
                    : "border border-border bg-background shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-1"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-5 py-1.5 rounded-full whitespace-nowrap">
                    Le plus populaire
                  </div>
                )}

                <h3 className="text-xl font-semibold text-foreground tracking-tight">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-5">{plan.tagline}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground tracking-tight">
                    {getPrice(plan.monthly)}€
                  </span>
                  <span className="text-muted-foreground text-sm ml-1">/mois</span>
                </div>

                <Button
                  className="w-full mb-2"
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                  onClick={() => navigate("/auth")}
                >
                  Commencer l'essai gratuit{plan.popular && " →"}
                </Button>
                <p className="text-xs text-muted-foreground text-center mb-6">
                  14 jours gratuits · aucune carte requise
                </p>

                <ul className="space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f.name} className="flex items-start gap-2.5 text-sm">
                      <Check className="h-4 w-4 shrink-0 mt-0.5 text-success" />
                      <span className="text-muted-foreground">{f.name}</span>
                    </li>
                  ))}
                  {plan.excluded.map((name) => (
                    <li key={name} className="flex items-start gap-2.5 text-sm">
                      <Minus className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground/30" />
                      <span className="text-muted-foreground/40 line-through">{name}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-xs text-muted-foreground italic mt-6">{plan.target}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE — Desktop */}
      <section className="surface" style={{ padding: "100px 0" }}>
        <div className="container mx-auto px-6 max-w-[1200px]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12"
          >
            <h2 className="text-foreground mb-3" style={{ fontSize: "clamp(28px, 4vw, 44px)" }}>
              Comparez les plans en détail
            </h2>
            <p className="text-muted-foreground text-lg">Toutes les fonctionnalités, sans surprise.</p>
          </motion.div>

          {/* Desktop table */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block overflow-x-auto"
          >
            <table className="w-full border-collapse rounded-xl overflow-hidden border border-border text-sm">
              <thead>
                <tr>
                  <th className="text-left p-4 bg-background text-muted-foreground font-medium border-b border-border w-[30%]">
                    Fonctionnalité
                  </th>
                  <th className="p-4 bg-background text-foreground font-semibold border-b border-border text-center">
                    DataDiag
                  </th>
                  <th className="p-4 bg-[hsl(211,100%,97%)] text-primary font-semibold border-b border-primary/20 text-center">
                    GrowthPilot ⭐
                  </th>
                  <th className="p-4 bg-background text-foreground font-semibold border-b border-border text-center">
                    LoyaltyLoop
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-background" : "bg-secondary/30"}>
                    <td className="p-4 text-foreground font-medium border-b border-border/50">
                      {row.feature}
                    </td>
                    {[row.datadiag, row.growth, row.loyalty].map((val, ci) => (
                      <td
                        key={ci}
                        className={`p-4 text-center border-b border-border/50 ${ci === 1 ? "bg-[hsl(211,100%,97%)]" : ""}`}
                      >
                        {val === "✓" ? (
                          <Check className="h-4 w-4 text-success mx-auto" />
                        ) : val === "—" ? (
                          <Minus className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* Mobile accordion */}
          <div className="md:hidden space-y-4">
            {plans.map((plan) => (
              <details key={plan.name} className="bg-background rounded-2xl border border-border p-5 group">
                <summary className="font-semibold text-foreground cursor-pointer list-none flex justify-between items-center">
                  {plan.name} — {getPrice(plan.monthly)}€/mois
                  <ChevronDown className="h-4 w-4 text-muted-foreground group-open:rotate-180 transition-transform" />
                </summary>
                <ul className="mt-4 space-y-2">
                  {comparisonRows.map((row) => {
                    const val =
                      plan.name === "DataDiag" ? row.datadiag :
                      plan.name === "GrowthPilot" ? row.growth : row.loyalty;
                    return (
                      <li key={row.feature} className="flex justify-between text-sm py-1.5 border-b border-border/30 last:border-0">
                        <span className="text-muted-foreground">{row.feature}</span>
                        <span className="font-medium text-foreground">
                          {val === "✓" ? <Check className="h-4 w-4 text-success inline" /> :
                           val === "—" ? <Minus className="h-4 w-4 text-muted-foreground/30 inline" /> : val}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* REASSURANCE */}
      <section style={{ padding: "80px 0" }}>
        <div className="container mx-auto px-6 max-w-[1200px]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {reassurance.map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-full bg-background border border-border flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="surface" style={{ padding: "100px 0" }}>
        <div className="container mx-auto px-6 max-w-2xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-10"
          >
            <h2 className="text-foreground mb-3" style={{ fontSize: "clamp(28px, 4vw, 40px)" }}>
              Questions fréquentes
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Accordion type="single" collapsible className="space-y-3">
              {faq.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="bg-background rounded-2xl border border-border px-6 overflow-hidden"
                >
                  <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline py-5">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: "120px 0" }}>
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2
              className="text-foreground mb-5"
              style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
            >
              Prêt à transformer vos données en performance ?
            </h2>
            <p className="text-muted-foreground mb-10" style={{ fontSize: 19 }}>
              Rejoignez +200 entreprises qui pilotent leur croissance avec Scalyo.
              Commencez gratuitement, sans carte bancaire.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/auth")}>
                Démarrer gratuitement <ArrowRight className="ml-1 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/contact")}>
                Parler à un expert
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
