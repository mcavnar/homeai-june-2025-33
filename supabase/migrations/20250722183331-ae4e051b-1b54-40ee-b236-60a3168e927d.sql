-- Create function for inserting email reminders that avoids type issues
CREATE OR REPLACE FUNCTION public.insert_upload_reminder_email(
  p_email TEXT,
  p_session_id UUID,
  p_user_agent TEXT,
  p_referrer_url TEXT,
  p_current_page_url TEXT
) RETURNS VOID AS $$
BEGIN
  INSERT INTO public.upload_reminder_emails (
    email,
    session_id,
    user_agent,
    referrer_url,
    current_page_url
  ) VALUES (
    p_email,
    p_session_id,
    p_user_agent,
    p_referrer_url,
    p_current_page_url
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;