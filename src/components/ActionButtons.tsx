
import React from 'react';
import { Share, MessageSquare, DollarSign, Settings, ArrowRight, FileText } from 'lucide-react';
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

  const handleUnderstandKeySystems = () => {
    navigate('/results/systems');
  };

  const handleGetNegotiationAdvice = () => {
    navigate('/results/negotiation');
  };

  const handleSeeCompleteIssuesList = () => {
    navigate('/results/issues');
  };

  return (
    <div className="w-full py-8">
      {/* Header */}
      <div className="text-center pb-4">
        <h2 className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-900">
          <ArrowRight className="h-6 w-6 text-green-500" />
          Your Next Steps
        </h2>
        <p className="text-gray-700 mt-2 text-lg">
          Follow this recommended path to maximize the value of your inspection report
        </p>
      </div>
      
      <div className="space-y-8">
        {/* Step 1: Understanding Property Condition */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
            Start Here: Understand Your Property Condition In Detail
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
                onClick={handleSeeCompleteIssuesList}
                variant="green"
                size="lg"
                className="w-full flex items-center gap-2 px-6 py-3 font-semibold"
              >
                <FileText className="h-5 w-5" />
                See The Complete Issues List
              </Button>
              <p className="text-sm text-gray-600 text-center leading-relaxed">
                <strong>Then:</strong> Review every identified issue with detailed locations, priorities, and estimated repair costs
              </p>
            </div>
          </div>
        </div>

        {/* Step 2: Service Providers & Negotiation */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
            Take Action: Identify Service Providers and Negotiate
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Button 
                onClick={handleUnderstandServiceCosts}
                variant="green-dark"
                size="lg"
                className="w-full flex items-center gap-2 px-6 py-3 font-semibold"
              >
                <DollarSign className="h-5 w-5" />
                Understand Property Service Costs
              </Button>
              <p className="text-sm text-gray-600 text-center leading-relaxed">
                <strong>Armed with knowledge:</strong> Explore monthly service provider costs and connect with qualified contractors for ongoing maintenance
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleGetNegotiationAdvice}
                variant="green"
                size="lg"
                className="w-full flex items-center gap-2 px-6 py-3 font-semibold"
              >
                <MessageSquare className="h-5 w-5" />
                Get Negotiation Strategy
              </Button>
              <p className="text-sm text-gray-600 text-center leading-relaxed">
                <strong>Take action:</strong> Receive strategic guidance on how to use your inspection findings in purchase negotiations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons;
