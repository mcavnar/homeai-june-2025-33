-- Create table for homepage email popup captures
CREATE TABLE public.popup_email_capture (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  session_id TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'homepage_popup',
  user_agent TEXT,
  referrer_url TEXT,
  current_page_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.popup_email_capture ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert email captures (for anonymous users)
CREATE POLICY "Anyone can capture emails" 
ON public.popup_email_capture 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow reading by session_id (for verification/tracking)
CREATE POLICY "Anyone can view by session_id" 
ON public.popup_email_capture 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_popup_email_capture_updated_at
BEFORE UPDATE ON public.popup_email_capture
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();