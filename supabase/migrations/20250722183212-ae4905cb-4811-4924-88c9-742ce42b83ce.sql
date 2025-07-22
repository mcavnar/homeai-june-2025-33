
-- Create upload_reminder_emails table
CREATE TABLE public.upload_reminder_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  session_id UUID NOT NULL,
  user_agent TEXT,
  referrer_url TEXT,
  current_page_url TEXT,
  email_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for email lookups
CREATE INDEX idx_upload_reminder_emails_email ON public.upload_reminder_emails(email);

-- Create index for session_id lookups
CREATE INDEX idx_upload_reminder_emails_session_id ON public.upload_reminder_emails(session_id);

-- Enable RLS
ALTER TABLE public.upload_reminder_emails ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert email reminders
CREATE POLICY "Anyone can create email reminders" 
  ON public.upload_reminder_emails 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow updates based on session_id
CREATE POLICY "Allow updates by session_id" 
  ON public.upload_reminder_emails 
  FOR UPDATE
  USING (true);

-- Create trigger to update the updated_at column
CREATE TRIGGER update_upload_reminder_emails_updated_at
  BEFORE UPDATE ON public.upload_reminder_emails
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
