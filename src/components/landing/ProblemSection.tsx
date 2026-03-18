import { BarChart3, Clock, Target } from "lucide-react";
import { motion } from "framer-motion";

const problems = [
  {
    icon: BarChart3,
    title: "Vous avez des données mais pas d'insights",
    description: "Vos données sont éparpillées, inexploitées. Vous prenez des décisions à l'aveugle.",
  },
  {
    icon: Clock,
    title: "Vos équipes perdent du temps",
    description: "Des processus manuels, des tâches répétitives. La productivité est freinée.",
  },
  {
    icon: Target,
    title: "Vous ne savez pas où agir en priorité",
    description: "Trop de chantiers, pas assez de clarté. Vous dispersez vos efforts.",
  },
];

const ProblemSection = () => {
  return (
    <section className="surface" style={{ padding: "120px 0" }}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="apple-label mb-3">Le problème</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)" }} className="text-foreground mb-4">
            Votre entreprise mérite mieux
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            La plupart des entreprises perdent du temps et de l'argent faute de visibilité sur leurs vrais problèmes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {problems.map((problem, i) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="apple-card text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-6">
                <problem.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3 tracking-tight">{problem.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{problem.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
