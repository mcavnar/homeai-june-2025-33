
import React from 'react';
import { Link } from 'react-router-dom';

const LandingFooter = () => {
  return (
    <footer className="border-t border-gray-100 py-16 bg-white">
      <div className="container mx-auto px-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">🏠</span>
          </div>
          <div className="text-xl font-bold text-gray-900">HomeAi</div>
        </div>
        <p className="text-gray-500 font-light mb-6">
          Transform your home inspection reports with AI-powered insights.
        </p>
        <div className="flex justify-center gap-8">
          <Link to="/privacy" className="text-gray-500 hover:text-gray-700 transition-colors text-sm">
            Privacy Policy
          </Link>
          <Link to="/terms" className="text-gray-500 hover:text-gray-700 transition-colors text-sm">
            Terms & Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
