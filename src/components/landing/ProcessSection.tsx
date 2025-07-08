
import React from 'react';

const ProcessSection = () => {
  const steps = [
    {
      number: "1",
      title: "Upload Report",
      description: "Simply drag and drop your PDF inspection report"
    },
    {
      number: "2",
      title: "Intelligent Data Analysis",
      description: "Our AI processes your report using millions of proprietary data points to deliver insights you can't get anywhere else"
    },
    {
      number: "3",
      title: "Get Insights",
      description: "Receive your personalized analysis and action plan"
    }
  ];

  return (
    <div className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            Simple Process, Powerful Results
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <span className="text-white font-bold text-2xl">{step.number}</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">{step.title}</h3>
              <p className="text-gray-600 text-lg font-light leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProcessSection;
