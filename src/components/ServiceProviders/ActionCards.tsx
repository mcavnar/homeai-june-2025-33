
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProviderRequestFormModal from './ProviderRequestFormModal';

const ActionCards: React.FC = () => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-gray-200 h-full">
          <CardContent className="p-6 flex flex-col h-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Request Information from Seller
            </h3>
            <p className="text-gray-600 mb-4 flex-grow">
              Generate a shareable form link to send to the seller or their agent. This will allow them to provide detailed information about all current service providers for this property.
            </p>
            <Button 
              variant="default"
              size="lg"
              className="w-full"
              onClick={() => setIsFormModalOpen(true)}
            >
              Generate Provider Request Form
            </Button>
          </CardContent>
        </Card>

        <Card className="border-gray-200 h-full">
          <CardContent className="p-6 flex flex-col h-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Get Our Recommended Providers
            </h3>
            <p className="text-gray-600 mb-4 flex-grow">
              We use our database of the most qualified providers in your area to find the right options for you.
            </p>
            <Button variant="default" size="lg" className="w-full">
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
