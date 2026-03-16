import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-8 animate-fade-in">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="text-sm font-medium text-foreground">AI-Powered Business Intelligence</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          Turn Your Business Data Into{" "}
          <span className="text-gradient">Clear Growth Opportunities</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Our AI analyzes your company and shows exactly what to improve to increase revenue, reduce costs and grow faster.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <Button variant="hero" size="lg" className="text-base px-8 py-6" onClick={() => navigate("/dashboard")}>
            Analyze My Business
            <ArrowRight className="ml-1 h-5 w-5" />
          </Button>
          <Button variant="hero-outline" size="lg" className="text-base px-8 py-6">
            <Play className="mr-1 h-4 w-4" />
            See How It Works
          </Button>
        </div>

        <div className="flex items-center justify-center gap-8 mt-12 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            No credit card required
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            14-day free trial
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Results in minutes
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
