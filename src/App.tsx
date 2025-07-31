import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import NgoPage from "./pages/NgoPage";
import RestaurantPage from "./pages/RestaurantPage";
import StorePage from "./pages/StorePage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AboutPage from "./pages/AboutPage";
import FeedbackPage from "./pages/FeedbackPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import CreateListingPage from "./pages/CreateListingPage";
import BrowseListingsPage from "./pages/BrowseListingsPage";
import MyListingsPage from "./pages/MyListingsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import NgoDashboardPage from "./pages/NgoDashboardPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import { useBackNavigation } from "./hooks/use-back-navigation";

const queryClient = new QueryClient();

// Wrapper component to handle back navigation
const AppRoutes = () => {
  useBackNavigation();
  
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/ngo" element={<NgoPage />} />
      <Route path="/restaurant" element={<RestaurantPage />} />
      <Route path="/store" element={<StorePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/feedback" element={<FeedbackPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/create-listing" element={<CreateListingPage />} />
      <Route path="/browse-listings" element={<BrowseListingsPage />} />
      <Route path="/my-listings" element={<MyListingsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/ngo-dashboard" element={<NgoDashboardPage />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/admin_dashboard" element={<AdminDashboardPage />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
