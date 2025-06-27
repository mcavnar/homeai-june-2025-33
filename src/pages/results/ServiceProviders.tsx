
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock } from 'lucide-react';

const ServiceProviders = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Service Providers
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center py-12">
        <div className="flex flex-col items-center gap-4">
          <Clock className="h-12 w-12 text-gray-400" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600 max-w-md">
              We're working on building a network of trusted contractors and service providers 
              to help you address the issues found in your inspection report.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceProviders;
