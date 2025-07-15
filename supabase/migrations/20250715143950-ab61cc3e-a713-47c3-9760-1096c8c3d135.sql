
-- Create anonymous_reports table for storing temporary anonymous uploads
CREATE TABLE public.anonymous_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL UNIQUE,
  analysis_data JSONB NOT NULL,
  property_data JSONB,
  negotiation_strategy JSONB,
  pdf_file_path TEXT,
  pdf_text TEXT,
  pdf_metadata JSONB,
  property_address TEXT,
  inspection_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  converted_to_user_id UUID,
  converted_at TIMESTAMP WITH TIME ZONE
);

-- Create index for session_id lookups
CREATE INDEX idx_anonymous_reports_session_id ON public.anonymous_reports(session_id);

-- Create index for cleanup by expiration
CREATE INDEX idx_anonymous_reports_expires_at ON public.anonymous_reports(expires_at) WHERE converted_to_user_id IS NULL;

-- Enable RLS (but allow public access for anonymous users)
ALTER TABLE public.anonymous_reports ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to insert anonymous reports
CREATE POLICY "Anyone can create anonymous reports" 
  ON public.anonymous_reports 
  FOR INSERT 
  WITH CHECK (true);

-- Policy to allow anyone to select by session_id
CREATE POLICY "Anyone can view reports by session_id" 
  ON public.anonymous_reports 
  FOR SELECT 
  USING (true);

-- Policy to allow anyone to update by session_id
CREATE POLICY "Anyone can update reports by session_id" 
  ON public.anonymous_reports 
  FOR UPDATE 
  USING (true);

-- Policy to allow authenticated users to update reports they converted
CREATE POLICY "Users can update their converted reports" 
  ON public.anonymous_reports 
  FOR UPDATE 
  USING (auth.uid() = converted_to_user_id);

-- Create function to clean up expired anonymous reports
CREATE OR REPLACE FUNCTION public.cleanup_expired_anonymous_reports()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.anonymous_reports 
  WHERE expires_at < now() 
    AND converted_to_user_id IS NULL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;
