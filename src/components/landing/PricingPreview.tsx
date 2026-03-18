import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PricingPreview = () => {
  return (
    <section className="surface" style={{ padding: "120px 0" }}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="apple-label mb-3">Tarifs</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)" }} className="text-foreground mb-4">
            Des tarifs simples et transparents
          </h2>
          <p className="text-muted-foreground mb-8">
            À partir de 149€/mois. Sans engagement, annulation à tout moment. 14 jours d'essai gratuit.
          </p>
          <Button asChild size="lg">
            <Link to="/pricing">
              Voir les tarifs <ArrowRight className="ml-1 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingPreview;
