
import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { useSharedReport } from '@/contexts/SharedReportContext';

interface SharedReportLayoutProps {
  children: React.ReactNode;
}

const SharedReportLayout: React.FC<SharedReportLayoutProps> = ({ children }) => {
  const { isLoading, error } = useSharedReport();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <p className="text-gray-600">Loading shared report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Report Not Found</h1>
          <p className="text-gray-600 mb-4">This shared report link is invalid or has been deactivated.</p>
          <p className="text-sm text-gray-500">Please contact the report owner for a valid link.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🏠</span>
              </div>
              <div className="text-xl font-bold text-gray-900">HomeAi</div>
            </div>
            <div className="text-sm text-gray-500">
              Shared Report
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="text-center text-sm text-gray-500">
            Powered by{' '}
            <a 
              href="https://homeai.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              HomeAi
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SharedReportLayout;
