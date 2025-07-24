
import React from 'react';

const WhyWeBuildSection = () => {
  return (
    <div className="bg-gray-50 py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Why We Built HomeIQ
            </h3>
          </div>
          
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100">
            <blockquote className="text-gray-700 text-lg font-light leading-relaxed mb-8">
              "We started HomeIQ after some of us bought homes and found the home inspection report to be the most stressful part of the process. In my case, the report was over 70 pages and full of issues. It was detailed, but I had to spend a lot of time figuring out costs and how to negotiate. I kept flipping through the PDF and taking notes.<br/><br/>When I began working with AI, I saw it could make inspection reports much easier to use and more valuable. By tapping into databases with millions of contractor quotes and cost data, we could augment the reports with accurate repair estimates and helpful negotiation tips. We could also explain the home's key systems and maintenance needs and provide context on the local service provider options. Home inspectors do a fantastic job. We want to make their work something that remains useful as long as you stay in your home.<br/><br/>This is just the start of our journey. HomeIQ is free—give it a try and let us know what you think!"
            </blockquote>
              <div className="text-right border-t border-gray-100 pt-6">
                <div className="font-semibold text-gray-900">Matt Cavnar</div>
                <div className="text-gray-500 text-sm">Co-founder, HomeIQ</div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyWeBuildSection;
