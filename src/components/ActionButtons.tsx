
import React from 'react';
import { Share, MessageSquare, DollarSign, Settings, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  const handleUnderstandKeySystems = () => {
    navigate('/results/systems');
  };

  const handleGetNegotiationAdvice = () => {
    navigate('/results/negotiation');
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-900">
          <ArrowRight className="h-6 w-6 text-green-500" />
          Next Steps
        </CardTitle>
        <p className="text-gray-600 mt-2">
          Choose your next action to make the most of your inspection report
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Share Action */}
          <div className="space-y-3">
            <Button 
              onClick={handleShareAccess}
              variant="green"
              size="lg"
              className="w-full flex items-center gap-2 px-6 py-3"
            >
              <Share className="h-5 w-5" />
              Share Report
            </Button>
            <p className="text-sm text-gray-600 text-center">
              Share this inspection summary with your agent, family, or advisors
            </p>
          </div>

          {/* Negotiation Advice Action */}
          <div className="space-y-3">
            <Button 
              onClick={handleGetNegotiationAdvice}
              variant="green-dark"
              size="lg"
              className="w-full flex items-center gap-2 px-6 py-3"
            >
              <MessageSquare className="h-5 w-5" />
              Get Negotiation Advice
            </Button>
            <p className="text-sm text-gray-600 text-center">
              Receive strategic guidance for purchase negotiations
            </p>
          </div>

          {/* Service Costs Action */}
          <div className="space-y-3">
            <Button 
              onClick={handleUnderstandServiceCosts}
              variant="green"
              size="lg"
              className="w-full flex items-center gap-2 px-6 py-3"
            >
              <DollarSign className="h-5 w-5" />
              See Service Costs
            </Button>
            <p className="text-sm text-gray-600 text-center">
              Get detailed cost estimates and find qualified contractors
            </p>
          </div>

          {/* Key Systems Action */}
          <div className="space-y-3">
            <Button 
              onClick={handleUnderstandKeySystems}
              variant="green"
              size="lg"
              className="w-full flex items-center gap-2 px-6 py-3"
            >
              <Settings className="h-5 w-5" />
              Understand Key Systems
            </Button>
            <p className="text-sm text-gray-600 text-center">
              Learn about major home systems and their condition
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionButtons;
