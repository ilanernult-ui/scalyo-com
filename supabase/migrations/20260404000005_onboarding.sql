-- ─── Onboarding progress ──────────────────────────────────────────
-- Add onboarding tracking to profiles table
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS onboarding_step    integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS onboarding_done    boolean NOT NULL DEFAULT false;
