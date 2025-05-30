
import React from 'react';
import { TrendingUp, Target, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { formatCurrency } from '@/utils/formatters';
import { NegotiationStrategy as NegotiationStrategyType } from '@/types/inspection';

interface NegotiationStrategyProps {
  strategy: NegotiationStrategyType;
}

const NegotiationStrategy: React.FC<NegotiationStrategyProps> = ({ strategy }) => {
  return (
    <Card className="border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <Target className="h-5 w-5" />
          Negotiation Strategy
        </CardTitle>
        <CardDescription>
          AI-powered negotiation recommendations based on inspection findings and market data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Reference */}
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Quick Reference: Your Negotiation Position
          </h3>
          
          <div className="mb-4">
            <p className="text-sm font-medium text-purple-700 mb-2">Recommended Ask:</p>
            <p className="text-xl font-bold text-purple-900">
              {formatCurrency(strategy.quickReference.recommendedAsk.min)} - {formatCurrency(strategy.quickReference.recommendedAsk.max)}
            </p>
            <p className="text-sm text-purple-600">Credit toward repairs or price reduction</p>
          </div>

          <div>
            <p className="text-sm font-medium text-purple-700 mb-2">Strong Negotiation Points:</p>
            <ul className="space-y-1">
              {strategy.quickReference.strongPoints.map((point, index) => (
                <li key={index} className="text-sm text-purple-800 flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Phase-by-Phase Guide */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Phase-by-Phase Negotiation Guide
          </h3>
          
          <div className="space-y-3">
            {/* Initial Response */}
            <Collapsible defaultOpen>
              <CollapsibleTrigger asChild>
                <div className="cursor-pointer p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                  <h4 className="font-medium text-blue-800">Phase 1: Initial Response</h4>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 p-3 bg-blue-25 border-l-4 border-blue-200">
                  <ul className="space-y-2">
                    {strategy.phaseGuide.initialResponse.map((step, index) => (
                      <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Counter-Negotiation */}
            <Collapsible>
              <CollapsibleTrigger asChild>
                <div className="cursor-pointer p-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors">
                  <h4 className="font-medium text-orange-800">Phase 2: Counter-Negotiation</h4>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 p-3 bg-orange-25 border-l-4 border-orange-200">
                  <ul className="space-y-2">
                    {strategy.phaseGuide.counterNegotiation.map((step, index) => (
                      <li key={index} className="text-sm text-orange-800 flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Final Strategy */}
            <Collapsible>
              <CollapsibleTrigger asChild>
                <div className="cursor-pointer p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                  <h4 className="font-medium text-green-800">Phase 3: Final Strategy</h4>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 p-3 bg-green-25 border-l-4 border-green-200">
                  <ul className="space-y-2">
                    {strategy.phaseGuide.finalStrategy.map((step, index) => (
                      <li key={index} className="text-sm text-green-800 flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NegotiationStrategy;
