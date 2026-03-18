import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border/30 py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="gradient-primary rounded-lg p-1.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <span className="text-lg font-heading font-bold text-foreground">OptimAI</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              L'IA qui optimise votre entreprise. Diagnostic, recommandations et suivi de performance.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-bold text-foreground text-sm mb-4">Produit</h4>
            <div className="space-y-3">
              <Link to="/services/datadiag" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">DataDiag</Link>
              <Link to="/services/growthpilot" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">GrowthPilot</Link>
              <Link to="/services/loyaltyloop" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">LoyaltyLoop</Link>
              <Link to="/pricing" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Tarifs</Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold text-foreground text-sm mb-4">Entreprise</h4>
            <div className="space-y-3">
              <Link to="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">À propos</Link>
              <Link to="/blog" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold text-foreground text-sm mb-4">Légal</h4>
            <div className="space-y-3">
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Mentions légales</a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">CGU</a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Politique de confidentialité</a>
            </div>
          </div>
        </div>

        <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} OptimAI. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">LinkedIn</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
