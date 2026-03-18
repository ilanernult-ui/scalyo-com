import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto glass-card rounded-3xl p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 gradient-primary opacity-5" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground mb-4">
              Prêt à optimiser votre entreprise ?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Rejoignez +200 entreprises qui utilisent OptimAI pour prendre de meilleures décisions, plus vite.
            </p>
            <Button
              size="lg"
              className="gradient-primary text-primary-foreground text-base px-8 py-6 rounded-xl font-semibold shimmer glow"
              onClick={() => navigate("/dashboard")}
            >
              Démarrer gratuitement <ArrowRight className="ml-1 h-5 w-5" />
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              14 jours gratuits · Sans carte bancaire · Sans engagement
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
