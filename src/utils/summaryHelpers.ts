
import { HomeInspectionAnalysis } from '@/types/inspection';
import { RedfinPropertyData } from '@/types/redfin';
import { calculateConditionScore } from '@/utils/conditionScore';
import { formatCurrency } from '@/utils/formatters';

// National averages for comparison
const NATIONAL_AVG_ISSUES = 20.67;
const NATIONAL_AVG_COST_PER_SQFT = 4.19;
const NATIONAL_AVG_REPAIR_PCT = 0.0417;

export const generateConditionSummary = (analysis: HomeInspectionAnalysis, propertyData: RedfinPropertyData): string => {
  const conditionResult = calculateConditionScore(analysis, propertyData);
  const totalIssues = analysis.issues?.length || 0;
  
  // Count critical issues (immediate + high priority)
  const criticalIssues = analysis.issues?.filter(issue => 
    issue.priority === 'immediate' || issue.priority === 'high'
  ).length || 0;

  // Check major systems condition
  const majorSystems = analysis.majorSystems;
  const systemsNeedingAttention = [];
  if (majorSystems?.roof?.condition && ['poor', 'fair'].includes(majorSystems.roof.condition.toLowerCase())) {
    systemsNeedingAttention.push('roof');
  }
  if (majorSystems?.foundation?.condition && ['poor', 'fair'].includes(majorSystems.foundation.condition.toLowerCase())) {
    systemsNeedingAttention.push('foundation');
  }
  if (majorSystems?.hvac?.condition && ['poor', 'fair'].includes(majorSystems.hvac.condition.toLowerCase())) {
    systemsNeedingAttention.push('HVAC');
  }

  // Generate dynamic condition summary
  if (conditionResult.rating === 'Excellent' || conditionResult.rating === 'Very Good') {
    if (totalIssues < NATIONAL_AVG_ISSUES * 0.7) {
      return `This home shows fewer issues than typical, with only ${totalIssues} items identified - well below the national average.`;
    }
    return `This home is in ${conditionResult.rating.toLowerCase()} condition with ${totalIssues} items identified, reflecting good maintenance and care.`;
  }

  if (conditionResult.rating === 'Good') {
    if (criticalIssues === 0) {
      return `This home is in good condition with ${totalIssues} items identified, none requiring immediate attention.`;
    }
    return `This home is in good condition with ${totalIssues} items identified, including ${criticalIssues} that warrant prompt attention.`;
  }

  if (conditionResult.rating === 'Fair') {
    if (systemsNeedingAttention.length > 0) {
      return `This home shows ${totalIssues} items requiring attention, particularly with the ${systemsNeedingAttention.join(' and ')} system${systemsNeedingAttention.length > 1 ? 's' : ''}.`;
    }
    return `This home has ${totalIssues} items identified, which is above average but manageable with proper planning.`;
  }

  // Poor condition
  if (systemsNeedingAttention.length > 1) {
    return `This home requires significant attention with ${totalIssues} items identified, including critical ${systemsNeedingAttention.join(', ')} systems.`;
  }
  return `This home needs substantial work with ${totalIssues} items identified, requiring careful prioritization and budgeting.`;
};

export const generateCostContext = (analysis: HomeInspectionAnalysis, propertyData: RedfinPropertyData): string => {
  const totalRepairCost = analysis.costSummary?.grandTotal?.max || 0;
  const conditionResult = calculateConditionScore(analysis, propertyData);
  
  // Calculate cost ratios
  const costPerSqft = propertyData.squareFeet ? totalRepairCost / propertyData.squareFeet : 0;
  const costPercentage = propertyData.soldPrice ? (totalRepairCost / propertyData.soldPrice) * 100 : 0;
  
  // Determine cost context
  const isLowCost = conditionResult.repairPenalty < 10;
  const isHighCost = conditionResult.repairPenalty > 20;
  
  if (isLowCost) {
    if (costPerSqft < NATIONAL_AVG_COST_PER_SQFT * 0.8) {
      return `Repair costs of ${formatCurrency(totalRepairCost)} are well within normal range, providing budget flexibility for improvements.`;
    }
    return `Repair costs of ${formatCurrency(totalRepairCost)} are reasonable and manageable for a home of this size and value.`;
  }

  if (isHighCost) {
    if (costPercentage > NATIONAL_AVG_REPAIR_PCT * 100 * 1.5) {
      return `While repair costs of ${formatCurrency(totalRepairCost)} represent a significant investment, this creates substantial negotiation leverage.`;
    }
    return `Repair costs of ${formatCurrency(totalRepairCost)} are elevated but provide clear justification for price negotiations.`;
  }

  // Moderate costs
  return `Repair costs of ${formatCurrency(totalRepairCost)} are above average, offering good negotiation opportunities while remaining manageable.`;
};

export const generateActionPriority = (analysis: HomeInspectionAnalysis): string => {
  const immediateIssues = analysis.issues?.filter(issue => issue.priority === 'immediate').length || 0;
  const highPriorityIssues = analysis.issues?.filter(issue => issue.priority === 'high').length || 0;
  const totalCritical = immediateIssues + highPriorityIssues;
  
  // Check for major system issues
  const majorSystems = analysis.majorSystems;
  const urgentSystems = [];
  
  if (majorSystems?.roof?.yearsLeft && parseInt(majorSystems.roof.yearsLeft) < 3) {
    urgentSystems.push('roof replacement');
  }
  if (majorSystems?.hvac?.yearsLeft && parseInt(majorSystems.hvac.yearsLeft) < 2) {
    urgentSystems.push('HVAC system');
  }
  if (majorSystems?.foundation?.condition && majorSystems.foundation.condition.toLowerCase() === 'poor') {
    urgentSystems.push('foundation repairs');
  }

  // Generate priority-based message
  if (immediateIssues > 0) {
    if (urgentSystems.length > 0) {
      return `${immediateIssues} safety items need immediate attention, plus ${urgentSystems.join(' and ')} should be addressed soon, but having this roadmap puts you in control.`;
    }
    return `${immediateIssues} safety items should be addressed immediately, but having clear priorities helps you tackle them systematically.`;
  }

  if (totalCritical > 0) {
    if (urgentSystems.length > 0) {
      return `${totalCritical} high-priority items and upcoming ${urgentSystems.join(' and ')} needs provide a clear action plan for the next 1-2 years.`;
    }
    return `${totalCritical} high-priority items should be addressed in the coming months, giving you a clear timeline for improvements.`;
  }

  if (urgentSystems.length > 0) {
    return `While no immediate safety concerns exist, planning for ${urgentSystems.join(' and ')} in the next few years ensures continued comfort and value.`;
  }

  // No immediate concerns
  const mediumIssues = analysis.issues?.filter(issue => issue.priority === 'medium').length || 0;
  if (mediumIssues > 0) {
    return `No immediate safety concerns identified, giving you flexibility to address the remaining items as time and budget allow.`;
  }

  return `Minimal immediate concerns identified, providing you with excellent flexibility in timing any improvements.`;
};
