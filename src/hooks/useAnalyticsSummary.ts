
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsSummary {
  total_sessions: number;
  total_time_seconds: number;
  total_page_visits: number;
  total_interactions: number;
  first_login: string | null;
  last_login: string | null;
  most_visited_page: string | null;
  most_clicked_element: string | null;
}

export const useAnalyticsSummary = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setSummary(null);
      return;
    }

    const fetchSummary = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_analytics_summary')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          throw error;
        }

        setSummary(data || null);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch analytics summary:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [user]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  return {
    summary,
    loading,
    error,
    formatTime,
  };
};
