
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresReport?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiresReport = false }) => {
  const { user, loading, hasExistingReport } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If user is trying to access upload page but already has a report, redirect to results
  if (location.pathname === '/upload' && hasExistingReport) {
    return <Navigate to="/results/synopsis" replace />;
  }

  // If user is trying to access results but doesn't have a report, redirect to upload
  if (requiresReport && hasExistingReport === false) {
    return <Navigate to="/upload" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
