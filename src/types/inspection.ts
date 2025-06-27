
export interface InspectionIssue {
  description: string;
  location: string;
  priority: 'immediate' | 'high' | 'medium' | 'low';
  estimatedCost: {
    min: number;
    max: number;
  };
  category: string;
}

export interface MajorSystem {
  condition: string;
  summary: string;
}

export interface MajorSystems {
  roof?: MajorSystem;
  foundation?: MajorSystem;
  electrical?: MajorSystem;
  plumbing?: MajorSystem;
  hvac?: MajorSystem;
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
  issues?: InspectionIssue[];
  majorSystems?: MajorSystems;
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
