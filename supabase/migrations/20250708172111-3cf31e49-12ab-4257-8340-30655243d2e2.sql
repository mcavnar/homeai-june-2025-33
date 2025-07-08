
-- Create a trigger function to automatically create shared reports
CREATE OR REPLACE FUNCTION create_shared_report_on_user_report()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a shared report entry for the new user report
  INSERT INTO public.shared_reports (user_id, is_active)
  VALUES (NEW.user_id, true)
  ON CONFLICT (user_id) DO UPDATE SET
    is_active = true,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create shared reports
CREATE TRIGGER auto_create_shared_report
  AFTER INSERT ON public.user_reports
  FOR EACH ROW
  EXECUTE FUNCTION create_shared_report_on_user_report();
