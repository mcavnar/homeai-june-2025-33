
import React from 'react';
import { DollarSign, MessageSquareText, Clock, CheckCircle } from 'lucide-react';

const ValuePropositionBanner = () => {
  const benefits = [
    {
      icon: DollarSign,
      text: "Instant repair costs",
      highlight: true
    },
    {
      icon: MessageSquareText, 
      text: "Negotiation advice",
      highlight: true
    },
    {
      icon: Clock,
      text: "No account required",
      highlight: true
    },
    {
      icon: CheckCircle,
      text: "100% free analysis"
    }
  ];

  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        Instantly See Repair Costs &<br />
        <span className="text-green-600">Get Negotiation Advice</span>
      </h1>
      
      <div className="flex flex-wrap justify-center gap-6 mt-6">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-center gap-2">
            <benefit.icon className={`h-5 w-5 ${benefit.highlight ? 'text-green-600' : 'text-blue-600'}`} />
            <span className={`text-lg ${
              benefit.highlight 
                ? 'font-bold text-gray-900' 
                : 'font-medium text-gray-700'
            }`}>
              {benefit.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValuePropositionBanner;
