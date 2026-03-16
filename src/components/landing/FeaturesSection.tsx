import { BarChart3, TrendingUp, Cog } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Audit IA de votre Business",
    description: "Obtenez un diagnostic complet de la performance de votre entreprise — ventes, marketing, trafic et opérations — avec un score clair et des recommandations concrètes.",
    highlights: ["Score de Performance", "Détection de Problèmes", "Opportunités de Croissance"],
  },
  {
    icon: TrendingUp,
    title: "Optimisation des Ventes",
    description: "L'IA analyse votre pipeline commercial, vos taux de conversion et la qualité de vos leads pour booster votre chiffre d'affaires.",
    highlights: ["Boost de Conversion", "Priorisation des Leads", "Optimisation du Tunnel"],
  },
  {
    icon: Cog,
    title: "Optimisation des Coûts & Processus",
    description: "Identifiez les inefficacités, réduisez les dépenses inutiles et découvrez les opportunités d'automatisation pour scaler plus vite.",
    highlights: ["Réduction des Coûts", "Automatisation", "Gains de Productivité"],
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Services Principaux</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trois Piliers de Croissance
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Notre plateforme IA délivre des insights actionnables sur les domaines les plus importants.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-background p-8 shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="gradient-primary rounded-xl p-3 w-fit mb-6">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground mb-5 leading-relaxed">{feature.description}</p>
              <div className="flex flex-wrap gap-2">
                {feature.highlights.map((h) => (
                  <span key={h} className="text-xs font-medium bg-primary/10 text-primary rounded-full px-3 py-1">
                    {h}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
