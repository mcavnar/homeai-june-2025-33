
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { InspectionIssue } from '@/types/inspection';
import AnalysisInfoSection from './DetailedFindings/AnalysisInfoSection';
import IssuesList from './DetailedFindings/IssuesList';

interface DetailedFindingsProps {
  issues: InspectionIssue[];
  onGetExpertOpinion?: (issue: InspectionIssue) => void;
}

const DetailedFindings: React.FC<DetailedFindingsProps> = ({ issues, onGetExpertOpinion }) => {
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

  return (
    <Card>
      <CardContent className="pt-6">
        <AnalysisInfoSection 
          isOpen={isAnalysisOpen}
          onToggle={setIsAnalysisOpen}
        />
        
        <div className="mt-6">
          <IssuesList issues={issues} onGetExpertOpinion={onGetExpertOpinion} />
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailedFindings;
