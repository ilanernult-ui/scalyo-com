import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FinalCTA = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto gradient-primary rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary-foreground mb-4">
              Commencez à Optimiser Votre Business Dès Aujourd'hui
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-lg mx-auto">
              Laissez l'IA vous montrer exactement ce qu'il faut améliorer. Obtenez votre premier rapport en quelques minutes.
            </p>
            <Button
              variant="outline"
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 border-0 font-bold text-base px-8 py-6 rounded-xl"
              onClick={() => navigate("/dashboard")}
            >
              Lancer Mon Analyse Gratuite
              <ArrowRight className="ml-1 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
