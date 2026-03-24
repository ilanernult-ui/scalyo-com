import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader2, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import scalyoLogo from "@/assets/scalyo-logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";

type AuthMode = "login" | "signup" | "forgot";

const loginSchema = z.object({
  email: z.string().trim().email("Adresse email invalide").max(255),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères").max(128),
});

const signupSchema = z.object({
  firstName: z.string().trim().min(1, "Le prénom est requis").max(50),
  lastName: z.string().trim().min(1, "Le nom est requis").max(50),
  email: z.string().trim().email("Adresse email invalide").max(255),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères").max(128),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

const forgotSchema = z.object({
  email: z.string().trim().email("Adresse email invalide").max(255),
});

function getPasswordStrength(pw: string): { label: string; color: string; width: string } {
  if (!pw) return { label: "", color: "", width: "0%" };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 2) return { label: "Faible", color: "bg-destructive", width: "33%" };
  if (score <= 3) return { label: "Moyen", color: "bg-yellow-500", width: "66%" };
  return { label: "Fort", color: "bg-green-500", width: "100%" };
}

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [forgotSent, setForgotSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, stripeSubscriptionId, planStatus, subscriptionEnd } = useAuth();

  useEffect(() => {
    if (!user) return;
    const isExpired = planStatus === "cancelled" && subscriptionEnd && new Date(subscriptionEnd) < new Date();
    const hasActive = !!stripeSubscriptionId && !isExpired;
    navigate(hasActive ? "/dashboard" : "/tarifs", { replace: true });
  }, [user, stripeSubscriptionId, planStatus, subscriptionEnd, navigate]);

  const switchMode = (m: AuthMode) => {
    setMode(m);
    setErrors({});
    setForgotSent(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      if (mode === "login") {
        const parsed = loginSchema.parse({ email, password });
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.email,
          password: parsed.password,
        });
        if (error) throw error;
        // redirect handled by useEffect
      } else if (mode === "signup") {
        const parsed = signupSchema.parse({ firstName, lastName, email, password, confirmPassword });
        const { error } = await supabase.auth.signUp({
          email: parsed.email,
          password: parsed.password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              full_name: `${parsed.firstName} ${parsed.lastName}`,
            },
          },
        });
        if (error) throw error;
        navigate("/tarifs", {
          state: { subscriptionMessage: "Compte créé ! Choisissez votre plan pour commencer." },
        });
      } else {
        const parsed = forgotSchema.parse({ email });
        const { error } = await supabase.auth.resetPasswordForEmail(parsed.email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setForgotSent(true);
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((e) => {
          if (e.path[0]) fieldErrors[e.path[0] as string] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        toast({
          title: "Erreur",
          description: error.message || "Une erreur est survenue",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(password);

  const titles: Record<AuthMode, string> = {
    login: "Connexion",
    signup: "Créer un compte",
    forgot: "Mot de passe oublié",
  };
  const subtitles: Record<AuthMode, string> = {
    login: "Accédez à votre tableau de bord.",
    signup: "Inscrivez-vous pour commencer.",
    forgot: "Entrez votre email pour recevoir un lien de réinitialisation.",
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 surface flex-col justify-between p-12">
        <Link to="/" className="flex items-center gap-2 text-foreground">
          <img src={scalyoLogo} alt="Scalyo" className="h-8 w-8 object-contain" />
          <span className="text-base font-semibold tracking-tight">Scalyo</span>
        </Link>

        <div className="max-w-md">
          <h1 className="text-4xl font-bold tracking-tight text-foreground leading-[1.05]">
            Optimisez votre entreprise avec l'intelligence artificielle.
          </h1>
          <p className="mt-4 text-muted-foreground text-[17px] leading-relaxed">
            Connectez vos données, identifiez vos freins de croissance et recevez des recommandations personnalisées.
          </p>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} OptimAI. Données chiffrées et sécurisées.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 lg:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>

          {/* Logo mobile */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="bg-primary rounded-lg p-1.5">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-base font-semibold tracking-tight text-foreground">OptimAI</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {titles[mode]}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{subtitles[mode]}</p>
          </div>

          {/* FORGOT PASSWORD – sent confirmation */}
          {mode === "forgot" && forgotSent ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-foreground">
                Un email a été envoyé à <span className="font-medium">{email}</span>.
              </p>
              <p className="text-xs text-muted-foreground">
                Vérifiez votre boîte de réception et suivez le lien pour réinitialiser votre mot de passe.
              </p>
              <button onClick={() => switchMode("login")} className="text-sm text-primary hover:underline font-medium">
                Retour à la connexion
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* SIGNUP – name fields */}
              {mode === "signup" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      placeholder="Marie"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={errors.firstName ? "border-destructive" : ""}
                    />
                    {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      placeholder="Dupont"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={errors.lastName ? "border-destructive" : ""}
                    />
                    {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="vous@entreprise.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              {/* Password (login + signup) */}
              {mode !== "forgot" && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mot de passe</Label>
                    {mode === "login" && (
                      <button type="button" onClick={() => switchMode("forgot")} className="text-xs text-primary hover:underline">
                        Mot de passe oublié ?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`pr-10 ${errors.password ? "border-destructive" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? "Masquer" : "Afficher"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}

                  {/* Password strength (signup only) */}
                  {mode === "signup" && password && (
                    <div className="space-y-1">
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div className={`h-full ${strength.color} transition-all duration-300 rounded-full`} style={{ width: strength.width }} />
                      </div>
                      <p className="text-xs text-muted-foreground">Force : {strength.label}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Confirm password (signup) */}
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={errors.confirmPassword ? "border-destructive" : ""}
                  />
                  {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {mode === "login" && "Se connecter"}
                {mode === "signup" && "Créer mon compte"}
                {mode === "forgot" && "Envoyer le lien"}
              </Button>

              {/* Footer links */}
              <div className="text-center space-y-2 pt-2">
                {mode === "login" && (
                  <p className="text-sm text-muted-foreground">
                    Pas encore de compte ?{" "}
                    <button type="button" onClick={() => switchMode("signup")} className="text-primary hover:underline font-medium">
                      S'inscrire
                    </button>
                  </p>
                )}
                {mode === "signup" && (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Déjà un compte ?{" "}
                      <button type="button" onClick={() => switchMode("login")} className="text-primary hover:underline font-medium">
                        Se connecter
                      </button>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      En créant un compte, vous acceptez nos{" "}
                      <a href="#" className="underline">CGU</a> et notre{" "}
                      <a href="#" className="underline">politique de confidentialité</a>.
                    </p>
                  </>
                )}
                {mode === "forgot" && (
                  <p className="text-sm text-muted-foreground">
                    <button type="button" onClick={() => switchMode("login")} className="text-primary hover:underline font-medium">
                      Retour à la connexion
                    </button>
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
