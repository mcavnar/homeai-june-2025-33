
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { HomeInspectionAnalysis } from '@/types/inspection';
import { RedfinPropertyData } from '@/types/redfin';
import { calculateConditionScore } from '@/utils/conditionScore';
import ConditionScoreCard from './ConditionScoreCard';
import RepairCostsCard from './RepairCostsCard';
import IssuesFoundCard from './IssuesFoundCard';
import ContextualCTA from './ContextualCTA';

interface AtAGlanceProps {
  analysis: HomeInspectionAnalysis;
  propertyData: RedfinPropertyData;
}

const AtAGlance: React.FC<AtAGlanceProps> = ({ analysis, propertyData }) => {
  const navigate = useNavigate();
  const conditionResult = calculateConditionScore(analysis, propertyData);
  const totalRepairCost = analysis.costSummary?.grandTotal?.max || 0;

  const handleLearnSystems = () => {
    navigate('/results/systems');
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
        <ConditionScoreCard 
          score={conditionResult.score} 
          rating={conditionResult.rating} 
        />
        
        <RepairCostsCard 
          totalRepairCost={totalRepairCost}
          analysis={analysis}
        />
        
        <IssuesFoundCard 
          issues={analysis.issues || []} 
        />
      </div>

      <ContextualCTA
        text="Want to understand what these systems and conditions mean for your home?"
        buttonText="Learn About Key Systems"
        onClick={handleLearnSystems}
        icon={Settings}
        variant="subtle"
      />
    </div>
  );
};

export default AtAGlance;
