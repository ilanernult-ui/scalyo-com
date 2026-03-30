import { ArrowRight, Activity, Rocket, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const services = [
  {
    icon: Activity,
    name: "DataDiag",
    title: "Diagnostic Business 360°",
    description: "Identifie vos pertes d'argent et de temps en 48h. Score de performance global, top 5 actions rapides et estimation « vous perdez X€/mois ».",
    href: "/services/datadiag",
  },
  {
    icon: Rocket,
    name: "GrowthPilot",
    title: "Co-pilote IA de croissance",
    description: "Plan d'action priorisé par ROI chaque semaine, quick wins chiffrés en € et automatisations pour gagner +10h/semaine.",
    href: "/services/growthpilot",
  },
  {
    icon: Heart,
    name: "LoyaltyLoop",
    title: "Transformation Business Complète",
    description: "Optimisation continue automatique : recommandations hebdomadaires, suivi ROI temps réel, analyse 360° et prédiction du churn.",
    href: "/services/loyaltyloop",
  },
];
const FeaturesSection = () => {
  return (
    <section style={{ padding: "120px 0" }}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="apple-label mb-3">Nos services</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)" }} className="text-foreground mb-4">
            Trois leviers pour accélérer votre croissance
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Notre IA délivre des insights actionnables sur les domaines les plus impactants de votre activité.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {services.map((service, i) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group apple-card"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-4">
                <service.icon className="h-6 w-6 text-primary" />
              </div>
              <p className="apple-label mb-1">{service.name}</p>
              <h3 className="text-xl font-semibold text-foreground mb-3 tracking-tight">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">{service.description}</p>
              <Link
                to={service.href}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 apple-easing"
              >
                En savoir plus <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
