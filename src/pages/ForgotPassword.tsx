import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link to="/auth" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground apple-easing mb-8">
          <ArrowLeft className="h-4 w-4" /> Retour à la connexion
        </Link>

        <div className="flex items-center gap-2 mb-8">
          <img src={scalyoLogo} alt="Scalyo" className="h-8 w-8 object-contain" />
          <span className="text-base font-semibold tracking-tight text-foreground">Scalyo</span>
        </div>

        {sent ? (
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Email envoyé</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Si un compte existe avec cette adresse, vous recevrez un lien de réinitialisation.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Mot de passe oublié</h2>
            <p className="mt-1 text-sm text-muted-foreground">Entrez votre email pour recevoir un lien de réinitialisation.</p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="vous@entreprise.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Envoyer le lien
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
