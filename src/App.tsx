
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";

import Index from "@/pages/Index";
import NewsDetail from "@/pages/NewsDetail";
import CategoryPage from "@/pages/CategoryPage";
import CategoriesPage from "@/pages/CategoriesPage";
import NotFound from "@/pages/NotFound";
import AdminLogin from "@/pages/AdminLogin";
import WeatherConfig from "@/pages/admin/WeatherConfig";
import Dashboard from "@/pages/admin/Dashboard";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="news-theme">
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/category/:slug/:filter" element={<CategoryPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/weather" element={<WeatherConfig />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
