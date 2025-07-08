
import React from 'react';

const BenefitsSection = () => {
  const benefits = [
    {
      emoji: "📋",
      title: "Clear Summary",
      description: "Plain English breakdown of what actually matters in your report"
    },
    {
      emoji: "📊",
      title: "Market Analysis",
      description: "How your home's condition compares to similar properties in your area"
    },
    {
      emoji: "💰",
      title: "Repair Estimates",
      description: "Real cost estimates for every issue, from minor fixes to major repairs"
    },
    {
      emoji: "🔧",
      title: "Service providers",
      description: "Vetted contractors and specialists recommended for each repair type and ongoing service"
    },
    {
      emoji: "💬",
      title: "Negotiation Tips",
      description: "Strategic advice on what to ask for and how to approach sellers"
    }
  ];

  return (
    <div className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            Get The Clarity You Need In Minutes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
              <div className="text-4xl mb-6">{benefit.emoji}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{benefit.title}</h3>
              <p className="text-gray-600 font-light leading-relaxed text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;
