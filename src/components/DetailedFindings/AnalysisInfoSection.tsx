
import React from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface AnalysisInfoSectionProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

const AnalysisInfoSection: React.FC<AnalysisInfoSectionProps> = ({
  isOpen,
  onToggle,
}) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex items-center justify-between w-full mt-4 p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
        <h4 className="font-semibold text-blue-900 text-sm">How Do We Analyze Your Issues?</h4>
        <ChevronDown className={`h-4 w-4 text-blue-900 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-2">
        <div className="bg-blue-50 rounded-lg p-4 space-y-3">
          <div className="space-y-3 text-sm text-blue-800">
            <div>
              <span className="font-medium">• Priority Classification:</span>
              <span className="ml-1">Issues are ranked based on safety impact, potential for damage progression, and urgency of repair needs</span>
            </div>
            
            <div>
              <span className="font-medium">• Cost Estimation:</span>
              <span className="ml-1">Repair costs are estimated using current market rates, material costs, labor requirements, and regional pricing data</span>
            </div>
            
            <div>
              <span className="font-medium">• Original Report Reference:</span>
              <span className="ml-1">Click "See in Report" on any item to view the original inspector's detailed findings and photos in the full PDF report</span>
            </div>
            
            <div>
              <span className="font-medium">• Professional Validation:</span>
              <span className="ml-1">While our analysis provides helpful estimates, always consult qualified contractors for final pricing and repair specifications</span>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AnalysisInfoSection;
