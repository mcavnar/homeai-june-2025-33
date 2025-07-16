
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMetaConversions } from '@/hooks/useMetaConversions';
import { useGoogleAnalytics } from '@/hooks/useGoogleAnalytics';
import { TrackedButton } from '@/components/TrackedButton';
import { Eye, Upload } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();
  const { trackConversion } = useMetaConversions();
  const { trackEvent } = useGoogleAnalytics();

  const handleGetStarted = async () => {
    // Track Google Analytics event
    trackEvent('upload_report_free_click', {
      event_category: 'engagement',
      event_label: 'homepage',
      value: 1
    });

    // Track upload button click
    await trackConversion({
      eventName: 'Lead',
      contentName: 'Upload Report for Free Button'
    });

    // Always go to anonymous upload - no authentication required
    navigate('/anonymous-upload');
  };

  const handleViewDemo = async () => {
    // Track Google Analytics event
    trackEvent('view_demo_report_click', {
      event_category: 'engagement',
      event_label: 'homepage',
      value: 1
    });

    // Track demo view click as Lead instead of ViewContent
    await trackConversion({
      eventName: 'Lead',
      contentName: 'View Demo Report Button'
    });

    navigate('/demo-results/synopsis');
  };

  return (
    <div className="bg-blue-50 py-24">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight max-w-5xl mx-auto">
          Understand Your Inspection Report and What It Means For Your Budget
        </h1>
        
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
          We translate your inspection report into accurate repair estimates, recommend trusted service pros, and help you negotiate smartly with data about your area. You can delete your report at any time and the platform is entirely free to use.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <TrackedButton 
            onClick={handleViewDemo}
            variant="outline"
            size="lg" 
            className="bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300 px-10 py-6 text-lg font-medium h-auto rounded-lg shadow-none"
            trackingLabel="Hero View Demo Button"
          >
            <Eye className="mr-2 h-5 w-5" />
            View Demo Report
          </TrackedButton>
          <TrackedButton 
            onClick={handleGetStarted}
            variant="green" 
            size="lg"
            className="px-10 py-6 text-lg font-medium h-auto rounded-lg"
            trackingLabel="Hero Upload Report Button"
          >
            <Upload className="mr-2 h-5 w-5" />
            Upload Report for Free
          </TrackedButton>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
