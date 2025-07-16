
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMetaConversions } from '@/hooks/useMetaConversions';
import { useGoogleAnalytics } from '@/hooks/useGoogleAnalytics';
import { TrackedButton } from '@/components/TrackedButton';
import { Upload, FileText } from 'lucide-react';

const ProcessSection = () => {
  const navigate = useNavigate();
  const { trackConversion } = useMetaConversions();
  const { trackEvent } = useGoogleAnalytics();

  const handleUpload = async () => {
    // Track Google Analytics event
    trackEvent('upload_report_free_click', {
      event_category: 'engagement',
      event_label: 'process_section',
      value: 1
    });

    // Track conversion
    await trackConversion({
      eventName: 'Lead',
      contentName: 'Upload Report Process Section Button'
    });

    // Navigate to upload
    navigate('/anonymous-upload');
  };

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto mb-20">
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

        {/* Upload Call-to-Action Box */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  Ready to Get Started?
                </h3>
                <p className="text-gray-600 text-lg">
                  Upload your inspection report now and get your personalized analysis in minutes
                </p>
              </div>
            </div>
            
            <TrackedButton
              onClick={handleUpload}
              variant="green"
              size="lg"
              className="px-12 py-6 text-xl font-medium h-auto rounded-lg"
              trackingLabel="Process Section Upload Button"
            >
              <Upload className="mr-3 h-6 w-6" />
              Upload Your Report for Free
            </TrackedButton>
            
            <p className="text-sm text-gray-500 mt-4">
              100% free • No account required • Delete anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessSection;
