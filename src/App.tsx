import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Services from "./pages/Services.tsx";
import Pricing from "./pages/Pricing.tsx";
import Tarifs from "./pages/Tarifs.tsx";
import About from "./pages/About.tsx";
import Blog from "./pages/Blog.tsx";
import Contact from "./pages/Contact.tsx";
import Auth from "./pages/Auth.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import NotFound from "./pages/NotFound.tsx";
import DataDiagPage from "./pages/DataDiagPage.tsx";
import GrowthPilotPage from "./pages/GrowthPilotPage.tsx";
import LoyaltyLoopPage from "./pages/LoyaltyLoopPage.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import { usePageTracking } from "./hooks/usePageTracking.ts";

const queryClient = new QueryClient();

const RouterWithTracking = ({ children }: { children: React.ReactNode }) => {
  usePageTracking();
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RouterWithTracking>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/index" element={<Navigate to="/" replace />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<ProtectedRoute><ErrorBoundary name="dashboard"><Dashboard /></ErrorBoundary></ProtectedRoute>} />
            <Route path="/datadiag-demo" element={<DataDiagPage />} />
            <Route path="/growthpilot-demo" element={<GrowthPilotPage />} />
            <Route path="/loyaltyloop-demo" element={<LoyaltyLoopPage />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<Services />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/tarifs" element={<Tarifs />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </RouterWithTracking>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
