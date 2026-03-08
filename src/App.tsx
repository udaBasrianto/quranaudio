import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import OfflineStorage from "./pages/OfflineStorage";
import QuranQuiz from "./pages/QuranQuiz";
import PrayerTimesPage from "./pages/PrayerTimesPage";
import DzikirCounterPage from "./pages/DzikirCounterPage";
import DzikirPagiPetangPage from "./pages/DzikirPagiPetangPage";
import QuranIndexPage from "./pages/QuranIndexPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/offline-storage" element={<OfflineStorage />} />
          <Route path="/quran-quiz" element={<QuranQuiz />} />
          <Route path="/prayer-times" element={<PrayerTimesPage />} />
          <Route path="/dzikir-counter" element={<DzikirCounterPage />} />
          <Route path="/dzikir-pagi-petang" element={<DzikirPagiPetangPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
