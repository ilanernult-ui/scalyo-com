import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Shield, Lock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-secondary/8 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 mb-8 animate-fade-in">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Plateforme IA Sécurisée pour Entreprises</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto mb-6 animate-fade-in leading-[1.1]" style={{ animationDelay: "0.1s" }}>
          Comprenez Ce Qui{" "}
          <span className="text-gradient">Freine Votre Croissance</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in leading-relaxed" style={{ animationDelay: "0.2s" }}>
          Notre IA analyse votre entreprise et vous montre exactement quoi améliorer pour croître plus vite. Diagnostic complet, recommandations concrètes, résultats mesurables.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <Button variant="hero" size="lg" className="text-base px-8 py-6 rounded-xl" onClick={() => navigate("/dashboard")}>
            Analyser Mon Entreprise
            <ArrowRight className="ml-1 h-5 w-5" />
          </Button>
          <Button variant="hero-outline" size="lg" className="text-base px-8 py-6 rounded-xl" onClick={() => navigate("/dashboard")}>
            <Play className="mr-1 h-4 w-4" />
            Voir Comment Ça Marche
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-accent" />
            Sans carte bancaire
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-accent" />
            14 jours d'essai gratuit
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-accent" />
            Données chiffrées
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-accent" />
            Conforme RGPD
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
