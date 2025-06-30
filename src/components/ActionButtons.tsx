
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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <ArrowRight className="h-5 w-5 text-green-500" />
          Next Steps
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Take action with your inspection findings
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Top Row: Share + Primary Action */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={handleShareAccess}
            variant="outline"
            size="lg"
            className="flex items-center gap-2 h-12"
          >
            <Share className="h-4 w-4" />
            Share Report
          </Button>
          <Button 
            onClick={handleGetNegotiationAdvice}
            variant="green-dark"
            size="lg"
            className="flex items-center gap-2 h-12 md:col-span-2"
          >
            <MessageSquare className="h-5 w-5" />
            Get Negotiation Advice
          </Button>
        </div>

        {/* Bottom Row: Equal Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            onClick={handleUnderstandServiceCosts}
            variant="green"
            size="lg"
            className="flex items-center gap-2 h-12"
          >
            <DollarSign className="h-5 w-5" />
            See Service Costs
          </Button>
          <Button 
            onClick={handleUnderstandKeySystems}
            variant="green"
            size="lg"
            className="flex items-center gap-2 h-12"
          >
            <Settings className="h-5 w-5" />
            Understand Key Systems
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionButtons;
