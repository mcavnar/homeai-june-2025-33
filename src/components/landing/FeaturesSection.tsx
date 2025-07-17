
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMetaConversions } from '@/hooks/useMetaConversions';
import { useGoogleAnalytics } from '@/hooks/useGoogleAnalytics';
import { TrackedButton } from '@/components/TrackedButton';
import { Upload } from 'lucide-react';

const FeaturesSection = () => {
  const navigate = useNavigate();
  const { trackConversion } = useMetaConversions();
  const { trackEvent } = useGoogleAnalytics();

  const handleUpload = async (sectionName: string) => {
    // Track Google Analytics event
    trackEvent('upload_report_free_click', {
      event_category: 'engagement',
      event_label: sectionName,
      value: 1
    });

    // Track conversion
    await trackConversion({
      eventName: 'Lead',
      contentName: `${sectionName} Upload Report Button`
    });

    // Navigate to upload
    navigate('/anonymous-upload');
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Austin, TX",
      quote: "HomeAI transformed my 47-page inspection report into clear, actionable insights.",
      rating: 5
    },
    {
      name: "Michael Chen",
      location: "Denver, CO", 
      quote: "The platform broke down all the technical jargon about my HVAC system and roof issues.",
      rating: 5
    },
    {
      name: "Amanda Rodriguez",
      location: "Phoenix, AZ",
      quote: "HomeAI's negotiation advice was invaluable. They showed me comparable repair costs.",
      rating: 5
    },
    {
      name: "David Kim",
      location: "Seattle, WA",
      quote: "Instead of feeling overwhelmed, I knew exactly what to ask contractors.",
      rating: 5
    }
  ];

  return (
    <div>
      {/* Section 1: Dashboard - Image Right, Text Left */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Turn Your Inspection Report into the Ultimate Home Condition Dashboard
              </h2>
              <p className="text-xl text-gray-600 mb-8 font-light leading-relaxed">
                Instantly transform confusing reports into a clear, visual summary of your home's overall health—prioritized, organized, and easy to understand.
              </p>
              <TrackedButton
                onClick={() => handleUpload('dashboard_section')}
                variant="green"
                size="lg"
                className="px-8 py-4 text-lg font-medium h-auto rounded-lg"
                trackingLabel="Dashboard Section Upload Button"
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Your Report
              </TrackedButton>
            </div>
            <div className="order-1 lg:order-2">
              <img 
                src="https://znohkixqcmwifqnqwdoc.supabase.co/storage/v1/object/public/site-images/HomeAI_dashboard_jul172025.png" 
                alt="HomeAI dashboard showing repair costs, issues identified, and overall condition"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Issues - Image Left, Text Right */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <div>
              <img 
                src="https://znohkixqcmwifqnqwdoc.supabase.co/storage/v1/object/public/site-images/HomeAI_issues_jul172025.png" 
                alt="HomeAI issues list with severity ratings and repair estimates"
                className="w-full"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Know What Needs Fixing—and When
              </h2>
              <p className="text-xl text-gray-600 mb-8 font-light leading-relaxed">
                Get a smart, categorized list of every issue found during your inspection, complete with severity ratings, estimated costs, and repair suggestions.
              </p>
              <TrackedButton
                onClick={() => handleUpload('issues_section')}
                variant="green"
                size="lg"
                className="px-8 py-4 text-lg font-medium h-auto rounded-lg"
                trackingLabel="Issues Section Upload Button"
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Your Report
              </TrackedButton>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Key Systems - Image Right, Text Left */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                See the Health of Your Home's Core Systems
              </h2>
              <p className="text-xl text-gray-600 mb-8 font-light leading-relaxed">
                Quickly assess the condition of your HVAC, roof, plumbing, and electrical systems at a glance—so you can plan confidently and avoid surprises.
              </p>
              <TrackedButton
                onClick={() => handleUpload('systems_section')}
                variant="green"
                size="lg"
                className="px-8 py-4 text-lg font-medium h-auto rounded-lg"
                trackingLabel="Systems Section Upload Button"
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Your Report
              </TrackedButton>
            </div>
            <div className="order-1 lg:order-2">
              <img 
                src="https://znohkixqcmwifqnqwdoc.supabase.co/storage/v1/object/public/site-images/HomeAI_keysystems_jul172025.png" 
                alt="HomeAI key systems overview showing HVAC, roof, plumbing, and electrical health"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Mobile App - Image Left, Testimonials Grid Right */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <div>
              <img 
                src="https://znohkixqcmwifqnqwdoc.supabase.co/storage/v1/object/public/site-images/HomeAI_momonphone_jul172025.png" 
                alt="HomeAI mobile app interface showing home inspection results"
                className="w-full"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                What Our Users Say
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {testimonials.map((testimonial, index) => (
                 <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                   <div>
                     <blockquote className="text-gray-700 text-sm font-light leading-relaxed mb-3">
                       "{testimonial.quote}"
                     </blockquote>
                   </div>
                   <div className="border-t border-gray-100 pt-3">
                     <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                     <div className="text-gray-500 text-xs">{testimonial.location}</div>
                   </div>
                 </div>
               ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
