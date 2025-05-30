
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SafetyIssuesProps {
  issues: string[];
}

const SafetyIssues: React.FC<SafetyIssuesProps> = ({ issues }) => {
  return (
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-700">
          <AlertCircle className="h-5 w-5" />
          Safety Concerns
        </CardTitle>
        <CardDescription>These issues pose immediate safety risks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {issues.map((issue, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </span>
              <p className="text-gray-800 leading-relaxed">{issue}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SafetyIssues;
