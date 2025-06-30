
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExecutiveSummaryProps {
  summary: string[];
}

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ summary }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <CheckCircle className="h-5 w-5" />
          Overall Assessment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {summary.map((point, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
              <p className="text-gray-800 leading-relaxed">{point}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ExecutiveSummary;
