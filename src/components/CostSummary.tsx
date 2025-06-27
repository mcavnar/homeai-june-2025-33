import React from 'react';
import { DollarSign, Share, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface CostSummaryProps {
  costSummary: {
    immediatePriorityTotal?: { min: number; max: number; };
    highPriorityTotal: { min: number; max: number; };
    mediumPriorityTotal: { min: number; max: number; };
    lowPriorityTotal?: { min: number; max: number; };
    grandTotal: { min: number; max: number; };
  };
}

const CostSummary: React.FC<CostSummaryProps> = ({ costSummary }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Combine immediate and high priority costs
  const combinedHighPriorityMax = (costSummary.immediatePriorityTotal?.max || 0) + costSummary.highPriorityTotal.max;
  const mediumPriorityMax = costSummary.mediumPriorityTotal.max;
  const lowPriorityMax = costSummary.lowPriorityTotal?.max || 0;
  
  // Calculate total from displayed values instead of using backend grandTotal
  const calculatedTotalMax = combinedHighPriorityMax + mediumPriorityMax + lowPriorityMax;
  
  // Debug logging to identify discrepancies
  const backendGrandTotalMax = costSummary.grandTotal.max;
  if (Math.abs(calculatedTotalMax - backendGrandTotalMax) > 10) {
    console.warn('Cost total discrepancy detected:', {
      calculatedTotal: calculatedTotalMax,
      backendGrandTotal: backendGrandTotalMax,
      difference: calculatedTotalMax - backendGrandTotalMax,
      breakdown: {
        highPriority: combinedHighPriorityMax,
        mediumPriority: mediumPriorityMax,
        lowPriority: lowPriorityMax
      }
    });
  }

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
    <Card className="border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <DollarSign className="h-5 w-5" />
          Estimated Repair Costs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">High Priority</h4>
            <p className="text-2xl font-bold text-red-900">
              {formatCurrency(combinedHighPriorityMax)}
            </p>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Medium Priority</h4>
            <p className="text-2xl font-bold text-yellow-900">
              {formatCurrency(mediumPriorityMax)}
            </p>
          </div>
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h4 className="font-semibold text-orange-800 mb-2">Low Priority</h4>
            <p className="text-2xl font-bold text-orange-900">
              {formatCurrency(lowPriorityMax)}
            </p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Total Estimate</h4>
            <p className="text-2xl font-bold text-blue-900">
              {formatCurrency(calculatedTotalMax)}
            </p>
          </div>
        </div>
        
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
      </CardContent>
    </Card>
  );
};

export default CostSummary;
