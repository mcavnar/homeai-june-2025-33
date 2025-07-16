
import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import NegotiationStrategy from '@/components/NegotiationStrategy';
import { Card, CardContent } from '@/components/ui/card';

interface DemoNegotiationContextType {
  negotiationStrategy: any;
}

const DemoNegotiation = () => {
  const { negotiationStrategy } = useOutletContext<DemoNegotiationContextType>();
  const navigate = useNavigate();

  const handleUploadReport = () => {
    navigate('/anonymous-upload');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Negotiation Strategy</h1>
        <div className="text-gray-600 text-lg">
          <p>AI-powered negotiation recommendations based on inspection findings</p>
        </div>
      </div>

      <NegotiationStrategy strategy={negotiationStrategy} />

      {/* Upload Report CTA Section */}
      <Card className="border-gray-200">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Get Your Personalized Negotiation Strategy
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
            Upload your actual inspection report to receive a customized negotiation strategy based on your specific property issues, local market conditions, and proven negotiation tactics that maximize your leverage.
          </p>
          <Button 
            variant="green" 
            size="lg" 
            className="px-8 py-3 text-lg font-medium shadow-lg"
            onClick={handleUploadReport}
          >
            Upload Your Report For Free
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoNegotiation;
