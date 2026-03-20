import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, plan, planStatus, subscriptionEnd, stripeSubscriptionId } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not logged in → redirect to auth
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check if subscription is expired
  const isExpired = planStatus === "cancelled" && subscriptionEnd && new Date(subscriptionEnd) < new Date();
  const hasActiveSubscription = !!stripeSubscriptionId && !isExpired;

  // No active subscription → redirect to tarifs
  if (!hasActiveSubscription) {
    const message = isExpired
      ? "Votre abonnement a expiré. Choisissez un plan pour continuer."
      : "Choisissez un plan pour accéder à votre dashboard.";
    return <Navigate to="/tarifs" state={{ subscriptionMessage: message }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
