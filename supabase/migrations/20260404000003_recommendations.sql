-- ─── Recommendations table ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS recommendations (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title        text        NOT NULL,
  description  text,
  priority     text        NOT NULL CHECK (priority IN ('P0','P1','P2','P3')),
  status       text        NOT NULL DEFAULT 'pending'
                           CHECK (status IN ('pending','in_progress','done')),
  impact_label text,
  impact_type  text        CHECK (impact_type IN ('revenue','savings','time','other')),
  source       text        NOT NULL DEFAULT 'ai' CHECK (source IN ('ai','manual')),
  week_of      date,
  completed_at timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS recommendations_user_id_idx    ON recommendations(user_id);
CREATE INDEX IF NOT EXISTS recommendations_week_of_idx    ON recommendations(user_id, week_of DESC);
CREATE INDEX IF NOT EXISTS recommendations_priority_idx   ON recommendations(user_id, priority);

-- RLS
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own recommendations"
  ON recommendations FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION update_recommendations_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER recommendations_updated_at
  BEFORE UPDATE ON recommendations
  FOR EACH ROW EXECUTE FUNCTION update_recommendations_updated_at();
