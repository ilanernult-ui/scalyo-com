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
    title: "Diagnostic Business 360°",
    description: "Votre entreprise perd de l'argent et du temps sans le savoir. DataDiag identifie ces fuites en 48h et vous donne un plan d'action concret pour les stopper.",
    features: [
      "Score Business 360° (Rentabilité · Efficacité · Croissance)",
      "Détection des pertes d'argent et de temps",
      "Top 5 actions rapides à impact immédiat",
      "Estimation « vous perdez X€/mois »",
      "Dashboard KPIs en temps réel",
      "Rapport IA mensuel",
    ],
    caseStudy: {
      company: "Une PME industrielle de 80 salariés",
      result: "a identifié 340 000€ de coûts cachés et augmenté sa marge nette de 12% en 4 mois grâce au diagnostic DataDiag.",
    },
    faq: [
      { q: "Quelles données sont analysées ?", a: "Finance, RH, opérations, ventes — toutes les données que vous connectez. L'IA détecte les anomalies et les zones de sous-performance." },
      { q: "Combien de temps prend le diagnostic ?", a: "Le premier diagnostic complet est prêt en 48 heures après la connexion de vos sources de données." },
      { q: "Comment est calculée l'estimation des pertes ?", a: "L'IA croise vos données financières, vos charges et vos marges pour estimer les pertes mensuelles en euros." },
    ],
  },
  {
    icon: Rocket,
    slug: "growthpilot",
    name: "GrowthPilot",
    title: "Co-pilote IA de croissance",
    description: "Votre co-pilote IA qui génère chaque semaine un plan d'action priorisé par ROI, avec des quick wins chiffrés en € et des automatisations pour gagner +10h/semaine.",
    features: [
      "Tout DataDiag inclus",
      "Plan d'action PRIORISÉ par ROI chaque semaine",
      "Quick wins immédiats avec gains estimés en €",
      "Automatisations recommandées (+10h/semaine)",
      "Analyse ventes & tunnel de conversion",
      "IA qui explique le COMMENT pas-à-pas",
      "Suivi d'impact en temps réel",
    ],
    caseStudy: {
      company: "Un e-commerce B2B avec 2M€ de CA",
      result: "a augmenté ses ventes de 34% en 3 mois et gagné 12h/semaine grâce aux automatisations recommandées par GrowthPilot.",
    },
    faq: [
      { q: "Comment sont priorisées les actions ?", a: "Par impact estimé sur votre CA (en €), facilité de mise en œuvre et rapidité de résultat. Chaque action a un score ROI." },
      { q: "Que signifie +10h/semaine ?", a: "L'IA identifie les tâches répétitives automatisables et estime le temps récupéré chaque semaine." },
      { q: "Les recommandations sont-elles génériques ?", a: "Non, elles sont basées exclusivement sur vos données et le contexte de votre secteur." },
    ],
  },
  {
    icon: Heart,
    slug: "loyaltyloop",
    name: "LoyaltyLoop",
    title: "Transformation Business Complète",
    description: "La solution complète pour transformer votre business : optimisation continue automatique, recommandations hebdomadaires, suivi ROI temps réel et +25% de croissance visée.",
    features: [
      "Tout GrowthPilot inclus",
      "Optimisation continue automatique chaque semaine",
      "Nouvelles recommandations hebdomadaires",
      "Suivi des résultats & ROI en temps réel",
      "Automatisations avancées prêtes à déployer",
      "Analyse 360° : clients + croissance + rentabilité",
      "Prédiction du churn & stratégies de rétention",
      "Intégrations CRM avancées · Utilisateurs illimités",
    ],
    caseStudy: {
      company: "Une PME SaaS de 50 salariés",
      result: "a augmenté sa croissance de 25%, réduit son churn de 30% et automatisé 80% de ses processus de suivi client en 3 mois.",
    },
    faq: [
      { q: "En quoi LoyaltyLoop est différent de GrowthPilot ?", a: "LoyaltyLoop ajoute l'optimisation continue automatique, les automatisations avancées et l'analyse 360° complète incluant fidélisation et churn." },
      { q: "Les stratégies de rétention sont-elles automatisées ?", a: "Oui, vous pouvez configurer des actions automatiques (emails, offres) déclenchées par les alertes IA." },
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
