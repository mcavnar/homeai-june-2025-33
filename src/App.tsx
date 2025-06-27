
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Upload from "./pages/Upload";
import Results from "./pages/Results";
import Synopsis from "./pages/results/Synopsis";
import IssuesList from "./pages/results/IssuesList";
import KeySystems from "./pages/results/KeySystems";
import ServiceProviders from "./pages/results/ServiceProviders";
import Negotiation from "./pages/results/Negotiation";
import InspectionReport from "./pages/results/InspectionReport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Upload />} />
          <Route path="/results" element={<Results />}>
            <Route index element={<Navigate to="/results/synopsis" replace />} />
            <Route path="synopsis" element={<Synopsis />} />
            <Route path="issues" element={<IssuesList />} />
            <Route path="systems" element={<KeySystems />} />
            <Route path="providers" element={<ServiceProviders />} />
            <Route path="negotiation" element={<Negotiation />} />
            <Route path="report" element={<InspectionReport />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
