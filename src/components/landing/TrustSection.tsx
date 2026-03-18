import { Shield, Lock, Eye, Server } from "lucide-react";
import { motion } from "framer-motion";

const trustItems = [
  {
    icon: Lock,
    title: "Chiffrement AES-256",
    description: "Toutes vos données sont chiffrées en transit et au repos avec les standards les plus élevés.",
  },
  {
    icon: Shield,
    title: "Conforme RGPD",
    description: "Nous respectons scrupuleusement le RGPD. Vos données restent en Europe.",
  },
  {
    icon: Eye,
    title: "Transparence totale",
    description: "Vos données ne sont jamais vendues. Vous gardez le contrôle total à tout moment.",
  },
  {
    icon: Server,
    title: "Intégrations sécurisées",
    description: "Connexions OAuth 2.0 avec vos outils. Aucun mot de passe stocké.",
  },
];

const TrustSection = () => {
  return (
    <section className="py-24 border-t border-border/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Sécurité</p>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground mb-4">
            Vos données sont protégées
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            La sécurité n'est pas une option. C'est le fondement de notre plateforme.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {trustItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 mb-4">
                <item.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-sm font-heading font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
