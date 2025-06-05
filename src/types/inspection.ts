export interface InspectionIssue {
  description: string;
  priority: 'immediate' | 'high' | 'medium' | 'low';
  estimatedCost: {
    min: number;
    max: number;
  };
  category: string;
}

export interface NegotiationStrategy {
  quickReference: {
    recommendedAsk: {
      min: number;
      max: number;
    };
    strongPoints: string[];
  };
  phaseGuide: {
    initialResponse: string[];
    counterNegotiation: string[];
    finalStrategy: string[];
  };
}

export interface HomeInspectionAnalysis {
  propertyInfo?: {
    address?: string;
    inspectionDate?: string;
  };
  executiveSummary?: string[];
  majorSystems?: {
    roof?: string;
    foundation?: string;
    electrical?: string;
    plumbing?: string;
    hvac?: string;
  };
  issues?: InspectionIssue[];
  safetyIssues?: string[];
  costSummary?: {
    immediatePriorityTotal?: {
      min: number;
      max: number;
    };
    highPriorityTotal: {
      min: number;
      max: number;
    };
    mediumPriorityTotal: {
      min: number;
      max: number;
    };
    lowPriorityTotal?: {
      min: number;
      max: number;
    };
    grandTotal: {
      min: number;
      max: number;
    };
  };
}
