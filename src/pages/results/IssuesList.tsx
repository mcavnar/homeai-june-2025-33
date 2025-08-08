
import React, { useState } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import DetailedFindings from '@/components/DetailedFindings';
import ProvidersModal from '@/components/ServiceProviders/ProvidersModal';
import { supabase } from '@/integrations/supabase/client';
import { extractZipFromAddress, getDemoZipCode, isDemoMode, generateThumbTackSearchQuery } from '@/utils/thumbtackUtils';
import { useGoogleAnalytics } from '@/hooks/useGoogleAnalytics';
import { useToast } from '@/hooks/use-toast';

interface ThumbTackProvider {
  name: string;
  rating: number;
  reviewCount: number;
  location: string;
  image?: string;
  profileUrl: string;
  requestFlowUrl?: string;
  phone?: string;
  description?: string;
}

interface IssuesListContextType {
  analysis: any;
  propertyData: any;
}

const IssuesList = () => {
  const { analysis, propertyData } = useOutletContext<IssuesListContextType>();
  const location = useLocation();
  const { trackEvent } = useGoogleAnalytics();
  const { toast } = useToast();

  // Modal state for expert opinion providers
  const [isProvidersModalOpen, setIsProvidersModalOpen] = useState(false);
  const [providers, setProviders] = useState<ThumbTackProvider[]>([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);
  const [providersError, setProvidersError] = useState<string>('');
  const [currentIssueDescription, setCurrentIssueDescription] = useState<string>('');

  // Debug logging to trace analysis data at page level
  console.log('IssuesList Page - Full analysis object:', analysis);
  console.log('IssuesList Page - analysis.issues:', analysis?.issues);
  console.log('IssuesList Page - issues type:', typeof analysis?.issues);
  console.log('IssuesList Page - issues length:', analysis?.issues?.length);

  if (analysis?.issues && analysis.issues.length > 0) {
    console.log('IssuesList Page - Sample issue keys:', Object.keys(analysis.issues[0] || {}));
    console.log('IssuesList Page - Issues with sourceQuote:', 
      analysis.issues.filter((issue: any) => !!issue.sourceQuote).length);
  }

  // Calculate priority statistics
  const getPriorityStats = () => {
    if (!analysis?.issues || analysis.issues.length === 0) {
      return {
        high: { count: 0, cost: 0 },
        medium: { count: 0, cost: 0 },
        low: { count: 0, cost: 0 }
      };
    }

    const highPriorityIssues = analysis.issues.filter((issue: any) => 
      issue.priority === 'immediate' || issue.priority === 'high'
    );
    const mediumPriorityIssues = analysis.issues.filter((issue: any) => 
      issue.priority === 'medium'
    );
    const lowPriorityIssues = analysis.issues.filter((issue: any) => 
      issue.priority === 'low'
    );

    const highCost = highPriorityIssues.reduce((sum: number, issue: any) => 
      sum + (issue.estimatedCost?.max || 0), 0
    );
    const mediumCost = mediumPriorityIssues.reduce((sum: number, issue: any) => 
      sum + (issue.estimatedCost?.max || 0), 0
    );
    const lowCost = lowPriorityIssues.reduce((sum: number, issue: any) => 
      sum + (issue.estimatedCost?.max || 0), 0
    );

    return {
      high: { count: highPriorityIssues.length, cost: highCost },
      medium: { count: mediumPriorityIssues.length, cost: mediumCost },
      low: { count: lowPriorityIssues.length, cost: lowCost }
    };
  };

  const priorityStats = getPriorityStats();

  // Handle Get Expert Opinion functionality
  const handleGetExpertOpinion = async (issue: any) => {
    console.log('Get Expert Opinion clicked for issue:', issue);
    
    try {
      // Track analytics event
      trackEvent('expert_opinion_requested', {
        event_category: 'engagement',
        event_label: `${issue.category}: ${issue.description.slice(0, 50)}...`,
        issue_category: issue.category,
        issue_priority: issue.priority
      });

      // Extract property address and zip code
      const propertyAddress = propertyData?.address || analysis?.propertyInfo?.address;
      console.log('Property address for zip extraction:', propertyAddress);
      
      let zipCode = '';
      if (isDemoMode(location.pathname)) {
        zipCode = getDemoZipCode();
        console.log('Using demo zip code:', zipCode);
      } else if (propertyAddress) {
        const extractedZip = extractZipFromAddress(propertyAddress);
        if (extractedZip) {
          zipCode = extractedZip;
          console.log('Extracted zip code:', zipCode);
        } else {
          toast({
            title: "Address Error",
            description: "Could not determine location for provider search.",
            variant: "destructive",
          });
          return;
        }
      } else {
        toast({
          title: "Address Error", 
          description: "Property address not available for provider search.",
          variant: "destructive",
        });
        return;
      }

      // Set up modal state
      setCurrentIssueDescription(issue.description);
      setIsProvidersModalOpen(true);
      setIsLoadingProviders(true);
      setProvidersError('');
      setProviders([]);

      // Generate optimized search query
      const searchQuery = generateThumbTackSearchQuery(issue);
      
      // Call thumbtack-search edge function
      console.log('Calling thumbtack-search with:', {
        originalDescription: issue.description,
        processedSearchQuery: searchQuery,
        zipCode: zipCode
      });

      const { data, error } = await supabase.functions.invoke('thumbtack-search', {
        body: {
          searchQuery: searchQuery,
          zipCode: zipCode,
        },
      });

      if (error) {
        console.error('Thumbtack search error:', error);
        setProvidersError('Failed to find providers. Please try again later.');
        toast({
          title: "Search Failed",
          description: "Could not find providers at this time.",
          variant: "destructive",
        });
      } else if (data?.providers) {
        console.log('Thumbtack search successful:', data.providers);
        setProviders(data.providers);
        toast({
          title: "Providers Found",
          description: `Found ${data.providers.length} providers for your issue.`,
        });
      } else {
        console.log('No providers found in response:', data);
        setProviders([]);
        toast({
          title: "No Providers Found",
          description: "No providers available for this service in your area.",
        });
      }
    } catch (error) {
      console.error('Error getting expert opinion:', error);
      setProvidersError('An unexpected error occurred. Please try again.');
      toast({
        title: "Error",
        description: "Failed to search for providers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingProviders(false);
    }
  };

  if (!analysis.issues || analysis.issues.length === 0) {
    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Issues List</h1>
          <div className="text-gray-600 text-lg">
            <p>All identified issues with location and estimated repair costs</p>
          </div>
        </div>

        <div className="text-center py-12">
          <p className="text-gray-500">No detailed findings available in this report.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Issues List</h1>
        <div className="text-gray-600 text-lg">
          <p>All identified issues with location and estimated repair costs</p>
        </div>
      </div>

      {/* Priority Summary Boxes */}
      <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
        {/* High Priority */}
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <h3 className="text-lg font-semibold text-red-700">High Priority</h3>
              </div>
              <div className="text-3xl font-bold text-red-600 mb-1">
                {priorityStats.high.count}
              </div>
              <div className="text-sm text-red-600">
                {priorityStats.high.count === 1 ? 'Issue' : 'Issues'}
              </div>
              <div className="text-xl font-semibold text-red-700 mt-2">
                {formatCurrency(priorityStats.high.cost)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medium Priority */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <h3 className="text-lg font-semibold text-yellow-700">Medium Priority</h3>
              </div>
              <div className="text-3xl font-bold text-yellow-600 mb-1">
                {priorityStats.medium.count}
              </div>
              <div className="text-sm text-yellow-600">
                {priorityStats.medium.count === 1 ? 'Issue' : 'Issues'}
              </div>
              <div className="text-xl font-semibold text-yellow-700 mt-2">
                {formatCurrency(priorityStats.medium.cost)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Low Priority */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <h3 className="text-lg font-semibold text-green-700">Low Priority</h3>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-1">
                {priorityStats.low.count}
              </div>
              <div className="text-sm text-green-600">
                {priorityStats.low.count === 1 ? 'Issue' : 'Issues'}
              </div>
              <div className="text-xl font-semibold text-green-700 mt-2">
                {formatCurrency(priorityStats.low.cost)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DetailedFindings 
        issues={analysis.issues} 
        onGetExpertOpinion={handleGetExpertOpinion}
      />

      {/* Providers Modal for Expert Opinion */}
      <ProvidersModal
        isOpen={isProvidersModalOpen}
        onClose={() => setIsProvidersModalOpen(false)}
        providers={providers}
        serviceType={currentIssueDescription}
        isLoading={isLoadingProviders}
        error={providersError}
        variant="issues-table"
      />
    </div>
  );
};

export default IssuesList;
