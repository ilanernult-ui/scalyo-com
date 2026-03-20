import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PlanType } from "@/contexts/AuthContext";

const planNames: Record<string, string> = {
  growthpilot: "GrowthPilot",
  loyaltyloop: "LoyaltyLoop",
};

interface LockedTabOverlayProps {
  requiredPlan: PlanType;
  onUpgrade: () => void;
  children: React.ReactNode;
}

const LockedTabOverlay = ({ requiredPlan, onUpgrade, children }: LockedTabOverlayProps) => (
  <div className="relative">
    <div className="blur-[6px] opacity-30 pointer-events-none select-none" aria-hidden>
      {children}
    </div>
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className="bg-background/90 backdrop-blur-xl border border-border rounded-2xl p-10 max-w-md text-center shadow-[var(--shadow-lg)]">
        <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
          <Lock className="h-7 w-7 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground tracking-tight mb-2">
          Disponible avec le plan {planNames[requiredPlan] ?? requiredPlan}
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Passez au plan supérieur pour accéder à ces fonctionnalités avancées.
        </p>
        <Button className="w-full" size="lg" onClick={onUpgrade}>
          Upgrader mon plan
        </Button>
      </div>
    </div>
  </div>
);

export default LockedTabOverlay;
