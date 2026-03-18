import { ArrowRight, Activity, Rocket, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const services = [
  {
    icon: Activity,
    name: "DataDiag",
    title: "Diagnostic de performance",
    description: "Analyse complète des données métier : finance, RH, opérations. Identifie les anomalies et les zones de sous-performance.",
    color: "primary" as const,
    href: "/services/datadiag",
  },
  {
    icon: Rocket,
    name: "GrowthPilot",
    title: "Optimisation & Recommandations IA",
    description: "Génère un plan d'action personnalisé avec des recommandations priorisées selon leur impact potentiel sur votre activité.",
    color: "info" as const,
    href: "/services/growthpilot",
  },
  {
    icon: Heart,
    name: "LoyaltyLoop",
    title: "Fidélisation & Engagement client",
    description: "Analyse le comportement client, détecte les risques de churn et propose des stratégies de rétention automatisées.",
    color: "accent" as const,
    href: "/services/loyaltyloop",
  },
];

const colorMap = {
  primary: "bg-primary/10 text-primary border-primary/20",
  info: "bg-info/10 text-info border-info/20",
  accent: "bg-accent/10 text-accent border-accent/20",
};

const FeaturesSection = () => {
  return (
    <section id="services" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Nos services</p>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground mb-4">
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
              className="group glass-card rounded-2xl p-8 hover:border-primary/30 transition-all duration-300"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${colorMap[service.color].split(' ').slice(0, 2).join(' ')} mb-4`}>
                <service.icon className="h-6 w-6" />
              </div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{service.name}</p>
              <h3 className="text-xl font-heading font-bold text-foreground mb-3">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">{service.description}</p>
              <Link
                to={service.href}
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all"
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
