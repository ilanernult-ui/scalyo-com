import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, Rocket, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const services = [
  {
    icon: Activity,
    slug: "datadiag",
    name: "DataDiag",
    title: "Diagnostic de performance",
    description: "Analyse complète des données métier : finance, RH, opérations. Identifie les anomalies et les zones de sous-performance.",
    features: [
      "Analyse financière automatisée",
      "Détection d'anomalies en temps réel",
      "Score de performance global",
      "Comparaison sectorielle",
      "Rapports PDF exportables",
      "Historique de performance",
    ],
    caseStudy: {
      company: "Une PME industrielle de 80 salariés",
      result: "a identifié 340 000€ de coûts cachés et augmenté sa marge nette de 12% en 4 mois.",
    },
    faq: [
      { q: "Quelles données sont analysées ?", a: "Finance, RH, opérations, ventes — toutes les données que vous connectez via vos outils métier." },
      { q: "Combien de temps prend l'analyse ?", a: "Le premier diagnostic complet est prêt en moins de 24 heures après la connexion de vos sources." },
      { q: "Le diagnostic est-il mis à jour ?", a: "Oui, votre score de performance est recalculé en continu selon la fréquence de vos données." },
    ],
  },
  {
    icon: Rocket,
    slug: "growthpilot",
    name: "GrowthPilot",
    title: "Optimisation & Recommandations IA",
    description: "Génère un plan d'action personnalisé avec des recommandations priorisées selon leur impact potentiel sur votre activité.",
    features: [
      "Plan d'action priorisé par impact",
      "Recommandations IA personnalisées",
      "Suivi de mise en œuvre",
      "Estimation du ROI par action",
      "Alertes sur les opportunités",
      "Rapports hebdomadaires",
    ],
    caseStudy: {
      company: "Un e-commerce B2B avec 2M€ de CA",
      result: "a augmenté ses ventes de 34% en 3 mois en suivant les recommandations GrowthPilot.",
    },
    faq: [
      { q: "Comment sont priorisées les recommandations ?", a: "Par impact estimé sur votre CA, facilité de mise en œuvre et rapidité de résultat." },
      { q: "Puis-je filtrer les recommandations ?", a: "Oui, par domaine (marketing, ventes, opérations) et par niveau de priorité." },
      { q: "Les recommandations sont-elles génériques ?", a: "Non, elles sont basées exclusivement sur vos données et le contexte de votre secteur." },
    ],
  },
  {
    icon: Heart,
    slug: "loyaltyloop",
    name: "LoyaltyLoop",
    title: "Fidélisation & Engagement client",
    description: "Analyse le comportement client, détecte les risques de churn et propose des stratégies de rétention automatisées.",
    features: [
      "Score de risque de churn par client",
      "Segmentation comportementale",
      "Stratégies de rétention automatisées",
      "Analyse de la satisfaction",
      "Prédiction de la LTV",
      "Alertes proactives",
    ],
    caseStudy: {
      company: "Une PME SaaS de 50 salariés",
      result: "a réduit son taux de churn de 30% en 3 mois et augmenté la LTV moyenne de 22%.",
    },
    faq: [
      { q: "Comment détectez-vous le risque de churn ?", a: "Par l'analyse de signaux comportementaux : fréquence d'usage, engagement, historique d'achat, tickets support." },
      { q: "Les stratégies sont-elles automatisées ?", a: "Oui, vous pouvez configurer des actions automatiques (emails, offres) déclenchées par les alertes IA." },
      { q: "Quels CRM sont compatibles ?", a: "Salesforce, HubSpot, Pipedrive et tout CRM avec API REST." },
    ],
  },
];

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section style={{ paddingTop: "clamp(100px, 12vh, 140px)", paddingBottom: "60px" }}>
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 style={{ fontSize: "clamp(40px, 6vw, 64px)" }} className="text-foreground mb-4">Nos Services</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Trois solutions complémentaires pour diagnostiquer, optimiser et fidéliser.
            </p>
          </motion.div>

          <div className="space-y-32">
            {services.map((service, idx) => (
              <motion.div
                key={service.slug}
                id={service.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-primary rounded-2xl p-3">
                    <service.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="apple-label">{service.name}</p>
                    <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">{service.title}</h2>
                  </div>
                </div>

                <p className="text-muted-foreground mb-8 max-w-2xl">{service.description}</p>

                <div className="grid sm:grid-cols-2 gap-4 mb-10">
                  {service.features.map((f) => (
                    <div key={f} className="flex items-center gap-3 apple-card !p-4">
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      <span className="text-sm text-foreground">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="surface rounded-[18px] p-8 mb-10">
                  <p className="apple-label text-success mb-2">Cas concret</p>
                  <p className="text-foreground leading-relaxed">
                    <span className="font-semibold">{service.caseStudy.company}</span> {service.caseStudy.result}
                  </p>
                </div>

                <div className="space-y-4 mb-10">
                  <h3 className="text-lg font-semibold text-foreground tracking-tight">Questions fréquentes</h3>
                  {service.faq.map((item) => (
                    <details key={item.q} className="apple-card !p-4 group">
                      <summary className="text-sm font-medium text-foreground cursor-pointer list-none flex items-center justify-between">
                        {item.q}
                        <span className="text-primary group-open:rotate-45 apple-easing text-lg">+</span>
                      </summary>
                      <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{item.a}</p>
                    </details>
                  ))}
                </div>

                <Button asChild>
                  <Link to="/contact">
                    Commencer avec {service.name} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Services;
