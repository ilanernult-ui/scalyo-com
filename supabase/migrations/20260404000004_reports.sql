-- ─── Reports table ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type         text        NOT NULL CHECK (type IN ('weekly','monthly','diagnostic')),
  title        text        NOT NULL,
  period_label text,       -- e.g., "Semaine du 31 mars 2026" or "Mars 2026"
  status       text        NOT NULL DEFAULT 'generating'
                           CHECK (status IN ('generating','ready','error')),
  summary      text,       -- short text extract / AI narrative
  file_url     text,       -- future: storage URL for actual PDF
  email_sent   boolean     NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS reports_user_id_idx  ON reports(user_id);
CREATE INDEX IF NOT EXISTS reports_created_idx  ON reports(user_id, created_at DESC);

-- RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own reports"
  ON reports FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION update_reports_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_reports_updated_at();
