
import React from 'react';
import { Shield, Lock, Eye, Users, Star } from 'lucide-react';

const TrustSignals = () => {
  return (
    <div className="space-y-6">
      {/* Security Badges */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
          <Shield className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">SSL Secure</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <Lock className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Data Encrypted</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg">
          <Eye className="h-4 w-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-800">100% Private</span>
        </div>
      </div>

      {/* Privacy Statement */}
      <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-gray-600" />
          <span className="font-semibold text-gray-800">Your Privacy Guaranteed</span>
        </div>
        <p className="text-sm text-gray-600">
          Your report is completely private and will never be shared. We automatically delete all files after analysis. 
          No spam, no calls - just your results.
        </p>
      </div>

      {/* Social Proof */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span><strong className="text-gray-900">2,847+</strong> home buyers have saved money with our analysis</span>
        </div>
        
        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-gray-700 mb-2">
              "Saved me $8,200 on repair negotiations! The analysis was spot-on and gave me confidence during closing."
            </p>
            <p className="text-xs text-gray-500">- Sarah M., Home Buyer</p>
          </div>
          
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-gray-700 mb-2">
              "This tool is a game-changer! Identified $12k in issues the inspector missed. Highly recommend!"
            </p>
            <p className="text-xs text-gray-500">- Mike R., Real Estate Agent</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;
