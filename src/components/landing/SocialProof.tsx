import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "PDG, GrowthLab",
    quote: "Axon a identifié 30K€ de dépenses publicitaires gaspillées dont on n'avait aucune idée. Le retour sur investissement a été immédiat.",
    rating: 5,
  },
  {
    name: "Marcus Weber",
    role: "Directeur des Opérations, ScaleOps",
    quote: "Les recommandations d'automatisation ont permis à notre équipe d'économiser 20 heures par semaine. Un vrai game changer.",
    rating: 5,
  },
  {
    name: "Léa Martin",
    role: "Fondatrice, NovaTech",
    quote: "Nous sommes passés de 2% à 5,4% de taux de conversion en 8 semaines grâce aux insights ventes d'Axon.",
    rating: 5,
  },
];

const stats = [
  { value: "2 400+", label: "Entreprises analysées" },
  { value: "12M€+", label: "Économies identifiées" },
  { value: "3,2x", label: "ROI moyen" },
  { value: "94%", label: "Taux de satisfaction" },
];

const SocialProof = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-20">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-extrabold text-gradient">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="rounded-2xl border border-border bg-background p-6 shadow-card animate-fade-in"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground mb-4 leading-relaxed">"{t.quote}"</p>
              <div>
                <p className="font-semibold text-foreground text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
