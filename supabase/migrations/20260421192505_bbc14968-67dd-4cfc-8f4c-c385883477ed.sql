-- Kanban actions table for "Plan d'action IA"
CREATE TABLE public.action_plan (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'operations', -- finance | marketing | operations | rh
  difficulty TEXT NOT NULL DEFAULT 'moyen',    -- facile | moyen | difficile
  delay TEXT NOT NULL DEFAULT 'cette_semaine', -- aujourd_hui | cette_semaine | ce_mois
  status TEXT NOT NULL DEFAULT 'todo',         -- todo | in_progress | done
  impact_eur NUMERIC DEFAULT 0,
  impact_hours_weekly NUMERIC DEFAULT 0,
  position INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.action_plan ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own actions"
ON public.action_plan
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_action_plan_updated_at
BEFORE UPDATE ON public.action_plan
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_action_plan_user_status ON public.action_plan(user_id, status);