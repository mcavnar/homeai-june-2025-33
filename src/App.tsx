
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { useEffect } from "react";
import { clearStaleData } from "@/utils/cleanupUtils";
import Landing from "@/pages/Landing";
import Upload from "@/pages/Upload";
import Results from "@/pages/Results";
import Synopsis from "@/pages/results/Synopsis";
import AuthPage from "@/pages/AuthPage";
import AnonymousUpload from "@/pages/AnonymousUpload";
import AnonymousResults from "@/pages/AnonymousResults";
import AnonymousSynopsis from "@/pages/anonymous/AnonymousSynopsis";
import PDFSummarizer from "@/components/PDFSummarizer";
import SharedReport from "@/pages/SharedReport";
import Account from "@/pages/Account";
import UploadPage from "@/pages/UploadPage";
import EmailCapture from "@/pages/EmailCapture";
import DemoResults from "@/pages/DemoResults";
import AccountCreation from "@/pages/AccountCreation";
import NotFound from "@/pages/NotFound";

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
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnalyticsProvider>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/upload-page" element={<UploadPage />} />
                <Route path="/email-capture" element={<EmailCapture />} />
                <Route path="/results" element={<Results />} />
                <Route path="/results/synopsis" element={<Synopsis />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/anonymous-upload" element={<AnonymousUpload />} />
                <Route path="/anonymous-results" element={<AnonymousResults />} >
                  <Route path="synopsis" element={<AnonymousSynopsis />} />
                </Route>
                <Route path="/account-creation" element={<AccountCreation />} />
                <Route path="/pdf-summarizer" element={<PDFSummarizer />} />
                <Route path="/shared-report/:token" element={<SharedReport />} />
                <Route path="/account" element={<Account />} />
                <Route path="/demo-results" element={<DemoResults />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnalyticsProvider>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
