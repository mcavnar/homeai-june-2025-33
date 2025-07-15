
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAnonymousReport } from '@/hooks/useAnonymousReport';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, UserPlus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AnonymousResults = () => {
  const location = useLocation();
  const { anonymousReport, isLoading, error } = useAnonymousReport();
  
  // Get data from navigation state if available (for immediate display)
  const stateData = location.state;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Report Not Found</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => window.location.href = '/anonymous-upload'}>
                Upload New Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!anonymousReport && !stateData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Report Found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find your inspection report. Please upload a new one.
              </p>
              <Button onClick={() => window.location.href = '/anonymous-upload'}>
                Upload Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Use state data first, then fallback to database data
  const reportData = stateData || anonymousReport;
  const analysis = reportData?.analysis || reportData?.analysis_data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Save Account Banner */}
      <div className="bg-blue-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5" />
              <span className="text-sm font-medium">
                Create an account to save your report permanently
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => window.location.href = '/auth'}
            >
              Create Account
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnonymousResults;
