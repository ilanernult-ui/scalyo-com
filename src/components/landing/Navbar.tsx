import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User, LayoutDashboard } from "lucide-react";
import scalyoLogo from "@/assets/scalyo-logo.png";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Mon compte";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-xl border-b border-foreground/[0.08]" style={{ height: 44 }}>
      <div className="container mx-auto flex items-center justify-between h-full px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={scalyoLogo} alt="Scalyo" className="h-8 w-8 object-contain" />
          <span className="text-base font-semibold text-foreground tracking-tight">Scalyo</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href} className="text-xs font-medium text-muted-foreground hover:text-foreground apple-easing">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-xs gap-2">
                  <User className="h-3.5 w-3.5" />
                  <span className="max-w-[120px] truncate">{displayName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate("/dashboard")} className="gap-2 text-xs cursor-pointer">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Tableau de bord
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="gap-2 text-xs cursor-pointer text-destructive">
                  <LogOut className="h-3.5 w-3.5" />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="text-muted-foreground text-xs" onClick={() => navigate("/auth")}>Connexion</Button>
              <Button size="sm" className="text-xs" onClick={() => navigate("/auth")}>
                Démarrer gratuitement
              </Button>
            </>
          )}
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
            {user ? (
              <Button variant="ghost" size="sm" className="gap-2 text-destructive" onClick={() => { handleSignOut(); setMobileOpen(false); }}>
                <LogOut className="h-4 w-4" />
                Se déconnecter
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => { navigate("/auth"); setMobileOpen(false); }}>Connexion</Button>
                <Button size="sm" onClick={() => { navigate("/auth"); setMobileOpen(false); }}>Démarrer</Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
