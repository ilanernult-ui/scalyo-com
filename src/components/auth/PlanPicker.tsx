import { Check, Activity, Rocket, Heart } from "lucide-react";
import type { PlanType } from "@/contexts/AuthContext";

const plans = [
  {
    id: "datadiag" as PlanType,
    name: "DataDiag",
    price: "79",
    tagline: "Diagnostic business complet en 48h",
    icon: Activity,
    accent: "hsl(211, 100%, 45%)",
    features: ["Score Business 360°", "Détection des pertes d'argent & temps", "Top 5 actions à fort impact", "Dashboard KPIs + rapport IA mensuel"],
  },
  {
    id: "growthpilot" as PlanType,
    name: "GrowthPilot",
    price: "189",
    tagline: "Co-pilote IA · +15% croissance · +10h/sem",
    icon: Rocket,
    accent: "hsl(142, 69%, 49%)",
    popular: true,
    features: ["Tout DataDiag inclus", "Plan d'action priorisé par ROI", "Quick wins chiffrés en €", "Automatisations (+10h/sem)"],
  },
  {
    id: "loyaltyloop" as PlanType,
    name: "LoyaltyLoop",
    price: "349",
    tagline: "Transformation complète · +25% croissance",
    icon: Heart,
    accent: "hsl(262, 60%, 55%)",
    features: ["Tout GrowthPilot inclus", "Radar Churn & rétention", "Analyse 360° clients & croissance", "Recommandations hebdomadaires"],
  },
];

interface PlanPickerProps {
  selected: PlanType;
  onSelect: (plan: PlanType) => void;
}

const PlanPicker = ({ selected, onSelect }: PlanPickerProps) => (
  <div className="space-y-3">
    <p className="text-sm font-medium text-foreground">Choisissez votre plan</p>
    <div className="grid gap-3">
      {plans.map((plan) => {
        const isSelected = selected === plan.id;
        return (
          <button
            key={plan.id}
            type="button"
            onClick={() => onSelect(plan.id)}
            className={`relative text-left rounded-xl border-2 p-4 transition-all duration-200 ${
              isSelected
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border hover:border-muted-foreground/30 bg-card"
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-2.5 right-3 bg-primary text-primary-foreground text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                Populaire
              </span>
            )}
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: `${plan.accent}15` }}
              >
                <plan.icon className="h-4 w-4" style={{ color: plan.accent }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{plan.name}</p>
                  <p className="text-sm font-bold text-foreground">{plan.price}€<span className="text-xs font-normal text-muted-foreground">/mois</span></p>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{plan.tagline}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                  {plan.features.map((f) => (
                    <span key={f} className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Check className="h-3 w-3 text-success shrink-0" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
    <p className="text-[11px] text-muted-foreground text-center pt-1">
      Fiche entreprise · Connexion données · Assistant IA · Export PDF — inclus sur tous les plans
    </p>
  </div>
);

export default PlanPicker;
