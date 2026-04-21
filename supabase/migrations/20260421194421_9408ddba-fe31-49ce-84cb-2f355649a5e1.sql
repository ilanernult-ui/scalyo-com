CREATE TABLE IF NOT EXISTS public.report_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  report_type TEXT NOT NULL DEFAULT 'monthly',
  title TEXT NOT NULL,
  period_label TEXT,
  score INTEGER DEFAULT 0,
  summary TEXT,
  metrics JSONB DEFAULT '{}'::jsonb,
  file_name TEXT,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.report_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own report history"
ON public.report_history
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_report_history_user_generated ON public.report_history(user_id, generated_at DESC);