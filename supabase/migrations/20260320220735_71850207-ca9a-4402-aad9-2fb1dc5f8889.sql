
CREATE TABLE public.company_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  -- Step 1: General info
  company_name text,
  sector text,
  company_size text,
  employees integer,
  annual_revenue numeric,
  competitors text,
  -- Step 2: Financial data
  current_month_revenue numeric,
  revenue_history jsonb DEFAULT '[]'::jsonb,
  fixed_costs numeric,
  variable_costs numeric,
  cash_available numeric,
  gross_margin numeric,
  net_margin numeric,
  net_income numeric,
  unpaid_invoices integer,
  unpaid_amount numeric,
  avg_client_payment_days integer,
  avg_supplier_payment_days integer,
  -- Step 3: Commercial data
  active_clients integer,
  new_clients_history jsonb DEFAULT '[]'::jsonb,
  conversion_rates jsonb DEFAULT '[]'::jsonb,
  avg_basket numeric,
  monthly_transactions integer,
  main_sales_channel text,
  marketing_budget numeric,
  cac numeric,
  ltv numeric,
  upsell_rate numeric,
  growth_target_6m numeric,
  growth_target_12m numeric,
  -- Step 4: Client data
  total_clients integer,
  active_clients_30d integer,
  inactive_60d integer,
  inactive_90d integer,
  churn_history jsonb DEFAULT '[]'::jsonb,
  avg_relationship_months integer,
  nps_score integer,
  complaints_current integer,
  complaints_previous integer,
  renewal_rate numeric,
  retention_rate numeric,
  client_ltv numeric,
  vip_clients integer,
  vip_revenue numeric,
  main_churn_reason text,
  --
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.company_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own company data" ON public.company_data
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.ai_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  service text NOT NULL CHECK (service IN ('datadiag', 'growthpilot', 'loyaltyloop')),
  results jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own AI results" ON public.ai_results
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
