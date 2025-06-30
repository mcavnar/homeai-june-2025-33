
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProviderRequestFormModal from './ProviderRequestFormModal';

const ActionCards: React.FC = () => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Request Information from Seller
            </h3>
            <p className="text-gray-600 mb-4">
              Generate a shareable form link to send to the seller or their agent. This will allow them to provide detailed information about all current service providers for this property.
            </p>
            <Button 
              variant="default"
              size="lg"
              onClick={() => setIsFormModalOpen(true)}
            >
              Generate Provider Request Form
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-blue-900 mb-2">
              Need More Options?
            </h3>
            <p className="text-blue-700 mb-4">
              We can help you find additional qualified contractors in your area.
            </p>
            <Button variant="default" size="lg">
              Find More Providers
            </Button>
          </CardContent>
        </Card>
      </div>

      <ProviderRequestFormModal 
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
      />
    </>
  );
};

export default ActionCards;
