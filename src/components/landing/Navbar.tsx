import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Tarifs", href: "/pricing" },
  { label: "Tableau de bord", href: "/dashboard" },
  { label: "À propos", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-xl border-b border-foreground/[0.08]" style={{ height: 44 }}>
      <div className="container mx-auto flex items-center justify-between h-full px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary rounded-lg p-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="text-base font-semibold text-foreground tracking-tight">OptimAI</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href} className="text-xs font-medium text-muted-foreground hover:text-foreground apple-easing">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-muted-foreground text-xs" onClick={() => navigate("/auth")}>Connexion</Button>
          <Button size="sm" className="text-xs" onClick={() => navigate("/auth")}>
            Démarrer gratuitement
          </Button>
        </div>

        <button className="md:hidden p-2 text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href} className="block text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => { navigate("/auth"); setMobileOpen(false); }}>Connexion</Button>
            <Button size="sm" onClick={() => { navigate("/auth"); setMobileOpen(false); }}>Démarrer</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
