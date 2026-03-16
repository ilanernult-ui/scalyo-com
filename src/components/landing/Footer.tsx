import { Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="gradient-primary rounded-xl p-2">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-extrabold text-foreground">Axon</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Plateforme IA d'analyse et d'optimisation pour les entreprises ambitieuses.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-foreground text-sm mb-3">Produit</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition-colors">Fonctionnalités</a></li>
              <li><a href="#pricing" className="hover:text-foreground transition-colors">Tarifs</a></li>
              <li><a href="#report" className="hover:text-foreground transition-colors">Rapport IA</a></li>
              <li><a href="#security" className="hover:text-foreground transition-colors">Sécurité</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-foreground text-sm mb-3">Entreprise</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">À propos</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Carrières</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-foreground text-sm mb-3">Légal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Politique de confidentialité</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Conditions d'utilisation</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">RGPD</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Mentions légales</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2026 Axon AI. Tous droits réservés.</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">🔒 Chiffrement AES-256</span>
            <span className="flex items-center gap-1.5">🇪🇺 Conforme RGPD</span>
            <span className="flex items-center gap-1.5">🛡️ SOC 2 Type II</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
