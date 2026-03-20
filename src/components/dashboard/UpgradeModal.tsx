import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Rocket, Heart } from "lucide-react";
import type { PlanType } from "@/contexts/AuthContext";
import { useState } from "react";

const planDetails: Record<string, { name: string; price: string; icon: typeof Rocket; accent: string; features: string[] }> = {
  growthpilot: {
    name: "GrowthPilot",
    price: "189",
    icon: Rocket,
    accent: "hsl(142, 69%, 49%)",
    features: [
      "Tout DataDiag inclus",
      "Plan d'action IA personnalisé",
      "Analyse ventes et taux de conversion",
      "Détection des opportunités de croissance",
      "Rapport de performance hebdomadaire",
      "Recommandations priorisées par ROI",
      "Jusqu'à 10 utilisateurs",
      "Support prioritaire < 4h",
    ],
  },
  loyaltyloop: {
    name: "LoyaltyLoop",
    price: "349",
    icon: Heart,
    accent: "hsl(262, 60%, 55%)",
    features: [
      "Tout GrowthPilot inclus",
      "Prédiction et analyse du churn client",
      "Stratégies de rétention automatisées",
      "Suivi clients en temps réel 360°",
      "Utilisateurs illimités",
      "Intégrations CRM avancées",
      "Onboarding personnalisé (2h)",
      "Account manager dédié",
    ],
  },
};

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetPlan: PlanType;
}

const UpgradeModal = ({ open, onOpenChange, targetPlan }: UpgradeModalProps) => {
  const [submitted, setSubmitted] = useState(false);
  const details = planDetails[targetPlan];
  if (!details) return null;

  const Icon = details.icon;

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setSubmitted(false); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div
            className="mx-auto mb-3 w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: `${details.accent}15` }}
          >
            <Icon className="h-6 w-6" style={{ color: details.accent }} />
          </div>
          <DialogTitle className="text-center">
            Passer au plan {details.name}
          </DialogTitle>
          <DialogDescription className="text-center">
            {details.price}€/mois · Sans engagement
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 my-2">
          {details.features.map((f) => (
            <div key={f} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success shrink-0" />
              <span className="text-sm text-foreground">{f}</span>
            </div>
          ))}
        </div>

        {submitted ? (
          <div className="rounded-xl bg-secondary/70 p-4 text-center">
            <p className="text-sm font-medium text-foreground">Demande envoyée ✓</p>
            <p className="text-xs text-muted-foreground mt-1">Notre équipe vous contactera sous 24h pour finaliser votre upgrade.</p>
          </div>
        ) : (
          <Button
            className="w-full"
            size="lg"
            onClick={() => setSubmitted(true)}
            style={{ backgroundColor: details.accent }}
          >
            Passer au plan {details.name}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
