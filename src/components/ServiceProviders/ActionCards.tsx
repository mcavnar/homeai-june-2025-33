
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { TrackedButton } from '@/components/TrackedButton';
import ProviderRequestFormModal from './ProviderRequestFormModal';

const ActionCards: React.FC = () => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isDemoMode = location.pathname.includes('/demo/');

  const handleGenerateFormClick = () => {
    if (isDemoMode) {
      navigate('/auth');
      return;
    }
    setIsFormModalOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 mb-8">
        <Card className="border-gray-200 h-full">
          <CardContent className="p-6 flex flex-col h-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Request Information from Seller
            </h3>
            <p className="text-gray-600 mb-4 flex-grow">
              Generate a shareable form link to send to the seller or their agent. This will allow them to provide detailed information about all current service providers for this property.
            </p>
            <TrackedButton 
              variant="green"
              size="lg"
              className="w-full"
              onClick={handleGenerateFormClick}
              trackingLabel="Generate Provider Request Form"
            >
              Generate Provider Request Form
            </TrackedButton>
          </CardContent>
        </Card>
      </div>

      {!isDemoMode && (
        <ProviderRequestFormModal 
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
        />
      )}
    </>
  );
};

export default ActionCards;
