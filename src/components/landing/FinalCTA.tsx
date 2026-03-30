import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const FinalCTA = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section style={{ padding: "120px 0" }}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto surface rounded-[20px] p-12 text-center"
        >
          <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)" }} className="text-foreground mb-4">
            Prêt à optimiser votre entreprise ?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Rejoignez +200 entreprises qui utilisent Scalyo pour prendre de meilleures décisions, plus vite.
          </p>
          <Button size="lg" onClick={() => navigate(user ? "/tarifs" : "/auth")}>
            Essayer <ArrowRight className="ml-1 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
