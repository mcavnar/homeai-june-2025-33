
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAnonymousReport } from '@/hooks/useAnonymousReport';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Clock } from 'lucide-react';

const AnonymousSynopsis = () => {
  const location = useLocation();
  const { anonymousReport } = useAnonymousReport();
  
  // Use state data first, then fallback to database data
  const reportData = location.state || anonymousReport;
  const analysis = reportData?.analysis || reportData?.analysis_data;

  if (!analysis) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No analysis data available.</p>
        <Button 
          onClick={() => window.location.href = '/anonymous-upload'} 
          className="mt-4"
        >
          Upload Report
        </Button>
      </div>
    );
  }

  const expiresAt = anonymousReport?.expires_at;
  const timeRemaining = expiresAt ? 
    Math.ceil((new Date(expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 
    7;

  return (
    <div className="space-y-6">
      {/* Temporary Storage Notice */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                Temporary Storage - {timeRemaining} days remaining
              </p>
              <p className="text-sm text-amber-700">
                Your report will be automatically deleted in {timeRemaining} days. 
                Create an account to save it permanently.
              </p>
            </div>
            <Button 
              size="sm" 
              className="ml-auto"
              onClick={() => window.location.href = '/auth'}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Save Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Issues Summary */}
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">Issues Found</h3>
              <p className="text-2xl font-bold text-red-600">
                {analysis.detailedFindings?.length || 0}
              </p>
              <p className="text-sm text-red-600">Total Issues</p>
            </div>

            {/* Cost Summary */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Estimated Costs</h3>
              <p className="text-2xl font-bold text-yellow-600">
                ${analysis.costSummary?.totalEstimatedCost?.toLocaleString() || 'N/A'}
              </p>
              <p className="text-sm text-yellow-600">Total Repair Cost</p>
            </div>

            {/* Safety Issues */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-800 mb-2">Safety Issues</h3>
              <p className="text-2xl font-bold text-orange-600">
                {analysis.safetyIssues?.length || 0}
              </p>
              <p className="text-sm text-orange-600">Critical Items</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Executive Summary */}
      {analysis.executiveSummary && (
        <Card>
          <CardHeader>
            <CardTitle>Executive Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {analysis.executiveSummary}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Property Information */}
      {analysis.propertyInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Property Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-700">Address</h4>
                <p className="text-gray-600">{analysis.propertyInfo.address || 'N/A'}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Inspection Date</h4>
                <p className="text-gray-600">{analysis.propertyInfo.inspectionDate || 'N/A'}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Property Type</h4>
                <p className="text-gray-600">{analysis.propertyInfo.propertyType || 'N/A'}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Year Built</h4>
                <p className="text-gray-600">{analysis.propertyInfo.yearBuilt || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Findings */}
      {analysis.detailedFindings && analysis.detailedFindings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Key Issues Found</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.detailedFindings.slice(0, 5).map((finding: any, index: number) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-800">{finding.title}</h4>
                  <p className="text-gray-600 text-sm">{finding.description}</p>
                  {finding.estimatedCost && (
                    <p className="text-sm font-medium text-blue-600 mt-1">
                      Estimated Cost: ${finding.estimatedCost.toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
              {analysis.detailedFindings.length > 5 && (
                <p className="text-sm text-gray-500 italic">
                  And {analysis.detailedFindings.length - 5} more issues...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnonymousSynopsis;
