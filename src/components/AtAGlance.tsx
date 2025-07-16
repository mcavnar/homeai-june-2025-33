
import React from 'react';
import { HomeInspectionAnalysis } from '@/types/inspection';
import { RedfinPropertyData } from '@/types/redfin';
import { calculateConditionScore } from '@/utils/conditionScore';
import ConditionScoreCard from './ConditionScoreCard';
import RepairCostsCard from './RepairCostsCard';
import IssuesFoundCard from './IssuesFoundCard';
import BottomLineSummary from './BottomLineSummary';

interface AtAGlanceProps {
  analysis: HomeInspectionAnalysis;
  propertyData?: RedfinPropertyData;
}

const AtAGlance: React.FC<AtAGlanceProps> = ({ analysis, propertyData }) => {
  const totalRepairCost = analysis.costSummary?.grandTotal?.max || 0;
  
  // Check data availability for each card
  const hasAnalysis = analysis && analysis.issues;
  const hasPropertyData = propertyData && Object.keys(propertyData).length > 0;
  const hasBothAnalysisAndProperty = hasAnalysis && hasPropertyData;
  
  // Calculate condition score only when both data sources are available
  const conditionResult = hasBothAnalysisAndProperty 
    ? calculateConditionScore(analysis, propertyData)
    : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Always show repair costs and issues found cards when analysis is available */}
        {hasAnalysis && (
          <>
            <RepairCostsCard 
              totalRepairCost={totalRepairCost}
              analysis={analysis}
            />
            <IssuesFoundCard 
              issues={analysis.issues || []} 
            />
          </>
        )}
        
        {/* Show condition score card only when both analysis and property data are available */}
        {hasBothAnalysisAndProperty && conditionResult && (
          <ConditionScoreCard 
            score={conditionResult.score} 
            rating={conditionResult.rating}
            analysis={analysis}
            propertyData={propertyData}
          />
        )}
      </div>
      
      {/* Show bottom line summary only when both analysis and property data are available */}
      {hasBothAnalysisAndProperty && (
        <BottomLineSummary 
          analysis={analysis} 
          propertyData={propertyData} 
        />
      )}
    </div>
  );
};

export default AtAGlance;
