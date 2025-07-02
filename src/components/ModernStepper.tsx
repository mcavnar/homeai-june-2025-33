
import React, { useState } from 'react';
import { Share, MessageSquare, DollarSign, Settings, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const steps: Step[] = [
    {
      id: 1,
      title: "Start Here",
      description: "Begin by understanding what major systems (HVAC, electrical, plumbing) mean for your home's condition and safety",
      action: "Learn About Key Systems",
      icon: Settings,
      onClick: () => navigate('/results/systems')
    },
    {
      id: 2,
      title: "Understand More",
      description: "Review every identified issue with detailed locations, priorities, and estimated repair costs",
      action: "Understand Complete Issues List",
      icon: FileText,
      onClick: () => navigate('/results/issues')
    },
    {
      id: 3,
      title: "Take Action",
      description: "Explore monthly service provider costs and connect with qualified contractors for ongoing maintenance",
      action: "See Property Service Costs",
      icon: DollarSign,
      onClick: () => navigate('/results/providers')
    },
    {
      id: 4,
      title: "Go Further",
      description: "Receive strategic guidance on how to use your inspection findings in purchase negotiations",
      action: "Get Negotiation Strategy",
      icon: MessageSquare,
      onClick: () => navigate('/results/negotiation')
    }
  ];

  return (
    <div className="w-full py-8">
      {/* Header */}
      <div className="text-center pb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Next Steps
        </h2>
      </div>

      {/* Desktop Timeline */}
      <div className="hidden lg:block">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute top-16 left-0 w-full h-1 bg-gray-200 rounded-full">
            <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full animate-timeline-draw"></div>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="relative animate-step-appear"
                style={{ animationDelay: `${index * 0.2}s` }}
                onMouseEnter={() => setHoveredStep(step.id)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                {/* Step Node */}
                <div className="relative z-10 flex justify-center mb-8">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl transition-all duration-300 ${
                    hoveredStep === step.id 
                      ? 'bg-green-600 shadow-lg scale-110' 
                      : 'bg-green-500 shadow-md'
                  }`}>
                    {step.id}
                  </div>
                </div>

                {/* Step Card */}
                <div className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm transition-all duration-300 cursor-pointer ${
                  hoveredStep === step.id 
                    ? 'shadow-xl -translate-y-2 scale-105' 
                    : 'hover:shadow-lg hover:-translate-y-1'
                }`}
                onClick={step.onClick}>
                  <div className="text-center mb-4">
                    <step.icon className="h-8 w-8 mx-auto text-green-600 mb-2" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">{step.description}</p>
                  </div>
                  
                  <Button 
                    variant="green-dark"
                    size="default"
                    className="w-full text-sm font-semibold"
                  >
                    {step.action}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tablet/Mobile Layout */}
      <div className="lg:hidden">
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="relative animate-step-appear"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Connecting Line for Mobile */}
              {index < steps.length - 1 && (
                <div className="absolute left-8 top-20 w-0.5 h-12 bg-green-300 z-0"></div>
              )}
              
              <div className="flex items-start gap-4 relative z-10">
                {/* Step Node */}
                <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
                  {step.id}
                </div>
                
                {/* Step Content */}
                <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                     onClick={step.onClick}>
                  <div className="flex items-start gap-3 mb-4">
                    <step.icon className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="green-dark"
                    size="default"
                    className="w-full text-sm font-semibold"
                  >
                    {step.action}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModernStepper;
