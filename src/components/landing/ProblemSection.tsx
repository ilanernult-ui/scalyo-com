import { TrendingDown, Target, Clock } from "lucide-react";

const problems = [
  {
    icon: TrendingDown,
    title: "Marketing Inefficace",
    description: "Vous dépensez en publicité sans savoir ce qui fonctionne. Les budgets sont gaspillés sur des canaux peu performants.",
    stat: "38%",
    statLabel: "de budget publicitaire gaspillé en moyenne",
  },
  {
    icon: Target,
    title: "Opportunités de Vente Perdues",
    description: "Votre pipeline commercial fuit. Des prospects qualifiés sont perdus par manque de suivi ou de priorisation.",
    stat: "67%",
    statLabel: "des leads qualifiés jamais recontactés",
  },
  {
    icon: Clock,
    title: "Temps Opérationnel Gaspillé",
    description: "Les processus manuels et répétitifs consomment des heures précieuses qui pourraient être investies dans la croissance.",
    stat: "20h",
    statLabel: "perdues chaque semaine en tâches manuelles",
  },
];

const ProblemSection = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-destructive uppercase tracking-wider mb-3">Le Problème</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            Votre Entreprise Perd de l'Argent Sans le Savoir
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            La plupart des entreprises ignorent les fuites de performance qui limitent leur croissance. Voici les plus courantes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {problems.map((problem, i) => (
            <div
              key={problem.title}
              className="rounded-2xl border border-destructive/10 bg-background p-8 animate-fade-in hover:border-destructive/20 transition-colors"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="rounded-xl bg-destructive/10 p-3 w-fit mb-6">
                <problem.icon className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{problem.title}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">{problem.description}</p>
              <div className="border-t border-border pt-4">
                <p className="text-3xl font-extrabold text-destructive">{problem.stat}</p>
                <p className="text-xs text-muted-foreground mt-1">{problem.statLabel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
