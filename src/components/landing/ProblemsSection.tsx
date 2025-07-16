import React from 'react';
import { Star } from 'lucide-react';

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
      description: "See accurate issue repair estimates and understand ongoing maintenance costs"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Austin, TX",
      quote: "HomeAI transformed my 47-page inspection report into clear, actionable insights. I finally understood what needed immediate attention vs. what could wait. The repair cost estimates helped me negotiate $8,000 off the purchase price.",
      rating: 5
    },
    {
      name: "Michael Chen",
      location: "Denver, CO", 
      quote: "The platform broke down all the technical jargon about my HVAC system and roof issues. Instead of feeling overwhelmed, I knew exactly what to ask contractors and how to prioritize repairs. Saved me thousands in unnecessary work.",
      rating: 5
    },
    {
      name: "Amanda Rodriguez",
      location: "Phoenix, AZ",
      quote: "HomeAI's negotiation advice was invaluable. They showed me comparable repair costs in my area and helped me create a compelling case for the seller to cover major electrical issues. The seller agreed to $12,000 in credits.",
      rating: 5
    }
  ];

  return (
    <div className="bg-gray-50 py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            Turn Your Report into the Ultimate Home Condition Dashboard
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
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

        {/* Testimonials Section */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h3>
            <p className="text-xl text-gray-600 font-light">
              See how HomeAI has helped homebuyers make confident decisions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 text-lg font-light leading-relaxed mb-6">
                  "{testimonial.quote}"
                </blockquote>
                <div className="border-t border-gray-100 pt-4">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-500 text-sm">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemsSection;
