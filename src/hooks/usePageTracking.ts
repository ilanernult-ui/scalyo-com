import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { analytics } from "@/lib/analytics";

/** Fires a PostHog pageview on every route change */
export function usePageTracking() {
  const location = useLocation();
  useEffect(() => {
    analytics.page(location.pathname + location.search);
  }, [location]);
}
