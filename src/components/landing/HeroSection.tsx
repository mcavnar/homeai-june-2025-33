
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { TrackedButton } from '@/components/TrackedButton';
import { Eye, Upload } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/upload');
    } else {
      navigate('/auth');
    }
  };

  const handleViewDemo = () => {
    navigate('/demo');
  };

  return (
    <div className="bg-blue-50 py-24">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight max-w-5xl mx-auto">
          Turn Your Home Inspection Report Into Clear, Actionable Insights
        </h1>
        
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
          Get instant repair costs, priority rankings, and negotiation strategies from your inspection report using AI-powered analysis.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <TrackedButton 
            onClick={handleViewDemo}
            size="lg" 
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-6 text-lg font-medium h-auto rounded-lg shadow-none border-0"
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
