
-- Add unique constraint to shared_reports table to support ON CONFLICT operations
ALTER TABLE public.shared_reports ADD CONSTRAINT shared_reports_user_id_unique UNIQUE (user_id);
