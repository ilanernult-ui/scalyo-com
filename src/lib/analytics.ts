/**
 * PostHog analytics wrapper
 *
 * Usage:
 *   import { analytics } from "@/lib/analytics";
 *   analytics.track("report_generated", { plan: "growthpilot" });
 *
 * Configure VITE_POSTHOG_KEY and VITE_POSTHOG_HOST in .env
 */
import posthog from "posthog-js";

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
const POSTHOG_HOST = (import.meta.env.VITE_POSTHOG_HOST as string | undefined) ?? "https://eu.i.posthog.com";

let initialised = false;

function init() {
  if (initialised || !POSTHOG_KEY) return;
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: "identified_only",
    capture_pageview: false,       // we fire manual pageviews
    capture_pageleave: true,
    autocapture: false,            // full control over events
    session_recording: { maskAllInputs: true },
  });
  initialised = true;
}

// ─── Public API ───────────────────────────────────────────────────

export const analytics = {
  /** Must be called once at app boot (main.tsx or AuthProvider) */
  init,

  /** Identify a logged-in user */
  identify(userId: string, props?: Record<string, unknown>) {
    if (!POSTHOG_KEY) return;
    init();
    posthog.identify(userId, props);
  },

  /** Reset identity on sign-out */
  reset() {
    if (!POSTHOG_KEY) return;
    posthog.reset();
  },

  /** Fire a pageview (call on route change) */
  page(path: string) {
    if (!POSTHOG_KEY) return;
    posthog.capture("$pageview", { $current_url: path });
  },

  /** Generic event tracker */
  track(event: AnalyticsEvent, props?: Record<string, unknown>) {
    if (!POSTHOG_KEY) return;
    posthog.capture(event, props);
  },

  /** Expose raw posthog for feature flags etc. */
  posthog,
};

// ─── Typed events ─────────────────────────────────────────────────

export type AnalyticsEvent =
  // Auth
  | "user_signed_up"
  | "user_signed_in"
  | "user_signed_out"
  // Onboarding
  | "onboarding_started"
  | "onboarding_step_completed"
  | "onboarding_completed"
  // Data
  | "connector_added"
  | "data_uploaded"
  // Analysis
  | "analysis_started"
  | "analysis_completed"
  | "report_generated"
  | "recommendation_viewed"
  | "recommendation_status_changed"
  // Navigation
  | "tab_viewed"
  // Conversion
  | "upgrade_clicked"
  | "checkout_started"
  | "plan_activated"
  | "subscription_cancelled"
  // Engagement
  | "company_profile_updated"
  | "note_added"
  | "objective_added";
