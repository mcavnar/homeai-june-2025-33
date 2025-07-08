
-- Create table for shared reports
CREATE TABLE public.shared_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.shared_reports ENABLE ROW LEVEL SECURITY;

-- Users can view their own shared reports
CREATE POLICY "Users can view their own shared reports" 
  ON public.shared_reports 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can create their own shared reports
CREATE POLICY "Users can create their own shared reports" 
  ON public.shared_reports 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own shared reports
CREATE POLICY "Users can update their own shared reports" 
  ON public.shared_reports 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own shared reports
CREATE POLICY "Users can delete their own shared reports" 
  ON public.shared_reports 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_shared_reports_updated_at
  BEFORE UPDATE ON public.shared_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
