
import React from 'react';
import { TrackedButton } from '@/components/TrackedButton';
import { Wrench, Hammer, Droplets, Zap } from 'lucide-react';

interface SystemCTAProps {
  ctaText: string;
  ctaType: 'hvac' | 'roofing' | 'plumbing' | 'electrical';
  onClick: () => void;
}

const SystemCTA: React.FC<SystemCTAProps> = ({ ctaText, ctaType, onClick }) => {
  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'hvac':
        return <Wrench className="h-4 w-4" />;
      case 'roofing':
        return <Hammer className="h-4 w-4" />;
      case 'plumbing':
        return <Droplets className="h-4 w-4" />;
      case 'electrical':
        return <Zap className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <TrackedButton 
      variant="green" 
      className="w-full shadow-md hover:shadow-lg transition-shadow duration-200"
      onClick={onClick}
      trackingLabel={ctaText}
    >
      <div className="flex items-center justify-center gap-2">
        {getServiceIcon(ctaType)}
        <span>{ctaText}</span>
      </div>
    </TrackedButton>
  );
};

export default SystemCTA;
