
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import AuthPage from "./pages/AuthPage";
import AnonymousUpload from "./pages/AnonymousUpload";
import UploadPage from "./pages/UploadPage";
import Account from "./pages/Account";
import Results from "./pages/Results";
import Synopsis from "./pages/results/Synopsis";
import IssuesList from "./pages/results/IssuesList";
import KeySystems from "./pages/results/KeySystems";
import ServiceProviders from "./pages/results/ServiceProviders";
import Negotiation from "./pages/results/Negotiation";
import InspectionReport from "./pages/results/InspectionReport";
import AnonymousResults from "./pages/AnonymousResults";
import AnonymousSynopsis from "./pages/anonymous/AnonymousSynopsis";
import DemoResults from "./pages/DemoResults";
import DemoSynopsis from "./pages/demo/DemoSynopsis";
import DemoIssuesList from "./pages/demo/DemoIssuesList";
import DemoKeySystems from "./pages/demo/DemoKeySystems";
import DemoServiceProviders from "./pages/demo/DemoServiceProviders";
import DemoNegotiation from "./pages/demo/DemoNegotiation";
import DemoInspectionReport from "./pages/demo/DemoInspectionReport";
import SharedReport from "./pages/SharedReport";
import SharedSynopsis from "./pages/shared/SharedSynopsis";
import SharedIssuesList from "./pages/shared/SharedIssuesList";
import SharedKeySystems from "./pages/shared/SharedKeySystems";
import SharedServiceProviders from "./pages/shared/SharedServiceProviders";
import SharedNegotiation from "./pages/shared/SharedNegotiation";
import SharedInspectionReport from "./pages/shared/SharedInspectionReport";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnalyticsProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/anonymous-upload" element={<AnonymousUpload />} />
              <Route path="/upload" element={
                <ProtectedRoute>
                  <UploadPage />
                </ProtectedRoute>
              } />
              <Route path="/account" element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              } />
              <Route path="/results" element={
                <ProtectedRoute requiresReport={true}>
                  <Results />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/results/synopsis" replace />} />
                <Route path="synopsis" element={<Synopsis />} />
                <Route path="issues" element={<IssuesList />} />
                <Route path="systems" element={<KeySystems />} />
                <Route path="providers" element={<ServiceProviders />} />
                <Route path="negotiation" element={<Negotiation />} />
                <Route path="report" element={<InspectionReport />} />
              </Route>
              {/* Anonymous Results Routes */}
              <Route path="/anonymous-results" element={<AnonymousResults />}>
                <Route index element={<Navigate to="/anonymous-results/synopsis" replace />} />
                <Route path="synopsis" element={<AnonymousSynopsis />} />
                <Route path="issues" element={<IssuesList />} />
                <Route path="systems" element={<KeySystems />} />
                <Route path="providers" element={<ServiceProviders />} />
                <Route path="negotiation" element={<Negotiation />} />
                <Route path="report" element={<InspectionReport />} />
              </Route>
              <Route path="/demo" element={<DemoResults />}>
                <Route index element={<Navigate to="/demo/synopsis" replace />} />
                <Route path="synopsis" element={<DemoSynopsis />} />
                <Route path="issues" element={<DemoIssuesList />} />
                <Route path="systems" element={<DemoKeySystems />} />
                <Route path="providers" element={<DemoServiceProviders />} />
                <Route path="negotiation" element={<DemoNegotiation />} />
                <Route path="report" element={<DemoInspectionReport />} />
              </Route>
              {/* Shared Report Routes */}
              <Route path="/shared/:token" element={<SharedReport />}>
                <Route index element={<Navigate to="synopsis" replace />} />
                <Route path="synopsis" element={<SharedSynopsis />} />
                <Route path="issues" element={<SharedIssuesList />} />
                <Route path="systems" element={<SharedKeySystems />} />
                <Route path="providers" element={<SharedServiceProviders />} />
                <Route path="negotiation" element={<SharedNegotiation />} />
                <Route path="report" element={<SharedInspectionReport />} />
              </Route>
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnalyticsProvider>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
