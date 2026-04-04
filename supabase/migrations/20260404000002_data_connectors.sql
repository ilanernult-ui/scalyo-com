-- ─────────────────────────────────────────────────────────────────
-- Feature: Connecteurs de données
-- ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.data_connectors (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  connector_id text NOT NULL,          -- e.g. "google_analytics", "stripe"
  status       text NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'connected', 'error', 'disconnected')),
  config       jsonb NOT NULL DEFAULT '{}'::jsonb,  -- non-secret config (account id, etc.)
  last_sync_at timestamptz,
  sync_error   text,
  frequency    text NOT NULL DEFAULT 'daily'
               CHECK (frequency IN ('realtime', 'daily', 'weekly')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, connector_id)
);

ALTER TABLE public.data_connectors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their connectors"
  ON public.data_connectors FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
