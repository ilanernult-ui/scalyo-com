-- ─────────────────────────────────────────────────────────────────
-- Feature: Fiche Entreprise Centralisée
-- Extends profiles + creates company_contacts, business_objectives,
-- company_notes tables with RLS.
-- ─────────────────────────────────────────────────────────────────

-- 1. Extend profiles with full company identity fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS logo_url    text,
  ADD COLUMN IF NOT EXISTS website     text,
  ADD COLUMN IF NOT EXISTS siret       text,
  ADD COLUMN IF NOT EXISTS address     text,
  ADD COLUMN IF NOT EXISTS phone       text,
  ADD COLUMN IF NOT EXISTS sector      text,
  ADD COLUMN IF NOT EXISTS company_size text; -- TPE | PME | ETI

-- 2. Key contacts per company
CREATE TABLE IF NOT EXISTS public.company_contacts (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name       text NOT NULL,
  role       text,
  email      text,
  phone      text,
  is_main    boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.company_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their contacts"
  ON public.company_contacts FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 3. Business objectives & KPI targets
CREATE TABLE IF NOT EXISTS public.business_objectives (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title      text NOT NULL,
  kpi_target text,
  deadline   date,
  status     text NOT NULL DEFAULT 'active'
             CHECK (status IN ('active', 'achieved', 'paused')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.business_objectives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their objectives"
  ON public.business_objectives FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. Internal notes
CREATE TABLE IF NOT EXISTS public.company_notes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content    text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.company_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their notes"
  ON public.company_notes FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
