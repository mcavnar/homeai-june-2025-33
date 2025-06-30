
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';
import ProviderRequestFormModal from './ProviderRequestFormModal';

const ActionCards: React.FC = () => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-green-500 rounded-lg p-3 flex-shrink-0">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Request Information from Seller
                </h3>
                <p className="text-gray-600 mb-4">
                  Generate a shareable form link to send to the seller or their agent. This will allow them to provide detailed information about all current service providers for this property.
                </p>
                <Button 
                  className="bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => setIsFormModalOpen(true)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Provider Request Form
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg p-3 flex-shrink-0">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Add Your Own Service Provider
                </h3>
                <p className="text-gray-600 mb-4">
                  Want to add additional service providers or replace existing ones? Use our form to track costs and compare options.
                </p>
                <Button className="bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Service Provider
                </Button>
              </div>
            </div>
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
