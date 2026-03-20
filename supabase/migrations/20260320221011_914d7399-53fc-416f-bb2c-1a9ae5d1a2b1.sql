
ALTER TABLE public.company_data ADD CONSTRAINT company_data_user_id_key UNIQUE (user_id);
ALTER TABLE public.ai_results ADD CONSTRAINT ai_results_user_service_key UNIQUE (user_id, service);
