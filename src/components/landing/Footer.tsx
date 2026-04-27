import { Link } from "react-router-dom";
import scalyoLogo from "@/assets/scalyo-logo.png";

const Footer = () => {
  return (
    <footer className="surface border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={scalyoLogo} alt="Scalyo" className="h-8 w-8 object-contain" />
              <span className="text-base font-semibold text-foreground tracking-tight">Scalyo</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              L'IA qui optimise votre entreprise. Diagnostic, recommandations et suivi de performance.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground text-sm mb-4">Produit</h4>
            <div className="space-y-3">
              <Link to="/services/datadiag" className="block text-sm text-muted-foreground hover:text-foreground apple-easing">DataDiag</Link>
              <Link to="/services/growthpilot" className="block text-sm text-muted-foreground hover:text-foreground apple-easing">GrowthPilot</Link>
              <Link to="/services/loyaltyloop" className="block text-sm text-muted-foreground hover:text-foreground apple-easing">LoyaltyLoop</Link>
              <Link to="/pricing" className="block text-sm text-muted-foreground hover:text-foreground apple-easing">Tarifs</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground text-sm mb-4">Entreprise</h4>
            <div className="space-y-3">
              <Link to="/about" className="block text-sm text-muted-foreground hover:text-foreground apple-easing">À propos</Link>
              <Link to="/blog" className="block text-sm text-muted-foreground hover:text-foreground apple-easing">Blog</Link>
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-foreground apple-easing">Contact</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground text-sm mb-4">Légal</h4>
            <div className="space-y-3">
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-foreground apple-easing">Mentions légales</Link>
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-foreground apple-easing">CGU</Link>
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-foreground apple-easing">Politique de confidentialité</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Scalyo. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground apple-easing">LinkedIn</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground apple-easing">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
