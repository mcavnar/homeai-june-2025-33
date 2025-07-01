
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface ContextualCTAProps {
  text: string;
  buttonText: string;
  onClick: () => void;
  icon?: LucideIcon;
  variant?: 'subtle' | 'prominent';
}

const ContextualCTA: React.FC<ContextualCTAProps> = ({ 
  text, 
  buttonText, 
  onClick, 
  icon: Icon,
  variant = 'subtle' 
}) => {
  if (variant === 'prominent') {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-gray-700 mb-4">{text}</p>
            <Button 
              onClick={onClick}
              variant="green-dark"
              size="lg"
              className="flex items-center gap-2"
            >
              {Icon && <Icon className="h-5 w-5" />}
              {buttonText}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
      <p className="text-gray-700 text-sm">{text}</p>
      <Button 
        onClick={onClick}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 ml-4"
      >
        {Icon && <Icon className="h-4 w-4" />}
        {buttonText}
        <ArrowRight className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default ContextualCTA;
