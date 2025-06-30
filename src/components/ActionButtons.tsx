
import React from 'react';
import { Share, MessageSquare, DollarSign } from 'lucide-react';
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

  const handleUnderstandServiceCosts = () => {
    navigate('/results/providers');
  };

  const handleGetNegotiationAdvice = () => {
    navigate('/results/negotiation');
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <Button 
        onClick={handleShareAccess}
        size="lg"
        className="flex items-center gap-2 px-6 py-3 font-semibold bg-green-400 hover:bg-green-500 text-white border-2 border-green-500 hover:border-green-600 shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Share className="h-5 w-5" />
        Share
      </Button>
      <Button 
        onClick={handleUnderstandServiceCosts}
        size="lg"
        className="flex items-center gap-2 px-6 py-3 font-semibold bg-green-400 hover:bg-green-500 text-white border-2 border-green-500 hover:border-green-600 shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <DollarSign className="h-5 w-5" />
        See Service Costs
      </Button>
      <Button 
        onClick={handleGetNegotiationAdvice}
        size="lg"
        className="flex items-center gap-2 px-6 py-3 font-semibold bg-green-500 hover:bg-green-600 text-white border-2 border-green-600 hover:border-green-700 shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <MessageSquare className="h-5 w-5" />
        Get Negotiation Advice
      </Button>
    </div>
  );
};

export default ActionButtons;
