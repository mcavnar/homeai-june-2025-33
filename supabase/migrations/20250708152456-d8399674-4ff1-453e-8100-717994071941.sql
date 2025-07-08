
-- Add opt-in timestamp columns to the profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS recommended_providers_opted_in_at timestamp with time zone;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hvac_technicians_opted_in_at timestamp with time zone;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS roofing_experts_opted_in_at timestamp with time zone;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plumbers_opted_in_at timestamp with time zone;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS electricians_opted_in_at timestamp with time zone;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS concierge_negotiation_opted_in_at timestamp with time zone;
