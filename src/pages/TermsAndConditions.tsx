
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-4xl font-bold text-gray-900">Terms & Conditions</h1>
          <p className="text-gray-500 mt-2">Last Updated: July 8, 2025</p>
        </div>

        <div className="prose max-w-none text-gray-700 space-y-6">
          <div className="p-8 border border-gray-200 rounded-lg bg-gray-50 text-center">
            <h2 className="text-xl font-medium text-gray-700">Content Coming Soon</h2>
            <p className="mt-2">The Terms & Conditions content will be added here once provided.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
