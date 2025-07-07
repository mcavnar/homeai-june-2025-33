
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Upload,
  FileText,
  Users,
  TrendingUp,
  BarChart3,
  Wrench,
  MessageSquare
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
    <div className="min-h-screen bg-white">
      {/* Clean, minimal navigation */}
      <nav className="border-b border-gray-100 bg-white">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🏠</span>
            </div>
            <div className="text-xl font-bold text-gray-900">HomeAi</div>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Button onClick={() => navigate('/upload')} variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                Dashboard
              </Button>
            ) : (
              <Button variant="ghost" onClick={handleSignIn} className="text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section - Clean askauntsally.ai style with light blue background */}
      <div className="bg-blue-50 py-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight max-w-5xl mx-auto">
            Turn Your Home Inspection Report Into Clear, Actionable Insights
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Get instant repair costs, priority rankings, and negotiation strategies from your inspection report using AI-powered analysis.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              onClick={handleViewDemo}
              size="lg" 
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-6 text-lg font-medium h-auto rounded-lg shadow-none border-0"
            >
              <Eye className="mr-2 h-5 w-5" />
              View Demo Report
            </Button>
            <Button 
              onClick={handleGetStarted}
              variant="outline" 
              size="lg"
              className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 px-10 py-6 text-lg font-medium h-auto rounded-lg shadow-none"
            >
              <Upload className="mr-2 h-5 w-5" />
              Get Started Free
            </Button>
          </div>

          <p className="text-gray-400 text-sm font-light">No signup required for demo • Get instant results</p>
        </div>
      </div>

      {/* Problems Section - Your Inspection Report, Demystified */}
      <div className="bg-gray-50 py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Your Inspection Report, Demystified.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
              <div className="text-6xl mb-8">😰</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">15+ Page Reports</h3>
              <p className="text-gray-600 text-lg font-light leading-relaxed">
                Dense technical jargon that leaves you more confused than when you started
              </p>
            </div>

            <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
              <div className="text-6xl mb-8">⏰</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Time Pressure</h3>
              <p className="text-gray-600 text-lg font-light leading-relaxed">
                Need to make critical decisions quickly while emotions and stakes are high
              </p>
            </div>

            <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
              <div className="text-6xl mb-8">💸</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Financial Uncertainty</h3>
              <p className="text-gray-600 text-lg font-light leading-relaxed">
                No idea what repairs actually cost or how to negotiate effectively
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section - Get The Clarity You Need In Minutes */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Get The Clarity You Need In Minutes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
              <div className="text-4xl mb-6">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Clear Summary</h3>
              <p className="text-gray-600 font-light leading-relaxed text-sm">Plain English breakdown of what actually matters in your report</p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
              <div className="text-4xl mb-6">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Market Analysis</h3>
              <p className="text-gray-600 font-light leading-relaxed text-sm">How your home's condition compares to similar properties in your area</p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
              <div className="text-4xl mb-6">💰</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Repair Estimates</h3>
              <p className="text-gray-600 font-light leading-relaxed text-sm">Real cost estimates for every issue, from minor fixes to major repairs</p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
              <div className="text-4xl mb-6">🔧</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Service providers</h3>
              <p className="text-gray-600 font-light leading-relaxed text-sm">Vetted contractors and specialists recommended for each repair type and ongoing service</p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
              <div className="text-4xl mb-6">💬</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Negotiation Tips</h3>
              <p className="text-gray-600 font-light leading-relaxed text-sm">Strategic advice on what to ask for and how to approach sellers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Process Section - Simple Process, Powerful Results */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Simple Process, Powerful Results
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <span className="text-white font-bold text-2xl">1</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Upload Report</h3>
              <p className="text-gray-600 text-lg font-light leading-relaxed">
                Simply drag and drop your PDF inspection report
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <span className="text-white font-bold text-2xl">2</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Intelligent Data Analysis</h3>
              <p className="text-gray-600 text-lg font-light leading-relaxed">
                Our AI processes your report using millions of proprietary data points to deliver insights you can't get anywhere else
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <span className="text-white font-bold text-2xl">3</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Get Insights</h3>
              <p className="text-gray-600 text-lg font-light leading-relaxed">
                Receive your personalized analysis and action plan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - askauntsally.ai style */}
      <footer className="border-t border-gray-100 py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🏠</span>
            </div>
            <div className="text-xl font-bold text-gray-900">HomeAi</div>
          </div>
          <p className="text-gray-500 font-light">
            Transform your home inspection reports with AI-powered insights.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
