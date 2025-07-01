
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
      <div className="text-center pb-6">
        <h2 className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-900">
          <ArrowRight className="h-6 w-6 text-green-500" />
          Next Steps
        </h2>
        <p className="text-gray-700 mt-2 text-lg">
          Follow this recommended path to maximize the value of your inspection report
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Step 1: Start Here */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold flex-shrink-0 mt-1">1</span>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Here</h3>
              <Button 
                onClick={handleUnderstandKeySystems}
                variant="green-dark"
                size="default"
                className="w-full flex items-center gap-2 px-4 py-2 font-semibold mb-3"
              >
                <Settings className="h-5 w-5" />
                Learn About Key Systems
              </Button>
              <p className="text-sm text-gray-600 leading-relaxed">
                Begin by understanding what major systems (HVAC, electrical, plumbing) mean for your home's condition and safety
              </p>
            </div>
          </div>
        </div>

        {/* Step 2: Understand More */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold flex-shrink-0 mt-1">2</span>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Understand More: Understand Your Property Condition In Detail</h3>
              <Button 
                onClick={handleSeeCompleteIssuesList}
                variant="green-dark"
                size="default"
                className="w-full flex items-center gap-2 px-4 py-2 font-semibold mb-3"
              >
                <FileText className="h-5 w-5" />
                Understand Complete Issues List
              </Button>
              <p className="text-sm text-gray-600 leading-relaxed">
                Review every identified issue with detailed locations, priorities, and estimated repair costs
              </p>
            </div>
          </div>
        </div>

        {/* Step 3: Take Action */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold flex-shrink-0 mt-1">3</span>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Take Action: Identify Service Providers</h3>
              <Button 
                onClick={handleUnderstandServiceCosts}
                variant="green-dark"
                size="default"
                className="w-full flex items-center gap-2 px-4 py-2 font-semibold mb-3"
              >
                <DollarSign className="h-5 w-5" />
                See Property Service Costs
              </Button>
              <p className="text-sm text-gray-600 leading-relaxed">
                Explore monthly service provider costs and connect with qualified contractors for ongoing maintenance
              </p>
            </div>
          </div>
        </div>

        {/* Step 4: Go Further */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold flex-shrink-0 mt-1">4</span>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Go Further: Use Your Finding In Purchase Negotiations</h3>
              <Button 
                onClick={handleGetNegotiationAdvice}
                variant="green-dark"
                size="default"
                className="w-full flex items-center gap-2 px-4 py-2 font-semibold mb-3"
              >
                <MessageSquare className="h-5 w-5" />
                Get Negotiation Strategy
              </Button>
              <p className="text-sm text-gray-600 leading-relaxed">
                Receive strategic guidance on how to use your inspection findings in purchase negotiations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons;
