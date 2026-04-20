-- Fonction utilitaire pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 1) Problèmes détectés par l'IA
CREATE TABLE public.detected_problems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  criticality TEXT NOT NULL DEFAULT 'important',
  category TEXT,
  monthly_loss_eur NUMERIC DEFAULT 0,
  weekly_hours_lost NUMERIC DEFAULT 0,
  probable_cause TEXT,
  trend TEXT DEFAULT 'stable',
  trend_delta_pct NUMERIC DEFAULT 0,
  resolved BOOLEAN NOT NULL DEFAULT false,
  rank INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.detected_problems ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own detected problems"
ON public.detected_problems FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_detected_problems_user ON public.detected_problems(user_id, rank);
CREATE TRIGGER update_detected_problems_updated_at
BEFORE UPDATE ON public.detected_problems
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2) Historique mensuel des pertes
CREATE TABLE public.loss_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  period_month DATE NOT NULL,
  category TEXT NOT NULL,
  amount_eur NUMERIC NOT NULL DEFAULT 0,
  explanation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, period_month, category)
);
ALTER TABLE public.loss_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own loss history"
ON public.loss_history FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_loss_history_user_period ON public.loss_history(user_id, period_month);

-- 3) Économies réalisées
CREATE TABLE public.savings_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount_eur NUMERIC NOT NULL DEFAULT 0,
  source TEXT NOT NULL,
  source_ref UUID,
  description TEXT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.savings_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own savings"
ON public.savings_log FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_savings_user_date ON public.savings_log(user_id, occurred_at DESC);

-- 4) Notifications header (cloche)
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own notifications"
ON public.notifications FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, read, created_at DESC);