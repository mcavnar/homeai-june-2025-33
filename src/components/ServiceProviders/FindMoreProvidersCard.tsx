
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const FindMoreProvidersCard: React.FC = () => {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="pt-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Need More Options?</h3>
          <p className="text-blue-700 mb-4">
            We can help you find additional qualified contractors in your area.
          </p>
          <Button className="bg-green-400 hover:bg-green-500 text-white shadow-lg hover:shadow-xl transition-all duration-200">
            Find More Providers
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FindMoreProvidersCard;
