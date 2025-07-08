
import React from 'react';

const ProblemsSection = () => {
  const problems = [
    {
      emoji: "😰",
      title: "40+ Page Reports",
      description: "Get critical context on complicated issues and explanations for technical jargon"
    },
    {
      emoji: "⏰",
      title: "Time Pressure",
      description: "We help you make important decisions quickly while emotions and stakes are high"
    },
    {
      emoji: "💸",
      title: "Financial Uncertainty",
      description: "No idea what repairs actually cost or how to negotiate effectively"
    }
  ];

  return (
    <div className="bg-gray-50 py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            Your Inspection Report, Demystified.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {problems.map((problem, index) => (
            <div key={index} className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
              <div className="text-6xl mb-8">{problem.emoji}</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">{problem.title}</h3>
              <p className="text-gray-600 text-lg font-light leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProblemsSection;
