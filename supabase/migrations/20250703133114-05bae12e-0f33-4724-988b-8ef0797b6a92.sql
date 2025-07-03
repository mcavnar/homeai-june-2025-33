
-- Create user_reports table to store complete report data for dashboard
CREATE TABLE public.user_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Analysis data (complete HomeInspectionAnalysis object)
  analysis_data jsonb NOT NULL,
  
  -- Property and market data
  property_data jsonb,
  property_address text,
  inspection_date date,
  
  -- AI-generated negotiation strategy
  negotiation_strategy jsonb,
  
  -- PDF storage and metadata
  pdf_file_path text,
  pdf_text text,
  pdf_metadata jsonb,
  
  -- Status tracking
  is_active boolean NOT NULL DEFAULT true,
  processing_status text NOT NULL DEFAULT 'completed',
  
  -- Timestamps
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  
  -- Ensure only one active report per user
  CONSTRAINT one_active_report_per_user UNIQUE (user_id, is_active) DEFERRABLE INITIALLY DEFERRED
);

-- Enable RLS on user_reports table
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_reports
CREATE POLICY "Users can view their own reports" 
  ON public.user_reports 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reports" 
  ON public.user_reports 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports" 
  ON public.user_reports 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reports" 
  ON public.user_reports 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add updated_at trigger to user_reports table
CREATE TRIGGER update_user_reports_updated_at
  BEFORE UPDATE ON public.user_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
