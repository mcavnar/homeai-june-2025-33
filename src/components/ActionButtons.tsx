
import React from 'react';
import { Share, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const ActionButtons: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleShareAccess = () => {
    const currentUrl = window.location.origin + '/results/synopsis';
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast({
        title: "Link copied!",
        description: "Synopsis page link has been copied to your clipboard.",
      });
    }).catch(() => {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually from your browser.",
        variant: "destructive",
      });
    });
  };

  const handleGetNegotiationAdvice = () => {
    navigate('/results/negotiation');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Button 
        onClick={handleShareAccess}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Share className="h-4 w-4" />
        Share Access
      </Button>
      <Button 
        onClick={handleGetNegotiationAdvice}
        className="flex items-center gap-2"
      >
        <MessageSquare className="h-4 w-4" />
        Get Negotiation Advice
      </Button>
    </div>
  );
};

export default ActionButtons;
