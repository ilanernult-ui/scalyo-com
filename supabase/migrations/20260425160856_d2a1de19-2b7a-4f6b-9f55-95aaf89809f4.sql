CREATE TABLE IF NOT EXISTS public.data_connectors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  connector_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'disconnected',
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, connector_id)
);

ALTER TABLE public.data_connectors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own connectors"
  ON public.data_connectors
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.set_data_connectors_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_data_connectors_updated_at ON public.data_connectors;
CREATE TRIGGER trg_data_connectors_updated_at
  BEFORE UPDATE ON public.data_connectors
  FOR EACH ROW EXECUTE FUNCTION public.set_data_connectors_updated_at();