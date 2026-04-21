-- Smart alerts table
CREATE TABLE public.smart_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  severity TEXT NOT NULL DEFAULT 'orange', -- red, orange, green
  category TEXT NOT NULL DEFAULT 'general', -- finance, marketing, operations, clients, general
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  impact_estimate TEXT,
  recommended_action TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- active, dismissed, resolved
  triggered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.smart_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own alerts"
ON public.smart_alerts FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_smart_alerts_user_triggered ON public.smart_alerts(user_id, triggered_at DESC);

CREATE TRIGGER update_smart_alerts_updated_at
BEFORE UPDATE ON public.smart_alerts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- User alert preferences
CREATE TABLE public.alert_preferences (
  user_id UUID NOT NULL PRIMARY KEY,
  email_alerts_enabled BOOLEAN NOT NULL DEFAULT true,
  email_severity_min TEXT NOT NULL DEFAULT 'orange', -- red, orange, green
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.alert_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own alert preferences"
ON public.alert_preferences FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_alert_preferences_updated_at
BEFORE UPDATE ON public.alert_preferences
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();