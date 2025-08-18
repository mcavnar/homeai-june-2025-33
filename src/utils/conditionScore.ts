import { HomeInspectionAnalysis } from '@/types/inspection';
import { RedfinPropertyData } from '@/types/redfin';

// National averages and constants
const NATIONAL_AVG_COST_PER_SQFT = 4.19; // $10,000 / 2,386 sqft
const NATIONAL_AVG_REPAIR_PCT = 0.0417; // $10,000 / $239,900
const NATIONAL_AVG_COST_PER_BEDROOM = 3571; // $10,000 / 2.8 bedrooms
const NATIONAL_AVG_ISSUES = 20.67;

export interface ConditionScoreResult {
  score: number; // 0-10
  rating: string;
  rawScore: number; // 0-100
  repairPenalty: number;
  issuePenalty: number;
  marketPenalty: number;
}

const standardDeviation = (values: number[]): number => {
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  return Math.sqrt(variance);
};

const calculateRepairSeverityPenalty = (
  totalRepairCost: number,
  squareFeet: number | null,
  soldPrice: number | null,
  bedrooms: number | null
): number => {
  if (totalRepairCost === 0) return 0;

  const penalties: number[] = [];

  // Penalty A - Cost per SqFt
  if (squareFeet) {
    const repairCostPerSqft = totalRepairCost / squareFeet;
    const penaltyA = (repairCostPerSqft / NATIONAL_AVG_COST_PER_SQFT) * 30;
    penalties.push(penaltyA);
  }

  // Penalty B - % of Price
  if (soldPrice) {
    const repairPct = totalRepairCost / soldPrice;
    const penaltyB = (repairPct / NATIONAL_AVG_REPAIR_PCT) * 30;
    penalties.push(penaltyB);
  }

  // Penalty C - Cost per Bedroom
  if (bedrooms && bedrooms > 0) {
    const repairCostPerBedroom = totalRepairCost / bedrooms;
    const penaltyC = (repairCostPerBedroom / NATIONAL_AVG_COST_PER_BEDROOM) * 30;
    penalties.push(penaltyC);
  }

  if (penalties.length === 0) return 0;

  // Average the penalties
  const avgPenalty = penalties.reduce((sum, penalty) => sum + penalty, 0) / penalties.length;
  let repairPenalty = Math.min(30, avgPenalty);

  // Add inconsistency penalty if we have multiple penalties
  if (penalties.length > 1) {
    const inconsistencyPenalty = standardDeviation(penalties);
    repairPenalty += Math.min(5, inconsistencyPenalty);
  }

  return repairPenalty;
};

const calculateIssueCountPenalty = (totalIssues: number): number => {
  if (totalIssues <= 20) return 0;
  if (totalIssues <= 30) return ((totalIssues - 20) / 10) * 10; // penalty: 0–10
  if (totalIssues <= 40) return 10 + ((totalIssues - 30) / 10) * 10; // penalty: 10–20
  return 20; // anything above 40 gets max penalty
};

const calculateMarketMisalignmentPenalty = (
  propertyData: RedfinPropertyData,
  daysOnMarket: number | null
): number => {
  let marketPenalty = 0;

  // Days on Market penalty
  if (daysOnMarket && propertyData.neighborhoodAvgDaysOnMarket) {
    if (daysOnMarket > 1.5 * propertyData.neighborhoodAvgDaysOnMarket) {
      marketPenalty += 5;
    }
  }

  // Sale-to-List Ratio penalty
  if (propertyData.soldPrice && propertyData.listedPrice && propertyData.neighborhoodAvgSaleToListRatio) {
    const saleToListRatio = propertyData.soldPrice / propertyData.listedPrice;
    if (saleToListRatio < 0.9 * propertyData.neighborhoodAvgSaleToListRatio) {
      marketPenalty += 5;
    }
  }

  // Square Feet penalty
  if (propertyData.squareFeet && propertyData.nearbyHomesAvgSquareFeet) {
    if (propertyData.squareFeet < 0.8 * propertyData.nearbyHomesAvgSquareFeet) {
      marketPenalty += 5;
    }
  }

  return Math.min(20, marketPenalty);
};

const getRating = (score: number): string => {
  if (score >= 9.2) return 'Excellent';
  if (score >= 8.0) return 'Very Good';
  if (score >= 6.5) return 'Good';
  if (score >= 5.5) return 'Fair';
  return 'Poor';
};

const calculateDaysOnMarket = (soldDate: string | null, listedDate: string | null): number | null => {
  if (!soldDate || !listedDate) return null;
  
  const sale = new Date(soldDate);
  const listing = new Date(listedDate);
  const diffTime = Math.abs(sale.getTime() - listing.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

export const calculateConditionScore = (
  analysis: HomeInspectionAnalysis,
  propertyData: RedfinPropertyData | null
): ConditionScoreResult => {
  console.log('🧮 Calculating condition score with:', { 
    hasPropertyData: !!propertyData, 
    costSummary: analysis.costSummary,
    issuesCount: analysis.issues?.length 
  });

  // Calculate total repair cost - try grandTotal first, then fallback to sum of individual issues
  let totalRepairCost = analysis.costSummary?.grandTotal?.max || 0;
  
  if (totalRepairCost === 0 && analysis.issues?.length) {
    console.log('🧮 GrandTotal is 0, calculating from individual issues');
    totalRepairCost = analysis.issues.reduce((sum, issue) => {
      const maxCost = issue.estimatedCost?.max || 0;
      return sum + maxCost;
    }, 0);
    console.log('🧮 Calculated total from issues:', totalRepairCost);
  }
  
  // Count total issues (safety issues are now included in the main issues array)
  const totalIssues = analysis.issues?.length || 0;
  
  // Calculate days on market (only if property data exists)
  const daysOnMarket = propertyData ? calculateDaysOnMarket(propertyData.soldDate, propertyData.listedDate) : null;

  // Calculate penalties
  const repairPenalty = propertyData ? calculateRepairSeverityPenalty(
    totalRepairCost,
    propertyData.squareFeet,
    propertyData.soldPrice,
    propertyData.bedrooms
  ) : Math.min(30, (totalRepairCost / 10000) * 15); // Fallback: $10k = 15 penalty points

  const issuePenalty = calculateIssueCountPenalty(totalIssues);
  
  const marketPenalty = propertyData ? calculateMarketMisalignmentPenalty(propertyData, daysOnMarket) : 0;
  
  console.log('🧮 Calculated penalties:', { repairPenalty, issuePenalty, marketPenalty, totalRepairCost });

  // Calculate raw score (0-100)
  const rawScore = Math.max(0, 100 - repairPenalty - issuePenalty - marketPenalty);
  
  // Normalize to 0-10 scale
  const score = rawScore / 10;
  
  // Get rating
  const rating = getRating(score);

  return {
    score: Math.round(score * 10) / 10, // Round to 1 decimal place
    rating,
    rawScore,
    repairPenalty,
    issuePenalty,
    marketPenalty
  };
};
