import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "49€",
    description: "Pour les petites entreprises qui débutent avec l'IA.",
    features: [
      "Audit IA de votre Business",
      "Score de performance",
      "Rapport d'optimisation mensuel",
      "Support par email",
    ],
    popular: false,
  },
  {
    name: "Growth",
    price: "99€",
    description: "Pour les entreprises en croissance qui veulent aller plus loin.",
    features: [
      "Tout ce qui est dans Starter",
      "Insights d'optimisation des ventes",
      "Recommandations IA hebdomadaires",
      "Suivi de performance",
      "Support email prioritaire",
    ],
    popular: true,
  },
  {
    name: "Scale",
    price: "199€",
    description: "Pour les entreprises prêtes à optimiser à fond avec l'IA.",
    features: [
      "Tout ce qui est dans Growth",
      "Optimisation des coûts",
      "Suggestions d'automatisation",
      "Rapports IA avancés",
      "Traitement prioritaire",
      "Account manager dédié",
    ],
    popular: false,
  },
];

const PricingSection = () => {
  const navigate = useNavigate();
  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Tarifs</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            Des Tarifs Simples et Transparents
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Essai gratuit de 14 jours. Sans carte bancaire. Annulation à tout moment.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 animate-fade-in transition-all duration-300 ${
                plan.popular
                  ? "border-primary shadow-primary bg-background scale-[1.03]"
                  : "border-border bg-card shadow-card hover:shadow-card-hover"
              }`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                  Le Plus Populaire
                </div>
              )}
              <h3 className="text-xl font-bold text-foreground mb-1">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-sm">/mois</span>
              </div>
              <Button
                variant={plan.popular ? "hero" : "hero-outline"}
                className="w-full mb-6"
                onClick={() => navigate("/dashboard")}
              >
                Commencer l'Essai Gratuit
              </Button>
              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-accent shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
