
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMetaConversions } from '@/hooks/useMetaConversions';
import FileUploadSection from '@/components/FileUploadSection';
import ProcessingStatus from '@/components/ProcessingStatus';
import { useAnonymousPDFProcessor } from '@/hooks/useAnonymousPDFProcessor';
import { Shield, Users, Clock, TrendingUp, CheckCircle, Star, Timer, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const AnonymousUpload = () => {
  const navigate = useNavigate();
  const { trackConversion } = useMetaConversions();
  
  const {
    file,
    isProcessing,
    overallProgress,
    error,
    handleFileSelect,
    processPDF,
    resetProcessor,
    getPhaseMessage,
    getEstimatedTimeRemaining,
  } = useAnonymousPDFProcessor();

  const handleFileSelectWithTracking = (selectedFile: File) => {
    trackConversion({
      eventName: 'Lead',
      contentName: 'Anonymous PDF Upload Started'
    });

    handleFileSelect(selectedFile);
  };

  const handleProcessPDF = async () => {
    console.log('=== STARTING PDF PROCESSING FROM ANONYMOUS UPLOAD ===');
    
    const result = await processPDF();
    
    console.log('=== PDF PROCESSING COMPLETED ===');
    console.log('Result received:', result);
    
    if (result) {
      console.log('=== RESULT VALIDATION ===');
      console.log('Has analysis:', !!result.analysis);
      console.log('Has property data:', !!result.propertyData);
      console.log('Has negotiation strategy:', !!result.negotiationStrategy);
      console.log('Address:', result.address);
      console.log('Session ID:', result.sessionId);
      
      // Track analysis completion
      const totalRepairCosts = result.analysis?.costSummary?.totalEstimatedCost || 0;
      console.log('Total repair costs for tracking:', totalRepairCosts);
      
      await trackConversion({
        eventName: 'AnalysisComplete',
        value: totalRepairCosts,
        contentName: 'Anonymous PDF Analysis Complete'
      });

      console.log('=== NAVIGATING TO ACCOUNT CREATION ===');
      console.log('Navigation state being passed:', {
        hasAnalysis: !!result.analysis,
        hasPropertyData: !!result.propertyData,
        hasNegotiationStrategy: !!result.negotiationStrategy,
        address: result.address,
        sessionId: result.sessionId
      });

      // Navigate to account creation page with complete data via state
      navigate('/account-creation', { 
        state: result
      });
    } else {
      console.error('=== NO RESULT FROM PDF PROCESSING ===');
      console.error('ProcessPDF returned null - analysis failed');
    }
  };

  const handleViewDemo = () => {
    navigate('/demo');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto p-6">
        
        {/* Hero Section - Conversion Optimized */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Timer className="h-4 w-4" />
              Free Analysis - Usually $297
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Discover <span className="text-green-600">$15,000+</span> in Hidden Repair Costs
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed">
              Our AI analyzes your inspection report in 2 minutes and reveals the exact repair costs, 
              negotiation strategies, and trusted contractors - saving you 15+ hours of research.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                <span>2,847 reports analyzed this month</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>Average savings: $18,500</span>
              </div>
            </div>
          </div>

          {/* Social Proof - Testimonials */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="p-4 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  "Saved me $22,000 on my home purchase! The hidden electrical issues would have cost me a fortune."
                </p>
                <p className="text-xs text-gray-500">- Sarah M., First-time buyer</p>
              </CardContent>
            </Card>
            
            <Card className="p-4 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  "Negotiated $35,000 off the asking price using their detailed repair estimates. Incredible!"
                </p>
                <p className="text-xs text-gray-500">- Mark T., Real estate investor</p>
              </CardContent>
            </Card>
            
            <Card className="p-4 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  "Found $8,000 in HVAC repairs that weren't obvious. The contractor recommendations were spot-on."
                </p>
                <p className="text-xs text-gray-500">- Jessica R., Home buyer</p>
              </CardContent>
            </Card>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-8 mb-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Bank-level security</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <span>100% confidential</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <span>97% accuracy rate</span>
            </div>
          </div>

          {/* Demo CTA */}
          <div className="mb-8">
            <Button 
              onClick={handleViewDemo}
              variant="outline"
              className="bg-white/90 backdrop-blur-sm hover:bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Eye className="mr-2 h-4 w-4" />
              See Sample Analysis Report
            </Button>
          </div>
        </div>

        {/* Main Upload Section */}
        <div className="max-w-4xl mx-auto">
          <FileUploadSection
            file={file}
            isProcessing={isProcessing}
            overallProgress={overallProgress}
            phaseMessage={getPhaseMessage()}
            error={error}
            onFileSelect={handleFileSelectWithTracking}
            onProcess={handleProcessPDF}
            onReset={resetProcessor}
          />

          <ProcessingStatus
            isProcessing={isProcessing}
            overallProgress={overallProgress}
            phaseMessage={getPhaseMessage()}
            estimatedTimeRemaining={getEstimatedTimeRemaining()}
          />
        </div>

        {/* What You'll Get Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            What You'll Get in Your Free Analysis
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Exact Repair Costs</h3>
                </div>
                <p className="text-gray-600">
                  Detailed breakdown of every repair with labor and material costs based on your local market rates.
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Trusted Contractors</h3>
                </div>
                <p className="text-gray-600">
                  Vetted professionals in your area with pricing, reviews, and availability for each repair type.
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Negotiation Strategy</h3>
                </div>
                <p className="text-gray-600">
                  Proven tactics and talking points to negotiate repair credits or price reductions with sellers.
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Priority Ranking</h3>
                </div>
                <p className="text-gray-600">
                  Issues ranked by urgency and cost impact so you know what to address first and what can wait.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Updated Progress Indicator */}
        <div className="mt-12 flex justify-center">
          <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-green-700">Upload Report</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm">
                2
              </div>
              <span className="ml-2 text-sm text-gray-600">Get Analysis</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm">
                3
              </div>
              <span className="ml-2 text-sm text-gray-600">Save & Negotiate</span>
            </div>
          </div>
        </div>

        {/* Money-Back Guarantee */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto p-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
            <CardContent className="p-0">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Shield className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">100% Satisfaction Guarantee</h3>
              </div>
              <p className="text-gray-600 mb-4">
                If you're not completely satisfied with your analysis, we'll refund every penny. 
                No questions asked.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                <span>✓ Secure & confidential</span>
                <span>✓ No spam guarantee</span>
                <span>✓ Delete anytime</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnonymousUpload;
