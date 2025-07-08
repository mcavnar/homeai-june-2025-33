
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useShareReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateShareLink = async (): Promise<string | null> => {
    try {
      setIsLoading(true);

      // Get the user's shared report token
      const { data: sharedReport, error } = await supabase
        .from('shared_reports')
        .select('report_token')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching shared report:', error);
        toast({
          title: "Error",
          description: "Failed to generate share link. Please try again.",
          variant: "destructive",
        });
        return null;
      }

      if (!sharedReport) {
        toast({
          title: "Error",
          description: "No report found to share.",
          variant: "destructive",
        });
        return null;
      }

      const shareUrl = `${window.location.origin}/shared/${sharedReport.report_token}`;
      
      toast({
        title: "Share link generated",
        description: "Your report is ready to share!",
      });

      return shareUrl;

    } catch (error) {
      console.error('Error generating share link:', error);
      toast({
        title: "Error",
        description: "Failed to generate share link. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateShareLink,
    isLoading,
  };
};
