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

  console.log('🔧 Repair penalty calculation:', { 
    totalRepairCost, 
    squareFeet, 
    soldPrice, 
    bedrooms 
  });

  const penalties: number[] = [];
  let estimatedFields = 0;

  // Smart estimations for missing values
  let effectiveSquareFeet = squareFeet;
  let effectiveSoldPrice = soldPrice;
  let effectiveBedrooms = bedrooms;

  // Estimate squareFeet if missing
  if (!effectiveSquareFeet && effectiveBedrooms) {
    effectiveSquareFeet = effectiveBedrooms * 800; // 800 sqft per bedroom
    estimatedFields++;
    console.log('🔧 Estimated squareFeet from bedrooms:', effectiveSquareFeet);
  } else if (!effectiveSquareFeet) {
    effectiveSquareFeet = 2386; // National average
    estimatedFields++;
    console.log('🔧 Using national avg squareFeet:', effectiveSquareFeet);
  }

  // Estimate soldPrice if missing
  if (!effectiveSoldPrice && effectiveSquareFeet) {
    effectiveSoldPrice = effectiveSquareFeet * 150; // $150 per sqft estimate
    estimatedFields++;
    console.log('🔧 Estimated soldPrice from squareFeet:', effectiveSoldPrice);
  } else if (!effectiveSoldPrice) {
    effectiveSoldPrice = 239900; // National average
    estimatedFields++;
    console.log('🔧 Using national avg soldPrice:', effectiveSoldPrice);
  }

  // Estimate bedrooms if missing
  if (!effectiveBedrooms && effectiveSquareFeet) {
    effectiveBedrooms = Math.max(1, Math.round(effectiveSquareFeet / 800)); // 800 sqft per bedroom
    estimatedFields++;
    console.log('🔧 Estimated bedrooms from squareFeet:', effectiveBedrooms);
  } else if (!effectiveBedrooms) {
    effectiveBedrooms = 2.8; // National average
    estimatedFields++;
    console.log('🔧 Using national avg bedrooms:', effectiveBedrooms);
  }

  // Calculate penalties with confidence weighting (reduce penalty when using estimates)
  const confidenceMultiplier = Math.max(0.5, 1 - (estimatedFields * 0.15));
  console.log('🔧 Confidence multiplier:', confidenceMultiplier, 'estimated fields:', estimatedFields);

  // Penalty A - Cost per SqFt
  if (effectiveSquareFeet) {
    const repairCostPerSqft = totalRepairCost / effectiveSquareFeet;
    const penaltyA = (repairCostPerSqft / NATIONAL_AVG_COST_PER_SQFT) * 30 * confidenceMultiplier;
    penalties.push(penaltyA);
    console.log('🔧 Penalty A (cost per sqft):', penaltyA, `($${repairCostPerSqft.toFixed(2)}/sqft)`);
  }

  // Penalty B - % of Price
  if (effectiveSoldPrice) {
    const repairPct = totalRepairCost / effectiveSoldPrice;
    const penaltyB = (repairPct / NATIONAL_AVG_REPAIR_PCT) * 30 * confidenceMultiplier;
    penalties.push(penaltyB);
    console.log('🔧 Penalty B (% of price):', penaltyB, `(${(repairPct * 100).toFixed(2)}%)`);
  }

  // Penalty C - Cost per Bedroom
  if (effectiveBedrooms && effectiveBedrooms > 0) {
    const repairCostPerBedroom = totalRepairCost / effectiveBedrooms;
    const penaltyC = (repairCostPerBedroom / NATIONAL_AVG_COST_PER_BEDROOM) * 30 * confidenceMultiplier;
    penalties.push(penaltyC);
    console.log('🔧 Penalty C (cost per bedroom):', penaltyC, `($${repairCostPerBedroom.toFixed(0)}/bedroom)`);
  }

  // Minimum penalty logic - ensure high repair costs get meaningful penalties
  if (penalties.length === 0 || totalRepairCost > 50000) {
    const minimumPenalty = Math.min(25, (totalRepairCost / 10000) * 12);
    penalties.push(minimumPenalty);
    console.log('🔧 Added minimum penalty for high repair cost:', minimumPenalty);
  }

  // Average the penalties
  const avgPenalty = penalties.reduce((sum, penalty) => sum + penalty, 0) / penalties.length;
  let repairPenalty = Math.min(30, avgPenalty);

  // Add inconsistency penalty if we have multiple penalties
  if (penalties.length > 1) {
    const inconsistencyPenalty = standardDeviation(penalties) * confidenceMultiplier;
    repairPenalty += Math.min(5, inconsistencyPenalty);
    console.log('🔧 Added inconsistency penalty:', inconsistencyPenalty);
  }

  console.log('🔧 Final repair penalty:', repairPenalty);
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
