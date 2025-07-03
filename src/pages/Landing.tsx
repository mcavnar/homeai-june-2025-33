
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Eye,
  Upload
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/upload');
    } else {
      navigate('/auth');
    }
  };

  const handleSignIn = () => {
    navigate('/auth?mode=signin');
  };

  const handleViewDemo = () => {
    navigate('/demo');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">🏠</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">HomeAi</div>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
          <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">How It Works</a>
          {user ? (
            <Button onClick={() => navigate('/upload')} className="bg-blue-600 hover:bg-blue-700">
              Go to Dashboard
            </Button>
          ) : (
            <Button variant="ghost" onClick={handleSignIn}>
              Sign In
            </Button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16 text-center">
        <Badge variant="secondary" className="mb-6 bg-white/50 text-gray-700">
          AI-Powered Home Inspection Analysis
        </Badge>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight max-w-5xl mx-auto">
          Get Instant, Accurate Repair Costs and Key Systems Analysis from Your Home Inspection Report
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Prioritize repairs and negotiate confidently using accurate inspection report analysis.
        </p>

        <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
          Want to see how it works? View a sample report — or upload your own and try it for free!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button 
            onClick={handleViewDemo}
            size="lg" 
            className="bg-green-500 hover:bg-green-600 px-8 py-6 text-lg font-semibold"
          >
            <Eye className="mr-2 h-5 w-5" />
            View Demo Report
          </Button>
          <Button 
            onClick={handleGetStarted}
            variant="outline" 
            size="lg"
            className="border-green-500 text-green-600 hover:bg-green-50 px-8 py-6 text-lg font-semibold"
          >
            <Upload className="mr-2 h-5 w-5" />
            Get Started Free
          </Button>
        </div>
      </div>

      {/* Problems Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Demystify Your Home Inspection Report
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Home inspectors provide thorough, expert reports that detail the condition of a property — but many buyers and homeowners struggle to fully understand the technical language and complex findings. Our tool makes it easy to decode these reports, offering clear, actionable insights in a way that's simple to follow. With our user-friendly analysis, you can confidently prioritize issues and make informed decisions, ensuring you get the most out of your home inspection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-6xl mb-6">😰</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">15+ Page Reports</h3>
              <p className="text-gray-600 text-lg">
                Dense technical jargon that leaves you more confused than when you started
              </p>
            </div>

            <div className="text-center">
              <div className="text-6xl mb-6">⏰</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Time Pressure</h3>
              <p className="text-gray-600 text-lg">
                Need to make critical decisions quickly while emotions and stakes are high
              </p>
            </div>

            <div className="text-center">
              <div className="text-6xl mb-6">💸</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Financial Uncertainty</h3>
              <p className="text-gray-600 text-lg">
                No idea what repairs actually cost or how to negotiate effectively
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="text-xl font-bold mb-4">HomeAi</div>
          <p className="text-gray-400">
            Transform your home inspection reports with AI-powered insights.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
