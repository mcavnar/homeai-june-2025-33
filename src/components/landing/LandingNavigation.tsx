
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { TrackedButton } from '@/components/TrackedButton';

const LandingNavigation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSignIn = () => {
    navigate('/auth?mode=signin');
  };

  return (
    <nav className="border-b border-gray-100 bg-white">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">🏠</span>
          </div>
          <div className="text-xl font-bold text-gray-900">HomeAI</div>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <TrackedButton 
              onClick={() => navigate('/results/synopsis')} 
              variant="outline" 
              className="border-gray-200 text-gray-700 hover:bg-gray-50"
              trackingLabel="Header Dashboard Button"
            >
              Dashboard
            </TrackedButton>
          ) : (
            <TrackedButton 
              variant="ghost" 
              onClick={handleSignIn} 
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              trackingLabel="Header Sign In Button"
            >
              Sign In
            </TrackedButton>
          )}
        </div>
      </div>
    </nav>
  );
};

export default LandingNavigation;
