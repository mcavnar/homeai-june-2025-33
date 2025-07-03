
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Brain, 
  TrendingUp, 
  Shield, 
  CheckCircle, 
  ArrowRight,
  Users,
  Clock,
  DollarSign
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-900">HomeAi</div>
        <div className="flex items-center gap-4">
          {user ? (
            <Button onClick={() => navigate('/upload')} className="bg-blue-600 hover:bg-blue-700">
              Go to Upload
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={handleSignIn}>
                Sign In
              </Button>
              <Button onClick={handleGetStarted} className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16 text-center">
        <Badge variant="secondary" className="mb-4">
          AI-Powered Home Inspection Analysis
        </Badge>
        
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Transform Your Home<br />
          <span className="text-blue-600">Inspection Reports</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Upload your home inspection PDF and get intelligent insights, cost estimates, 
          and actionable recommendations powered by advanced AI analysis.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            onClick={handleGetStarted}
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 px-8 py-6 text-lg"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="px-8 py-6 text-lg"
          >
            <FileText className="mr-2 h-5 w-5" />
            View Sample Analysis
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              <Users className="h-8 w-8 mx-auto mb-1" />
              10,000+
            </div>
            <p className="text-gray-600">Reports Analyzed</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              <Clock className="h-8 w-8 mx-auto mb-1" />
              5 min
            </div>
            <p className="text-gray-600">Average Analysis Time</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              <DollarSign className="h-8 w-8 mx-auto mb-1" />
              $50K+
            </div>
            <p className="text-gray-600">Average Savings Identified</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose HomeAi?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform transforms complex inspection reports into clear, 
            actionable insights that help you make informed decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Brain className="h-10 w-10 text-blue-600 mb-4" />
              <CardTitle>AI-Powered Analysis</CardTitle>
              <CardDescription>
                Advanced machine learning algorithms analyze your inspection report 
                to identify critical issues and opportunities.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-green-600 mb-4" />
              <CardTitle>Cost Estimates</CardTitle>
              <CardDescription>
                Get accurate repair cost estimates and ROI projections to help 
                with budgeting and negotiation strategies.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Shield className="h-10 w-10 text-purple-600 mb-4" />
              <CardTitle>Risk Assessment</CardTitle>
              <CardDescription>
                Understand safety concerns and structural issues with detailed 
                risk assessments and priority rankings.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600">
              Get professional insights from your inspection report in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Upload Your Report</h3>
              <p className="text-gray-600">
                Simply upload your home inspection PDF. We support all major inspection formats.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. AI Analysis</h3>
              <p className="text-gray-600">
                Our AI processes your report, identifying issues, costs, and recommendations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Get Insights</h3>
              <p className="text-gray-600">
                Receive detailed analysis, cost estimates, and actionable recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of homeowners and real estate professionals who trust 
            HomeAi for their inspection report analysis.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg" 
            variant="secondary"
            className="px-8 py-6 text-lg"
          >
            Start Your Free Analysis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
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
