
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";

import Index from "@/pages/Index";
import NewsDetail from "@/pages/NewsDetail";
import CategoryPage from "@/pages/CategoryPage";
import CategoriesPage from "@/pages/CategoriesPage";
import FeaturedArticlesPage from "@/pages/FeaturedArticlesPage";
import NotFound from "@/pages/NotFound";
import AdminLogin from "@/pages/AdminLogin";
import AdminLayout from "@/pages/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import WeatherConfig from "@/pages/admin/WeatherConfig";
import AdsManager from "@/pages/admin/AdsManager";
import HtmlBlocksManager from "@/pages/admin/HtmlBlocksManager";
import UsersManager from "@/pages/admin/UsersManager";
import VideosManager from "@/pages/admin/VideosManager";
import FrontendSettings from "@/pages/admin/FrontendSettings";
import PrivateRoute from "@/components/admin/PrivateRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="news-theme">
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/featured" element={<FeaturedArticlesPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/category/:slug/:filter" element={<CategoryPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            
            {/* Painel Administrativo */}
            <Route path="/painel" element={<AdminLogin />} />
            <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="ads" element={<AdsManager />} />
              <Route path="blocks" element={<HtmlBlocksManager />} />
              <Route path="users" element={<UsersManager />} />
              <Route path="videos" element={<VideosManager />} />
              <Route path="settings" element={<FrontendSettings />} />
              <Route path="weather" element={<WeatherConfig />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
