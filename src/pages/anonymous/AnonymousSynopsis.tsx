
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAnonymousReport } from '@/hooks/useAnonymousReport';
import ExecutiveSummary from '@/components/ExecutiveSummary';
import AtAGlance from '@/components/AtAGlance';
import PropertyInfo from '@/components/PropertyInfo';
import RepairCostsCard from '@/components/RepairCostsCard';
import IssuesFoundCard from '@/components/IssuesFoundCard';
import SafetyIssues from '@/components/SafetyIssues';
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

      {/* Executive Summary */}
      <ExecutiveSummary 
        summary={analysis.executiveSummary}
        costSummary={analysis.costSummary}
        propertyInfo={analysis.propertyInfo}
      />

      {/* At a Glance */}
      <AtAGlance 
        analysis={analysis}
        costSummary={analysis.costSummary}
      />

      {/* Property Info */}
      <PropertyInfo propertyInfo={analysis.propertyInfo} />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <RepairCostsCard costSummary={analysis.costSummary} />
          <IssuesFoundCard 
            issuesSummary={analysis.issuesSummary}
            detailedFindings={analysis.detailedFindings}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <SafetyIssues 
            safetyIssues={analysis.safetyIssues}
            detailedFindings={analysis.detailedFindings}
          />
        </div>
      </div>
    </div>
  );
};

export default AnonymousSynopsis;
