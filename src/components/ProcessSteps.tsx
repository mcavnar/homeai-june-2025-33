
import React from 'react';
import { Upload, UserPlus, BarChart3 } from 'lucide-react';

interface ProcessStepsProps {
  currentStep?: number;
}

const ProcessSteps: React.FC<ProcessStepsProps> = ({ currentStep = 1 }) => {
  const steps = [
    {
      number: 1,
      title: "Upload Report",
      description: "Drag & drop your PDF",
      icon: Upload,
      active: currentStep >= 1
    },
    {
      number: 2,
      title: "Create Account", 
      description: "Quick & free signup",
      icon: UserPlus,
      active: currentStep >= 2
    },
    {
      number: 3,
      title: "View Results",
      description: "Get repair costs & advice",
      icon: BarChart3,
      active: currentStep >= 3
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                step.active 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step.active && step.number === currentStep ? (
                  <step.icon className="h-6 w-6" />
                ) : (
                  <span className="font-semibold">{step.number}</span>
                )}
              </div>
              <h3 className={`font-medium text-sm ${
                step.active ? 'text-gray-900' : 'text-gray-600'
              }`}>
                {step.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1 max-w-20">
                {step.description}
              </p>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`flex-1 h-px mx-4 ${
                currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProcessSteps;
