
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import PrivateRoute from "./components/admin/PrivateRoute";

// Lazy load pages
const NewsDetail = lazy(() => import("./pages/NewsDetail"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));
const FeaturedArticlesPage = lazy(() => import("./pages/FeaturedArticlesPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const UsersManager = lazy(() => import("./pages/admin/UsersManager"));
const FrontendSettings = lazy(() => import("./pages/admin/FrontendSettings"));
const WeatherConfig = lazy(() => import("./pages/admin/WeatherConfig"));
const LayoutConfig = lazy(() => import("./pages/admin/LayoutConfig"));
const HtmlBlocksManager = lazy(() => import("./pages/admin/HtmlBlocksManager"));
const VideosManager = lazy(() => import("./pages/admin/VideosManager"));
const AdsManager = lazy(() => import("./pages/admin/AdsManager"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <TooltipProvider>
          <div className="min-h-screen bg-background font-sans antialiased" lang="pt-BR">
            <BrowserRouter>
              <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              }>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/news/:slug" element={<NewsDetail />} />
                  <Route path="/category/:slug" element={<CategoryPage />} />
                  <Route path="/categorias" element={<CategoriesPage />} />
                  <Route path="/destaques" element={<FeaturedArticlesPage />} />
                  <Route path="/busca" element={<SearchPage />} />
                  <Route path="/painel" element={<AdminLogin />} />
                  <Route path="/admin/*" element={
                    <PrivateRoute>
                      <Routes>
                        <Route element={<AdminLayout />}>
                          <Route path="dashboard" element={<Dashboard />} />
                          <Route path="users" element={<UsersManager />} />
                          <Route path="frontend" element={<FrontendSettings />} />
                          <Route path="weather" element={<WeatherConfig />} />
                          <Route path="layout" element={<LayoutConfig />} />
                          <Route path="html-blocks" element={<HtmlBlocksManager />} />
                          <Route path="videos" element={<VideosManager />} />
                          <Route path="ads" element={<AdsManager />} />
                        </Route>
                      </Routes>
                    </PrivateRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
