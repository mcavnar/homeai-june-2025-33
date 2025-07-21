
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleAnalytics } from '@/hooks/useGoogleAnalytics';
import { TrackedButton } from '@/components/TrackedButton';
import { Upload, FileText } from 'lucide-react';

const ProcessSection = () => {
  const navigate = useNavigate();
  const { trackEvent } = useGoogleAnalytics();

  const handleUpload = async () => {
    // Track Google Analytics event
    trackEvent('upload_report_free_click', {
      event_category: 'engagement',
      event_label: 'process_section',
      value: 1
    });

    // Navigate to upload
    navigate('/anonymous-upload');
  };

  return (
    <div className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Upload Call-to-Action Box */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-6 md:p-12 shadow-sm border border-gray-100 text-center">
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
              className="px-6 md:px-12 py-6 text-lg md:text-xl font-medium h-auto rounded-lg"
              trackingLabel="Process Section Upload Button"
              metaEventName="Lead"
              metaContentName="Upload Report Process Section Button"
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
