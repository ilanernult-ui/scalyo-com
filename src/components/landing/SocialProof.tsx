import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sophie Martin",
    role: "Directrice Générale",
    company: "NovaTech Solutions",
    quote: "OptimAI nous a permis d'identifier des fuites de revenus que nous ignorions. En 3 mois, nos ventes ont augmenté de 27%.",
    rating: 5,
  },
  {
    name: "Thomas Dupont",
    role: "COO",
    company: "CloudScale SAS",
    quote: "Le diagnostic IA a révélé que 40% de nos processus étaient redondants. Nous avons économisé 15h par semaine en automatisant.",
    rating: 5,
  },
  {
    name: "Marie Chen",
    role: "VP Marketing",
    company: "GrowthForge",
    quote: "Les recommandations de LoyaltyLoop ont réduit notre taux de churn de 30% en seulement 2 mois. Résultat concret et mesurable.",
    rating: 5,
  },
];

const logos = ["NovaTech", "CloudScale", "GrowthForge", "DataPulse", "Synapse AI", "Cortex Labs"];

const SocialProof = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Témoignages</p>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground mb-4">
            Ils nous font confiance
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card rounded-2xl p-8"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                ))}
              </div>
              <p className="text-foreground text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
              <div>
                <p className="font-heading font-bold text-foreground text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role} — {t.company}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {logos.map((logo) => (
            <span key={logo} className="text-sm font-heading font-semibold text-muted-foreground/40 uppercase tracking-widest">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
