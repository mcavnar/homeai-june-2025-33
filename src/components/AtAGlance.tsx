
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
  propertyData: RedfinPropertyData;
}

const AtAGlance: React.FC<AtAGlanceProps> = ({ analysis, propertyData }) => {
  const conditionResult = calculateConditionScore(analysis, propertyData);
  const totalRepairCost = analysis.costSummary?.grandTotal?.max || 0;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
        <ConditionScoreCard 
          score={conditionResult.score} 
          rating={conditionResult.rating}
          analysis={analysis}
          propertyData={propertyData}
        />
        
        <RepairCostsCard 
          totalRepairCost={totalRepairCost}
          analysis={analysis}
        />
        
        <IssuesFoundCard 
          issues={analysis.issues || []} 
        />
      </div>
      
      <BottomLineSummary 
        analysis={analysis} 
        propertyData={propertyData} 
      />
    </div>
  );
};

export default AtAGlance;
