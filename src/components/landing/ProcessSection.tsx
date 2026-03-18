import { Database, Cpu, FileText, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Database,
    number: "01",
    title: "Connexion de vos sources",
    description: "Connectez vos outils métier en quelques clics. CRM, comptabilité, analytics — tout est sécurisé.",
  },
  {
    icon: Cpu,
    number: "02",
    title: "Analyse automatique par l'IA",
    description: "Notre IA parcourt vos données, identifie les anomalies et détecte les opportunités cachées.",
  },
  {
    icon: FileText,
    number: "03",
    title: "Rapport de diagnostic",
    description: "Recevez un rapport clair avec votre score de performance et les problèmes identifiés.",
  },
  {
    icon: TrendingUp,
    number: "04",
    title: "Plan d'action + suivi",
    description: "Obtenez des recommandations priorisées et suivez vos progrès en temps réel.",
  },
];

const ProcessSection = () => {
  return (
    <section className="surface" style={{ padding: "120px 0" }}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="apple-label mb-3">Comment ça marche</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)" }} className="text-foreground mb-4">
            4 étapes vers la performance
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-border" />
                )}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-background border border-border mb-4 relative" style={{ boxShadow: "var(--shadow-sm)" }}>
                  <step.icon className="h-7 w-7 text-primary" />
                  <span className="absolute -top-2 -right-2 text-[10px] font-semibold text-primary-foreground bg-primary rounded-full w-6 h-6 flex items-center justify-center">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2 tracking-tight">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
