import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-info/8 rounded-full blur-[100px] animate-float" style={{ animationDelay: "3s" }} />

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          <span className="text-sm font-medium text-muted-foreground">Déjà utilisé par +200 entreprises</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl font-heading font-extrabold tracking-tight max-w-5xl mx-auto mb-6 leading-[1.1]"
        >
          Arrêtez de deviner.{" "}
          <span className="gradient-text">Commencez à performer.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          OptimAI analyse les données de votre entreprise, détecte vos freins de croissance et vous donne les solutions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            size="lg"
            className="gradient-primary text-primary-foreground text-base px-8 py-6 rounded-xl font-semibold shimmer glow"
            onClick={() => navigate("/dashboard")}
          >
            Démarrer gratuitement
            <ArrowRight className="ml-1 h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-base px-8 py-6 rounded-xl border-border text-foreground"
            onClick={() => navigate("/dashboard")}
          >
            <Play className="mr-1 h-4 w-4" />
            Voir une démo
          </Button>
        </motion.div>

        {/* Dashboard preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <div className="glass-card rounded-2xl p-1 glow">
            <div className="bg-card rounded-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-accent/60" />
                <span className="text-xs text-muted-foreground ml-2 font-body">OptimAI Dashboard — Aperçu</span>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Score global", value: "74/100", color: "text-primary" },
                  { label: "Opportunités", value: "+12", color: "text-accent" },
                  { label: "Revenus potentiels", value: "+23%", color: "text-info" },
                ].map((kpi) => (
                  <div key={kpi.label} className="glass-card rounded-lg p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{kpi.label}</p>
                    <p className={`text-2xl font-heading font-bold ${kpi.color}`}>{kpi.value}</p>
                  </div>
                ))}
              </div>
              <div className="glass-card rounded-lg p-4">
                <div className="flex items-end gap-2 h-32">
                  {[40, 55, 35, 70, 60, 80, 65, 90, 75, 85, 70, 95].map((h, i) => (
                    <div key={i} className="flex-1 gradient-primary rounded-t opacity-60 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }} />
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
