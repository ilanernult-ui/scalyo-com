import { BarChart3, TrendingUp, Cog, ArrowRight } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Audit IA de Votre Business",
    description: "Diagnostic complet de la performance de votre entreprise — ventes, marketing, trafic et opérations — avec un score clair et des recommandations concrètes.",
    highlights: ["Score de Santé Business", "Détection de Problèmes", "Opportunités de Croissance"],
    color: "primary" as const,
  },
  {
    icon: TrendingUp,
    title: "Optimisation des Ventes",
    description: "L'IA analyse votre pipeline commercial, vos taux de conversion et la qualité de vos leads pour maximiser votre chiffre d'affaires.",
    highlights: ["Analyse du Pipeline", "Priorisation des Leads", "Optimisation du Tunnel"],
    color: "secondary" as const,
  },
  {
    icon: Cog,
    title: "Optimisation des Coûts & Processus",
    description: "Identifiez les dépenses inutiles, les processus inefficaces et les tâches répétitives. Obtenez des recommandations d'automatisation concrètes.",
    highlights: ["Réduction des Coûts", "Automatisation", "Gains de Productivité"],
    color: "accent" as const,
  },
];

const colorMap = {
  primary: { bg: "bg-primary/10", text: "text-primary", icon: "gradient-primary" },
  secondary: { bg: "bg-secondary/10", text: "text-secondary", icon: "bg-secondary" },
  accent: { bg: "bg-accent/10", text: "text-accent", icon: "bg-accent" },
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">La Solution</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            Trois Piliers pour Accélérer Votre Croissance
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Notre plateforme IA délivre des insights actionnables sur les domaines les plus impactants de votre entreprise.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, i) => {
            const colors = colorMap[feature.color];
            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-border bg-card p-8 shadow-card hover:shadow-elevated transition-all duration-500 animate-fade-in"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className={`${colors.icon} rounded-xl p-3 w-fit mb-6`}>
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{feature.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {feature.highlights.map((h) => (
                    <span key={h} className={`text-xs font-semibold ${colors.bg} ${colors.text} rounded-full px-3 py-1`}>
                      {h}
                    </span>
                  ))}
                </div>
                <a href="#report" className={`inline-flex items-center gap-1 text-sm font-semibold ${colors.text} group-hover:gap-2 transition-all`}>
                  En savoir plus <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
