
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, BarChart3, DollarSign, Clock, CheckCircle } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/get-started');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transform Your Home Inspection Report Into Actionable Insights
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Upload your PDF inspection report and get an intelligent analysis with prioritized findings, 
            cost estimates, and negotiation strategies - all powered by AI.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="text-lg px-8 py-4"
          >
            Get Started - Analyze Your Report
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Smart Analysis</CardTitle>
              <CardDescription>
                AI-powered analysis of your entire inspection report in minutes
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Cost Estimates</CardTitle>
              <CardDescription>
                Get detailed repair costs and maintenance projections for every system
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle>Negotiation Strategy</CardTitle>
              <CardDescription>
                Strategic recommendations for property negotiations based on findings
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Why Choose Our Analysis?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Comprehensive Coverage</h3>
                  <p className="text-gray-600">Analysis of all major systems including HVAC, plumbing, electrical, and structural elements</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Priority Ranking</h3>
                  <p className="text-gray-600">Issues automatically ranked by urgency and impact on your decision</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Market Integration</h3>
                  <p className="text-gray-600">Property details and market data to contextualize your findings</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Clock className="h-6 w-6 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Fast Processing</h3>
                  <p className="text-gray-600">Complete analysis in under 2 minutes - no waiting around</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Expert Connections</h3>
                  <p className="text-gray-600">Connect with local service providers for any issues found</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Actionable Insights</h3>
                  <p className="text-gray-600">Clear next steps and recommendations for every finding</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Upload your home inspection report and get your analysis in minutes
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="text-lg px-8 py-4"
          >
            Analyze My Inspection Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
