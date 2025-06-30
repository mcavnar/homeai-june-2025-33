
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
    <Card className="w-full border-2 border-green-100 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-900">
          <ArrowRight className="h-6 w-6 text-green-500" />
          Your Next Steps
        </CardTitle>
        <p className="text-gray-700 mt-2 text-lg">
          Follow this recommended path to maximize the value of your inspection report
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Step 1: Understanding Foundation */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
            Start Here: Build Your Foundation Knowledge
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Button 
                onClick={handleUnderstandKeySystems}
                variant="green-dark"
                size="lg"
                className="w-full flex items-center gap-2 px-6 py-3 font-semibold"
              >
                <Settings className="h-5 w-5" />
                Learn About Key Systems
              </Button>
              <p className="text-sm text-gray-600 text-center leading-relaxed">
                <strong>Start here:</strong> Understand what major systems (HVAC, electrical, plumbing) mean for your home's condition and safety
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleUnderstandServiceCosts}
                variant="green"
                size="lg"
                className="w-full flex items-center gap-2 px-6 py-3 font-semibold"
              >
                <DollarSign className="h-5 w-5" />
                Understand Property Service Costs
              </Button>
              <p className="text-sm text-gray-600 text-center leading-relaxed">
                <strong>Then:</strong> Explore monthly service provider costs and connect with qualified contractors for ongoing maintenance
              </p>
            </div>
          </div>
        </div>

        {/* Step 2: Action & Sharing */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
            Take Action: Negotiate & Share
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Button 
                onClick={handleGetNegotiationAdvice}
                variant="green-dark"
                size="lg"
                className="w-full flex items-center gap-2 px-6 py-3 font-semibold"
              >
                <MessageSquare className="h-5 w-5" />
                Get Negotiation Strategy
              </Button>
              <p className="text-sm text-gray-600 text-center leading-relaxed">
                <strong>Armed with knowledge:</strong> Receive strategic guidance on how to use your inspection findings in purchase negotiations
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleShareAccess}
                variant="green"
                size="lg"
                className="w-full flex items-center gap-2 px-6 py-3 font-semibold"
              >
                <Share className="h-5 w-5" />
                Share Your Report
              </Button>
              <p className="text-sm text-gray-600 text-center leading-relaxed">
                <strong>Keep everyone informed:</strong> Share this comprehensive analysis with your agent, family, or trusted advisors
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionButtons;
