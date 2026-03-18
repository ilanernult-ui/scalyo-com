import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Heart, Lightbulb, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const team = [
  { name: "Alexandre Moreau", role: "CEO & Co-fondateur", bio: "Ex-McKinsey, 15 ans en conseil stratégique." },
  { name: "Léa Bernard", role: "CTO & Co-fondatrice", bio: "Ex-Google, experte en IA et machine learning." },
  { name: "Marc Lefèvre", role: "VP Produit", bio: "10 ans dans le product management SaaS B2B." },
  { name: "Camille Rousseau", role: "Head of Data Science", bio: "PhD en statistiques, spécialiste NLP et prédiction." },
];

const values = [
  { icon: Target, title: "Impact mesurable", description: "Chaque recommandation est liée à un ROI estimé." },
  { icon: Shield, title: "Sécurité d'abord", description: "La confiance de nos clients est notre priorité absolue." },
  { icon: Lightbulb, title: "Innovation continue", description: "Nos modèles IA s'améliorent constamment avec vos retours." },
  { icon: Heart, title: "Transparence", description: "Pas de boîte noire. Vous comprenez chaque recommandation." },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center mb-20">
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-6">Notre mission</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              OptimAI est né d'un constat simple : les entreprises croulent sous les données mais manquent de visibilité sur leurs vrais leviers de croissance. Notre mission est de rendre l'intelligence artificielle accessible à toutes les entreprises pour des décisions plus rapides et plus éclairées.
            </p>
          </motion.div>

          {/* Story */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto glass-card rounded-2xl p-10 mb-20"
          >
            <h2 className="text-2xl font-heading font-bold text-foreground mb-4">Notre histoire</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Fondée en 2023 par Alexandre et Léa, OptimAI combine expertise conseil et technologie IA de pointe. Après avoir accompagné des dizaines d'entreprises dans leur transformation digitale, nous avons constaté que les outils d'analyse existants étaient soit trop complexes, soit trop superficiels.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Nous avons créé OptimAI pour combler ce vide : une plateforme qui comprend votre entreprise et vous donne des recommandations concrètes, pas des dashboards de plus.
            </p>
          </motion.div>

          {/* Values */}
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-2xl font-heading font-extrabold text-foreground text-center mb-10">Nos valeurs</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-2xl p-6 flex gap-4"
                >
                  <div className="bg-primary/10 rounded-xl p-3 h-fit">
                    <v.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-foreground mb-1">{v.title}</h3>
                    <p className="text-sm text-muted-foreground">{v.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-2xl font-heading font-extrabold text-foreground text-center mb-10">L'équipe</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-2xl p-6 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                    <span className="text-xl font-heading font-bold text-primary">{member.name.split(" ").map(n => n[0]).join("")}</span>
                  </div>
                  <h3 className="font-heading font-bold text-foreground text-sm">{member.name}</h3>
                  <p className="text-xs text-primary font-medium mb-2">{member.role}</p>
                  <p className="text-xs text-muted-foreground">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button asChild size="lg" className="gradient-primary text-primary-foreground font-semibold shimmer">
              <Link to="/contact">Rejoignez-nous <ArrowRight className="ml-1 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;
