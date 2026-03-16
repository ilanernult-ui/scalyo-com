import { Button } from "@/components/ui/button";
import { Zap, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/")}>
          <div className="gradient-primary rounded-xl p-2">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-extrabold text-foreground tracking-tight">Axon</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Fonctionnalités</a>
          <a href="#report" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Rapport IA</a>
          <a href="#security" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Sécurité</a>
          <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Tarifs</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" className="font-medium" onClick={() => navigate("/dashboard")}>Connexion</Button>
          <Button variant="hero" size="sm" onClick={() => navigate("/dashboard")}>Essai Gratuit</Button>
        </div>

        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border px-4 py-4 space-y-3">
          <a href="#features" className="block text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Fonctionnalités</a>
          <a href="#report" className="block text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Rapport IA</a>
          <a href="#security" className="block text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Sécurité</a>
          <a href="#pricing" className="block text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Tarifs</a>
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => { navigate("/dashboard"); setMobileOpen(false); }}>Connexion</Button>
            <Button variant="hero" size="sm" onClick={() => { navigate("/dashboard"); setMobileOpen(false); }}>Essai Gratuit</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
