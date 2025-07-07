
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
  TrendingUp
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

      {/* Problems Section - askauntsally.ai style */}
      <div className="bg-gray-50 py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Stop Struggling With Complex Inspection Reports
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
              Most homebuyers receive detailed inspection reports but struggle to understand what really matters, what things cost to fix, and how to use the information effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
              <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <FileText className="h-10 w-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Dense Technical Reports</h3>
              <p className="text-gray-600 text-lg font-light leading-relaxed">
                15+ pages of technical jargon that leave you more confused than when you started
              </p>
            </div>

            <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
              <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Clock className="h-10 w-10 text-orange-500" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Time Pressure</h3>
              <p className="text-gray-600 text-lg font-light leading-relaxed">
                Need to make critical decisions quickly while emotions and stakes are high
              </p>
            </div>

            <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <DollarSign className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Cost Uncertainty</h3>
              <p className="text-gray-600 text-lg font-light leading-relaxed">
                No idea what repairs actually cost or how to prioritize issues effectively
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section - askauntsally.ai style */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Get Clear Answers in Minutes, Not Hours
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
              Our AI analyzes your inspection report and provides the insights you need to make confident decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Instant Cost Estimates</h3>
              <p className="text-gray-600 font-light leading-relaxed">Get accurate repair cost estimates for every issue identified</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Priority Rankings</h3>
              <p className="text-gray-600 font-light leading-relaxed">Understand which issues need immediate attention vs. future planning</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Negotiation Strategy</h3>
              <p className="text-gray-600 font-light leading-relaxed">Get specific advice on how to use findings in purchase negotiations</p>
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
