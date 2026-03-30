import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section className="pt-32 pb-24" style={{ paddingTop: "clamp(120px, 15vh, 180px)", paddingBottom: "clamp(80px, 10vh, 120px)" }}>
      <div className="container mx-auto px-4 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="apple-label mb-6 text-muted-foreground"
        >
          OPTIMISATION D'ENTREPRISE PAR L'IA
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto max-w-4xl mb-6"
          style={{ fontSize: "clamp(40px, 6vw, 80px)" }}
        >
          Vos données.{" "}
          <br className="hidden sm:block" />
          Votre croissance.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground max-w-2xl mx-auto mb-10"
          style={{ fontSize: "clamp(17px, 2vw, 19px)" }}
        >
          Scalyo analyse vos données d'entreprise, détecte vos freins
          et génère un plan d'action personnalisé. Immédiatement.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Button size="lg" onClick={() => navigate("/dashboard")}>
            Démarrer gratuitement <ArrowRight className="ml-1 h-5 w-5" />
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate("/dashboard")}>
            Voir la démo
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-sm text-muted-foreground"
        >
          ★★★★★&nbsp;&nbsp;Déjà utilisé par +200 entreprises B2B
        </motion.p>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <div className="apple-card p-1" style={{ transform: "perspective(2000px) rotateX(4deg)" }}>
            <div className="bg-background rounded-[14px] p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-destructive/40" />
                <div className="w-3 h-3 rounded-full bg-warning/40" />
                <div className="w-3 h-3 rounded-full bg-success/40" />
                <span className="text-xs text-muted-foreground ml-2">Scalyo Dashboard — Aperçu</span>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Score global", value: "74/100", color: "text-primary" },
                  { label: "Opportunités", value: "+12", color: "text-success" },
                  { label: "Revenus potentiels", value: "+23%", color: "text-primary" },
                ].map((kpi) => (
                  <div key={kpi.label} className="surface rounded-xl p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{kpi.label}</p>
                    <p className={`text-2xl font-bold tracking-tight ${kpi.color}`}>{kpi.value}</p>
                  </div>
                ))}
              </div>
              <div className="surface rounded-xl p-4">
                <div className="flex items-end gap-2 h-32">
                  {[40, 55, 35, 70, 60, 80, 65, 90, 75, 85, 70, 95].map((h, i) => (
                    <div key={i} className="flex-1 bg-primary rounded-t opacity-40 hover:opacity-100 apple-easing" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
