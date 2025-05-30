
export interface InspectionIssue {
  description: string;
  location: string;
  priority: 'high' | 'medium';
  estimatedCost: {
    min: number;
    max: number;
  };
  category: string;
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
    highPriorityTotal: {
      min: number;
      max: number;
    };
    mediumPriorityTotal: {
      min: number;
      max: number;
    };
    grandTotal: {
      min: number;
      max: number;
    };
  };
}
