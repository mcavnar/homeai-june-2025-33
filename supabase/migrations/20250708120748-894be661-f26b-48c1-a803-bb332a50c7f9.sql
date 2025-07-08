
-- Create enum for interaction types
CREATE TYPE public.interaction_type AS ENUM (
  'button_click', 
  'link_click', 
  'form_submit', 
  'download', 
  'navigation'
);

-- Create user_sessions table to track login sessions and total time
CREATE TABLE public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_end TIMESTAMP WITH TIME ZONE,
  total_duration_seconds INTEGER,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_page_visits table to track page visits and time spent
CREATE TABLE public.user_page_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.user_sessions(id) ON DELETE CASCADE,
  page_path TEXT NOT NULL,
  page_title TEXT,
  visit_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  visit_end TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_interactions table to track button clicks and interactions
CREATE TABLE public.user_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.user_sessions(id) ON DELETE CASCADE,
  page_visit_id UUID REFERENCES public.user_page_visits(id) ON DELETE CASCADE,
  interaction_type interaction_type NOT NULL,
  element_id TEXT,
  element_text TEXT,
  element_class TEXT,
  page_path TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_analytics_summary table for aggregated metrics
CREATE TABLE public.user_analytics_summary (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_sessions INTEGER NOT NULL DEFAULT 0,
  total_time_seconds INTEGER NOT NULL DEFAULT 0,
  total_page_visits INTEGER NOT NULL DEFAULT 0,
  total_interactions INTEGER NOT NULL DEFAULT 0,
  first_login TIMESTAMP WITH TIME ZONE,
  last_login TIMESTAMP WITH TIME ZONE,
  most_visited_page TEXT,
  most_clicked_element TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better query performance
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_start ON public.user_sessions(session_start);
CREATE INDEX idx_user_page_visits_user_id ON public.user_page_visits(user_id);
CREATE INDEX idx_user_page_visits_session_id ON public.user_page_visits(session_id);
CREATE INDEX idx_user_page_visits_page_path ON public.user_page_visits(page_path);
CREATE INDEX idx_user_interactions_user_id ON public.user_interactions(user_id);
CREATE INDEX idx_user_interactions_session_id ON public.user_interactions(session_id);
CREATE INDEX idx_user_interactions_type ON public.user_interactions(interaction_type);

-- Enable RLS on all analytics tables
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_page_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics_summary ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_sessions
CREATE POLICY "Users can view their own sessions" ON public.user_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own sessions" ON public.user_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sessions" ON public.user_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for user_page_visits
CREATE POLICY "Users can view their own page visits" ON public.user_page_visits
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own page visits" ON public.user_page_visits
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own page visits" ON public.user_page_visits
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for user_interactions
CREATE POLICY "Users can view their own interactions" ON public.user_interactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own interactions" ON public.user_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for user_analytics_summary
CREATE POLICY "Users can view their own analytics summary" ON public.user_analytics_summary
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own analytics summary" ON public.user_analytics_summary
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own analytics summary" ON public.user_analytics_summary
  FOR UPDATE USING (auth.uid() = user_id);

-- Add triggers to update updated_at timestamp
CREATE TRIGGER update_user_sessions_updated_at
  BEFORE UPDATE ON public.user_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_analytics_summary_updated_at
  BEFORE UPDATE ON public.user_analytics_summary
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update analytics summary
CREATE OR REPLACE FUNCTION public.update_user_analytics_summary()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert or update the analytics summary
  INSERT INTO public.user_analytics_summary (user_id, total_sessions, total_time_seconds, total_page_visits, total_interactions, first_login, last_login)
  VALUES (
    NEW.user_id,
    1,
    COALESCE(NEW.total_duration_seconds, 0),
    0,
    0,
    NEW.session_start,
    COALESCE(NEW.session_end, NEW.session_start)
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_sessions = user_analytics_summary.total_sessions + 1,
    total_time_seconds = user_analytics_summary.total_time_seconds + COALESCE(NEW.total_duration_seconds, 0),
    last_login = COALESCE(NEW.session_end, NEW.session_start),
    updated_at = now();
  
  RETURN NEW;
END;
$$;

-- Trigger to update analytics summary when session ends
CREATE TRIGGER update_analytics_on_session_update
  AFTER UPDATE ON public.user_sessions
  FOR EACH ROW
  WHEN (OLD.session_end IS NULL AND NEW.session_end IS NOT NULL)
  EXECUTE FUNCTION public.update_user_analytics_summary();
