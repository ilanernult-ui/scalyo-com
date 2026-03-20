import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Calendar, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { STRIPE_PLANS } from "@/lib/stripe-plans";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SettingsTab = () => {
  const { plan, planStatus, subscriptionEnd, refreshSubscription } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const planConfig = STRIPE_PLANS[plan];
  const formattedEnd = subscriptionEnd
    ? new Date(subscriptionEnd).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : null;

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const { data, error } = await supabase.functions.invoke("cancel-subscription");
      if (error) throw error;

      const accessUntil = data?.access_until
        ? new Date(data.access_until).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
        : "";

      toast({
        title: "Abonnement résilié",
        description: `Vous conservez l'accès jusqu'au ${accessUntil}.`,
      });

      setCancelOpen(false);
      await refreshSubscription();
    } catch (e) {
      console.error("Cancel error:", e);
      toast({
        title: "Erreur",
        description: "Impossible de résilier. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-semibold text-foreground tracking-tight mb-1">Paramètres</h2>
        <p className="text-sm text-muted-foreground">Gérez votre abonnement et vos préférences.</p>
      </div>

      {/* Subscription card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" />
            Mon abonnement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">{planConfig.name}</p>
              <p className="text-sm text-muted-foreground">{planConfig.monthly}€/mois</p>
            </div>
            <Badge variant={planStatus === "active" ? "default" : planStatus === "cancelled" ? "secondary" : "destructive"}>
              {planStatus === "active" ? "Actif" : planStatus === "cancelled" ? "Résilié" : "Impayé"}
            </Badge>
          </div>

          {formattedEnd && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {planStatus === "cancelled"
                ? `Accès jusqu'au ${formattedEnd}`
                : `Prochain renouvellement : ${formattedEnd}`}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => navigate("/tarifs")}>
              Changer de plan
            </Button>
            {planStatus === "active" && subscriptionEnd && (
              <Button
                variant="ghost"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setCancelOpen(true)}
              >
                Résilier mon abonnement
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cancel confirmation dialog */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-3 w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <DialogTitle className="text-center">Résilier votre abonnement ?</DialogTitle>
            <DialogDescription className="text-center">
              {formattedEnd
                ? `Vous conserverez l'accès à toutes les fonctionnalités jusqu'au ${formattedEnd}.`
                : "Votre accès sera maintenu jusqu'à la fin de votre période de facturation en cours."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setCancelOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Confirmer la résiliation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsTab;
