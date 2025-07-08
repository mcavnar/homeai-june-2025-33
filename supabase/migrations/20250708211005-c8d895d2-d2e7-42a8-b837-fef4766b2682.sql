
-- Drop the existing problematic constraint
ALTER TABLE public.user_reports DROP CONSTRAINT IF EXISTS one_active_report_per_user;

-- Create a partial unique index that only enforces uniqueness when is_active = true
CREATE UNIQUE INDEX IF NOT EXISTS user_reports_active_unique 
ON public.user_reports (user_id) 
WHERE is_active = true;
