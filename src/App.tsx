import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { useEffect } from "react";
import { clearStaleData } from "@/utils/cleanupUtils";
import Home from "@/pages/Home";
import Upload from "@/pages/Upload";
import Results from "@/pages/Results";
import Synopsis from "@/pages/results/Synopsis";
import Auth from "@/pages/Auth";
import AnonymousUpload from "@/pages/AnonymousUpload";
import AnonymousResults from "@/pages/AnonymousResults";
import AnonymousSynopsis from "@/pages/anonymous-results/Synopsis";
import ProsInquiry from "@/pages/ProsInquiry";
import ServiceProsInquiry from "@/pages/ServiceProsInquiry";
import PDFSummarizer from "@/components/PDFSummarizer";
import SampleSurvey from "@/pages/SampleSurvey";
import SharedReport from "@/pages/SharedReport";
import Account from "@/pages/Account";
import UserReports from "@/pages/UserReports";
import ReportDetails from "@/pages/ReportDetails";
import RealtorAnalysis from "@/pages/RealtorAnalysis";

const queryClient = new QueryClient();

const App = () => {
  // Clear stale data on app startup
  useEffect(() => {
    clearStaleData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AnalyticsProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/results" element={<Results />} />
                <Route path="/results/synopsis" element={<Synopsis />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/anonymous-upload" element={<AnonymousUpload />} />
                <Route path="/anonymous-results" element={<AnonymousResults />} >
                  <Route path="synopsis" element={<AnonymousSynopsis />} />
                </Route>
                <Route path="/pros-inquiry" element={<ProsInquiry />} />
                <Route path="/service-pros-inquiry" element={<ServiceProsInquiry />} />
                <Route path="/pdf-summarizer" element={<PDFSummarizer />} />
                <Route path="/sample-survey" element={<SampleSurvey />} />
                <Route path="/shared-report/:token" element={<SharedReport />} />
                <Route path="/account" element={<Account />} />
                <Route path="/user-reports" element={<UserReports />} />
                <Route path="/user-reports/:reportId" element={<ReportDetails />} />
                <Route path="/realtor-analysis" element={<RealtorAnalysis />} />
              </Routes>
            </BrowserRouter>
          </AnalyticsProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
