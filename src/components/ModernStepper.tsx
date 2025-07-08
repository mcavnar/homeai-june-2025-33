
import React from 'react';
import { Share, Handshake, Users, Settings, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { TrackedButton } from '@/components/TrackedButton';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Step {
  id: number;
  title: string;
  description: string;
  action: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}

const ModernStepper: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const steps: Step[] = [
    {
      id: 1,
      title: "Review Issue List",
      description: "Review every identified issue with detailed locations, priorities, and estimated repair costs",
      action: "Review Issues List",
      icon: AlertTriangle,
      onClick: () => navigate('/results/issues')
    },
    {
      id: 2,
      title: "See Key Systems",
      description: "Understand the condition and expected maintenance costs of the property's major systems (e.g. HVAC, electrical, etc.).",
      action: "See Key Systems",
      icon: Settings,
      onClick: () => navigate('/results/systems')
    },
    {
      id: 3,
      title: "Get Service Providers",
      description: "Explore monthly service provider costs and connect with qualified area vendors.",
      action: "Get Service Providers",
      icon: Users,
      onClick: () => navigate('/results/providers')
    },
    {
      id: 4,
      title: "Negotiate Effectively",
      description: "Receive strategic guidance on how to use your inspection findings in purchase negotiations",
      action: "Negotiate Effectively",
      icon: Handshake,
      onClick: () => navigate('/results/negotiation')
    }
  ];

  return (
    <div className="w-full py-8">
      {/* Header */}
      <div className="text-left pb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Next Steps
        </h2>
        <p className="text-lg text-gray-600">
          Here's how to make the most of your inspection report
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {steps.map((step) => (
          <Card key={step.id} className="bg-white border shadow-sm hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <step.icon className="h-8 w-8 text-green-500" />
                </div>
                <div className="space-y-3 text-center">
                  <TrackedButton
                    onClick={step.onClick}
                    variant="green"
                    size="default"
                    className="w-full font-semibold"
                    trackingLabel={`Dashboard Navigation - ${step.action}`}
                  >
                    {step.action}
                  </TrackedButton>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ModernStepper;
